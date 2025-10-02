import { Socket } from "socket.io";

export function wrapAsyncSocket(
  handler: (socket: Socket, data: any, callback?: Function) => Promise<void>
) {
  return (socket: Socket, data: any, callback?: Function) => {
    Promise.resolve(handler(socket, data, callback)).catch((err) => {
      if (typeof callback === "function") {
        callback(err);
      } else {
        socket.emit("error", err.message || "Unknown error");
      }
    });
  };
}