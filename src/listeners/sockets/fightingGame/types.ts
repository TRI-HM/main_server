export enum ROOMS {
    DISPLAY = "display",
    GAME = "game",
}

export type ClientType = ROOMS.DISPLAY | ROOMS.GAME;

export interface ClientInfo {
    socketId: string;
    type: ClientType;
    nickname: string;
    connectedAt: Date;
}

export interface RegisterData {
    type: ClientType;
    nickname?: string;
}