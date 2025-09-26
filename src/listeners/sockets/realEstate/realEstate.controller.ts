import { Server, Socket } from "socket.io";
import realEstateService from "../../modules/realEstate/realEstate.service";
import { wrapAsyncSocket } from "../../../middleware/wrapAsyncSocket";
import { RealEstateApartmentClientType } from "../../../models/realEstate.apartment";
import { validateApartmentData } from "../../../middleware/realEstate.validationSchema";

const realEstate = wrapAsyncSocket(
  async (socket: Socket, io: Server) => {
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
    socket.on('realEstate:all', async () => {
      console.log('🎯 Controller received realEstate:all event');
      try {
        const result = await realEstateService.all();
        return socket.emit('realEstate:allResponse', {
          success: true,
          message: `Retrieved all real estate`,
          data: result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ Error retrieving all real estate:', error);
        return socket.emit('realEstate:allResponse', {
          success: false,
          message: 'Server error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
    socket.on('realEstate:update', async (data: Partial<RealEstateApartmentClientType>) => {
      console.log('🎯 Controller received realEstate:update event with data:', data)
      const { id, ...updateData } = data;
      try {
        if (!id) {
          return socket.emit('realEstate:updateResponse', {
            success: false,
            message: 'ID is required for update',
            timestamp: new Date().toISOString()
          });
        }

        const validation = await validateApartmentData(updateData);
        if (!validation.isValid) {
          console.log('❌ Validation failed:', validation.errors);
          return socket.emit('realEstate:updateResponse', {
            success: false,
            message: 'Validation failed',
            errors: validation.errors,
            timestamp: new Date().toISOString()
          });
        }

        const result = await realEstateService.update(id, validation.validatedData);
        if (!result) {
          console.log('❌ Real estate not found for id:', id);
          return socket.emit('realEstate:updateResponse', {
            success: false,
            message: `Real estate not found for id: ${id}`,
            timestamp: new Date().toISOString()
          });
        }
        console.log('✅ Successfully updated real estate for id:', id);
        return socket.broadcast.emit('realEstate:updateResponse', {
          success: true,
          message: `Updated real estate for id: ${id}`,
          data: result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ Error updating real estate for id:', id, error);
        return socket.emit('realEstate:updateResponse', {
          success: false,
          message: 'Server error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }
);

export default realEstate;