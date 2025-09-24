import { Server, Socket } from "socket.io";
import realEstateService from "../../modules/realEstate/realEstate.service";
import { wrapAsyncSocket } from "../../../middleware/wrapAsyncSocket";
import { RealEstateApartmentClientType } from "../../../models/realEstate.apartment";
import realEstateUseCase from "../../useCases/realEstate.useCases";
import { validateApartmentData } from "../../../middleware/realEstate.validationSchema";

const realEstate = wrapAsyncSocket(
  async (socket: Socket, io: Server) => {

    // Additional event handlers (all, findById, create, update, delete, clicked, timeSpent) would follow the same pattern
    // socket.on('realEstate:all', async () => {
    //   console.log('🎯 Controller received realEstate:all event');
    //   try {
    //     const result = await realEstateService.all(realEstateUseCase)();
    //     socket.emit('realEstate:allResponse', {
    //       success: true,
    //       message: 'Fetched all real estates',
    //       data: result,
    //       timestamp: new Date().toISOString()
    //     });
    //     console.log('✅ Successfully fetched all real estates');
    //   } catch (error) {
    //     console.error('❌ Error fetching all real estates:', error);
    //     socket.emit('realEstate:allResponse', {
    //       success: false,
    //       message: 'Server error occurred',
    //       error: error instanceof Error ? error.message : 'Unknown error'
    //     });
    //   }
    // });
    // socket.on('realEstate:findById', async (id: string) => {
    //   console.log('🎯 Controller received realEstate:findById event with id:', id)
    //   try {
    //     const result = await realEstateService.findById(realEstateService)(id)
    //     socket.emit('realEstate:findByIdResponse', {
    //       success: true,
    //       message: `Fetched real estate with id: ${id}`,
    //       data: result,
    //       timestamp: new Date().toISOString()
    //     });
    //     console.log('✅ Successfully fetched real estate by id');
    //   } catch (error) {
    //     console.error('❌ Error fetching real estate by id:', error);
    //     socket.emit('realEstate:findByIdResponse', {
    //       success: false,
    //       message: 'Server error occurred',
    //       error: error instanceof Error ? error.message : 'Unknown error'
    //     });
    //   }
    // });
    socket.on('realEstate:create', async (data: Partial<RealEstateApartmentClientType>) => {
      console.log('🎯 Controller received realEstate:create event with data:', data);
      try {
        const validation = await validateApartmentData(data);
        if (!validation.isValid) {
          console.log('❌ Validation failed:', validation.errors);
          return socket.emit('realEstate:createResponse', {
            success: false,
            message: 'Validation failed',
            errors: validation.errors,
            timestamp: new Date().toISOString()
          });
        }
        const result = await realEstateService.create(validation.validatedData);
        console.log('✅ Successfully created new real estate');
        return socket.emit('realEstate:createResponse', {
          success: true,
          message: `Created new real estate`,
          data: result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ Error creating real estate:', error);
        return socket.emit('realEstate:createResponse', {
          success: false,
          message: 'Server error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  });

export default realEstate;