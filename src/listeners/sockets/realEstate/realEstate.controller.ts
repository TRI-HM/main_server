import { Server, Socket } from "socket.io";
import realEstateApartmentService from "../../modules/realEstate/realEstate.apartment.service";
import { wrapAsyncSocket } from "../../../middleware/wrapAsyncSocket";
import { RealEstateApartmentClientType } from "../../../models/realEstate.apartment";
import { validateApartmentData } from "../../../middleware/realEstate.validationSchema";
import realEstateViewService from "../../modules/realEstate/realEstate.view.service";

const realEstate = wrapAsyncSocket(
  async (socket: Socket, io: Server) => {
    // Apartment Events
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
        const result = await realEstateApartmentService.create(validation.validatedData);
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
        const result = await realEstateApartmentService.all();
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

        const result = await realEstateApartmentService.update(id, validation.validatedData);
        if (!result) {
          console.log('❌ Real estate not found for id:', id);
          return socket.emit('realEstate:updateResponse', {
            success: false,
            message: `Real estate not found for id: ${id}`,
            timestamp: new Date().toISOString()
          });
        }
        console.log('✅ Successfully updated real estate for id:', id);
        return io.emit('realEstate:updateResponse', {
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
    // View Events
    socket.on('realEstate:create:view', async ({ apartmentId }: { apartmentId: string }) => {
      console.log('🎯 Controller received realEstate:create:view event with data:', { apartmentId });
      try {

        const apartment = await realEstateApartmentService.findById(apartmentId);
        if (!apartment) {
          console.log('❌ Apartment not found for id:', apartmentId);
          return socket.emit('realEstate:create:viewResponse', {
            success: false,
            message: `Apartment not found for id: ${apartmentId}`,
            timestamp: new Date().toISOString()
          });
        }

        const dataView = { apartmentId, location: apartment.location };

        const result = await realEstateViewService.create(dataView);
        console.log('✅ Successfully created new real estate view');
        return io.emit('realEstate:create:viewResponse', {
          success: true,
          message: `Created new real estate view`,
          data: result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ Error creating real estate view:', error);
        return socket.emit('realEstate:create:viewResponse', {
          success: false,
          message: 'Server error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
    socket.on('realEstate:all:view', async () => {
      console.log('🎯 Controller received realEstate:all:view event');
      try {
        const result = await realEstateViewService.all();
        return socket.emit('realEstate:all:viewResponse', {
          success: true,
          message: `Retrieved all real estate views`,
          data: result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ Error retrieving all real estate views:', error);
        return socket.emit('realEstate:all:viewResponse', {
          success: false,
          message: 'Server error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }
);

export default realEstate;