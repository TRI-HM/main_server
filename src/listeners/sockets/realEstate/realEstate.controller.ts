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

    // Additional event handlers (all, findById, create, update, delete, clicked, timeSpent) would follow the same pattern
    socket.on('realEstate:all', async () => {
      console.log('🎯 Controller received realEstate:all event');
      try {
        const result = await realEstateService.all(realEstateService)();
        socket.emit('realEstate:allResponse', {
          success: true,
          message: 'Fetched all real estates',
          data: result,
          timestamp: new Date().toISOString()
        });
        console.log('✅ Successfully fetched all real estates');
      } catch (error) {
        console.error('❌ Error fetching all real estates:', error);
        socket.emit('realEstate:allResponse', {
          success: false,
          message: 'Server error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
    socket.on('realEstate:findById', async (id: string) => {
      console.log('🎯 Controller received realEstate:findById event with id:', id)
      try {
        const result = await realEstateService.findById(realEstateService)(id)
        socket.emit('realEstate:findByIdResponse', {
          success: true,
          message: `Fetched real estate with id: ${id}`,
          data: result,
          timestamp: new Date().toISOString()
        });
        console.log('✅ Successfully fetched real estate by id');
      } catch (error) {
        console.error('❌ Error fetching real estate by id:', error);
        socket.emit('realEstate:findByIdResponse', {
          success: false,
          message: 'Server error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
    socket.on('realEstate:create', async (data: Partial<{ id: string; block: string; floor: string; apartment: string; location: string; status: string; }>) => {
      console.log('🎯 Controller received realEstate:create event with data:', data);
      try {
        const result = await realEstateService.create(realEstateService)(data);
        socket.emit('realEstate:createResponse', {
          success: true,
          message: `Created new real estate`,
          data: result,
          timestamp: new Date().toISOString()
        });
        console.log('✅ Successfully created new real estate');
      } catch (error) {
        console.error('❌ Error creating real estate:', error);
        socket.emit('realEstate:createResponse', {
          success: false,
          message: 'Server error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  });

export default realEstate;