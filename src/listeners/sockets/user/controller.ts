import { Server, Socket } from "socket.io";
import userService from "../../../services/userService";

const userListener = (socket: Socket, io: Server) => {
  socket.on("user:login", (data) => {
    console.log("User logged in:", data);

    let newUser = userService.create(data);
    if (!newUser) {
      console.log("User creation failed");
      // return res.status(500).json({ message: "User creation failed" }); //Todo : handle error properly. Create wrapper for error handling
    }
    socket.emit("user:login:response", {
      message: "User logged in successfully",
      user: data,
    });
  });
};

export default userListener;