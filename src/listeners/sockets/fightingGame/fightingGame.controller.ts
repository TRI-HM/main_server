import { Server, Socket } from "socket.io";
import { StatusCodes } from "http-status-codes";
import ioCustom from "../../../util/ioCustom";
import { wrapAsyncSocket } from "../../../middleware/wrapAsyncSocket";
import FightingGameEvent from "./event.controller";
import { ClientInfo, RegisterData, ROOMS } from "./types";

const connectedClients = new Map<string, ClientInfo>();
const score = new Map<string, number>();
const scoreWinner = 10;

const fightingGameController = wrapAsyncSocket(
    async (socket: Socket, io: Server) => {
        // Register client
        socket.on(FightingGameEvent.REGISTER, async (data: RegisterData) => {
            // Client tự xác định loại khi kết nối vào server
            const { type, nickname } = data;
            if (type !== ROOMS.DISPLAY && type !== ROOMS.GAME) {
                return socket.emit(
                    FightingGameEvent.REGISTER,
                    ioCustom.toResponseError({ code: StatusCodes.BAD_REQUEST, message: 'Type is invalid' }));
            }
            if (!nickname) {
                return socket.emit(
                    FightingGameEvent.REGISTER,
                    ioCustom.toResponseError({ code: StatusCodes.BAD_REQUEST, message: 'Nickname is required' }));
            }
            // Lưu client vào map
            connectedClients.set(socket.id, {
                socketId: socket.id,
                type,
                nickname,
                connectedAt: new Date(),
            });

            // Join room
            const room = type === ROOMS.DISPLAY ? ROOMS.DISPLAY : ROOMS.GAME;
            socket.join(room);

            // Emit to all clients in the room
            io.to(room).emit(FightingGameEvent.REGISTER,
                ioCustom.toResponse(StatusCodes.OK, 'Client registered', connectedClients.get(socket.id)));

            // TODO: Test code. Remove later. kiểm tra lại map connectedClients khi user disconnect
            connectedClients.forEach((client: ClientInfo) => {
                console.log(`✅ Client ${client.socketId} joined room ${room} ${client.type} ${client.nickname}`);
            });
        });

        // server listening ready
        socket.on(FightingGameEvent.READY, async () => {
            const client = connectedClients.get(socket.id);
            // game to server ready
            if (client?.type === ROOMS.GAME) {
                // server to display ready, game will wait for display ready
                io
                    .to(ROOMS.DISPLAY)
                    .emit(FightingGameEvent.READY, ioCustom.toResponse(StatusCodes.OK, 'Client ready', client));
            }
            // display to server ready
            if (client?.type === ROOMS.DISPLAY) {
                // server to game ready, game bắt đầu 
                io
                    .to(ROOMS.GAME)
                    .emit(FightingGameEvent.START, ioCustom.toResponse(StatusCodes.OK, 'Game started', client));
            }
        });

        // server listening score
        socket.on(FightingGameEvent.SCORE, async () => {
            const client = connectedClients.get(socket.id);
            if (client?.type === ROOMS.GAME) {
                // update score
                score.set(client.socketId, (score.get(client.socketId) || 0) + 1);
                // server to display score, display will update score realtime
                io.to(ROOMS.DISPLAY).emit(FightingGameEvent.SCORE, ioCustom.toResponse(StatusCodes.OK, 'Score updated', score.get(client.socketId)));

                if ((score.get(client?.socketId) || 0) >= scoreWinner) {
                    // game end
                    io.to(ROOMS.DISPLAY).emit(FightingGameEvent.END, ioCustom.toResponse(StatusCodes.OK, 'Game ended', client));
                    io.to(ROOMS.GAME).emit(FightingGameEvent.END, ioCustom.toResponse(StatusCodes.OK, 'Game ended', client));
                    return;
                }
            }
        });
       
        // server listening restart
        socket.on(FightingGameEvent.RESTART, async () => {
            const client = connectedClients.get(socket.id);
            if (client?.type === ROOMS.GAME) {
                // server to display restart, display will update restart realtime
                io.to(ROOMS.DISPLAY).emit(FightingGameEvent.RESTART, ioCustom.toResponse(StatusCodes.OK, 'Restart', client));
            }
        });

        // Disconnect client
        socket.on("disconnect", () => {
            console.log(`❌ Client ${socket.id} disconnected`);
            connectedClients.delete(socket.id);
            const client = connectedClients.get(socket.id);
            if (client) {
                // Emit to all clients in the room
                io.to(client.type).emit(FightingGameEvent.REGISTER,
                    ioCustom.toResponse(StatusCodes.OK, 'Client registered', connectedClients.get(socket.id)));
            }
        });
    });

export default fightingGameController;