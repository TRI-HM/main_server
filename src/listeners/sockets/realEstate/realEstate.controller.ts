import { Server, Socket } from "socket.io";
import realEstateService from "../../modules/realEstate/realEstate.service";
import { wrapAsyncSocket } from "../../../middleware/wrapAsyncSocket";
import { RealEstateApartmentClientType } from "../../../models/realEstate.apartment";
import { validateApartmentData } from "../../../middleware/realEstate.validationSchema";
import {
  createValidatedSocketHandler,
  createSimpleSocketHandler
} from "./helpers/socketHelpers";

const realEstate = wrapAsyncSocket(
  async (socket: Socket, io: Server) => {

    // ======================== CLEAN EVENT HANDLERS WITH HELPERS ========================

    // Create handler với validation - MUCH CLEANER! 🎉
    socket.on('realEstate:create', createValidatedSocketHandler(
      'realEstate:create',
      validateApartmentData, // Direct function reference
      async (validatedData) => await realEstateService.create(validatedData)
    ));

    // ======================== COMPARISON: Before vs After ========================

    /*
    // ❌ OLD WAY (50+ lines of boilerplate):
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
    
    // ✅ NEW WAY (3 lines):
    socket.on('realEstate:create', createValidatedSocketHandler(
      'realEstate:create',
      validateApartmentData,
      async (validatedData) => await realEstateService.create(validatedData)
    ));
    */

    // ======================== FUTURE HANDLERS (Templates) ========================

    // Template for other CRUD operations when implemented in service:

    /*
    // Get all apartments - no validation needed
    socket.on('realEstate:all', createSimpleSocketHandler(
      'realEstate:all',
      async () => await realEstateService.all()
    ));
    
    // Get by ID - simple parameter
    socket.on('realEstate:findById', createSimpleSocketHandler(
      'realEstate:findById', 
      async (id: string) => await realEstateService.findById(id)
    ));
    
    // Update with validation
    socket.on('realEstate:update', createValidatedSocketHandler(
      'realEstate:update',
      validateApartmentData,
      async (validatedData) => await realEstateService.update(validatedData.id, validatedData)
    ));
    
    // Delete - simple parameter
    socket.on('realEstate:delete', createSimpleSocketHandler(
      'realEstate:delete',
      async (id: string) => await realEstateService.delete(id)
    ));
    
    // Custom business logic - no validation
    socket.on('realEstate:clicked', createSimpleSocketHandler(
      'realEstate:clicked',
      async (data: { id: string, userId: string }) => await realEstateService.trackClick(data.id, data.userId)
    ));
    */

    // ======================== DEMO: Manual vs Helper Comparison ========================

    // Manual way (old approach - để so sánh):
    /*
    socket.on('realEstate:create-manual', async (data: Partial<RealEstateApartmentClientType>) => {
      console.log('🎯 Controller received realEstate:create-manual event with data:', data);
      try {
        const validation = await asyncValidateApartmentData(data);
        if (!validation.isValid) {
          console.log('❌ Validation failed:', validation.errors);
          return socket.emit('realEstate:create-manualResponse', {
            success: false,
            message: 'Validation failed',
            errors: validation.errors,
            timestamp: new Date().toISOString()
          });
        }
        const result = await realEstateService.create(realEstateService)(validation.validatedData);
        console.log('✅ Successfully created new real estate');
        return socket.emit('realEstate:create-manualResponse', {
          success: true,
          message: `Created new real estate`,
          data: result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ Error creating real estate:', error);
        return socket.emit('realEstate:create-manualResponse', {
          success: false,
          message: 'Server error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
    */
  });

export default realEstate;