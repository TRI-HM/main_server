import { Server, Socket } from "socket.io";
import { StatusCodes } from "http-status-codes";
import ioCustom from "../../../util/ioCustom";
import { wrapAsyncSocket } from "../../../util/wrapAsyncSocket";
import FightingGameEvent from "./event.controller";
import { ClientInfo, RegisterData, ROOMS } from "./types";

const connectedClients = new Map<string, ClientInfo>();

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