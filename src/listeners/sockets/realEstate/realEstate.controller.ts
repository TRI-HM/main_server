import { Server, Socket } from "socket.io";
import realEstateService from "../../modules/realEstate/realEstate.service";
import { wrapAsyncSocket } from "../../../middleware/wrapAsyncSocket";

const realEstate = wrapAsyncSocket(
  async (socket: Socket, io: Server) => {
    socket.on('realEstate:ping', async () => {
      console.log('🎯 Controller received realEstate:ping event');

      try {
        // Controller responsibilities:
        // - Handle socket events
        // - Input validation (if needed)
        // - Call service layer with HOF pattern
        // - Handle response/error
        // - Emit back to client

        // HOF pattern: service.ping(service)() 
        const result = await realEstateService.ping(realEstateService)();

        // Emit success response
        socket.emit('realEstate:pingResponse', {
          success: true,
          message: 'Pong from server!',
          data: result,
          timestamp: new Date().toISOString()
        });

        console.log('✅ Successfully handled ping request');

      } catch (error) {
        console.error('❌ Error handling ping:', error);

        // Emit error response
        socket.emit('realEstate:pingResponse', {
          success: false,
          message: 'Server error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  });

export default realEstate;