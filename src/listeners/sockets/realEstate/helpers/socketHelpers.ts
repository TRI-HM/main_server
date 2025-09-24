// Helper functions cho RealEstate Socket Controller
import { Socket } from "socket.io";

// ======================== RESPONSE HELPERS ========================

export interface SocketResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  error?: string;
  timestamp: string;
}

/**
 * Helper function để emit success response
 */
export const emitSuccess = <T>(
  socket: Socket,
  event: string,
  message: string,
  data?: T
): void => {
  socket.emit(event, {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  } as SocketResponse<T>);
};

/**
 * Helper function để emit validation error response
 */
export const emitValidationError = (
  socket: Socket,
  event: string,
  errors: any
): void => {
  socket.emit(event, {
    success: false,
    message: 'Validation failed',
    errors,
    timestamp: new Date().toISOString()
  } as SocketResponse);
};

/**
 * Helper function để emit server error response
 */
export const emitServerError = (
  socket: Socket,
  event: string,
  error: unknown
): void => {
  socket.emit(event, {
    success: false,
    message: 'Server error occurred',
    error: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString()
  } as SocketResponse);
};

// ======================== CONTROLLER HANDLER WRAPPER ========================

/**
 * Generic wrapper cho socket event handlers với error handling và logging
 */
export const createSocketHandler = <TData = any, TResult = any>(
  eventName: string,
  handler: (data: TData, socket: Socket) => Promise<TResult>
) => {
  return async (data: TData) => {
    // Return function that takes socket and data
    return async (socket: Socket) => {
      const responseEvent = `${eventName}Response`;

      try {
        console.log(`🎯 Controller received ${eventName} event`, data ? 'with data:' : '', data || '');

        const result = await handler(data, socket);

        emitSuccess(socket, responseEvent, `Successfully handled ${eventName}`, result);
        console.log(`✅ Successfully handled ${eventName}`);

      } catch (error) {
        console.error(`❌ Error handling ${eventName}:`, error);
        emitServerError(socket, responseEvent, error);
      }
    };
  };
};

/**
 * Simplified wrapper that directly handles socket events
 */
export const createSimpleSocketHandler = <TData = any, TResult = any>(
  eventName: string,
  handler: (data: TData) => Promise<TResult>
) => {
  return async (socket: Socket, data: TData) => {
    const responseEvent = `${eventName}Response`;

    try {
      console.log(`🎯 Controller received ${eventName} event`, data ? 'with data:' : '', data || '');

      const result = await handler(data);

      emitSuccess(socket, responseEvent, `Successfully handled ${eventName}`, result);
      console.log(`✅ Successfully handled ${eventName}`);

    } catch (error) {
      console.error(`❌ Error handling ${eventName}:`, error);
      emitServerError(socket, responseEvent, error);
    }
  };
};

/**
 * Wrapper cho handlers có validation
 */
export const createValidatedSocketHandler = <TData = any, TResult = any>(
  eventName: string,
  validator: (data: TData) => { isValid: boolean; errors?: any; validatedData?: any } | Promise<{ isValid: boolean; errors?: any; validatedData?: any }>,
  handler: (validatedData: any) => Promise<TResult>
) => {
  return async (socket: Socket, data: TData) => {
    const responseEvent = `${eventName}Response`;

    try {
      console.log(`🎯 Controller received ${eventName} event with data:`, data);

      // Validation step - handle both sync and async validators
      const validation = await Promise.resolve(validator(data));
      if (!validation.isValid) {
        console.log('❌ Validation failed:', validation.errors);
        return emitValidationError(socket, responseEvent, validation.errors);
      }

      // Execute handler with validated data
      const result = await handler(validation.validatedData);

      emitSuccess(socket, responseEvent, `Successfully handled ${eventName}`, result);
      console.log(`✅ Successfully handled ${eventName}`);

    } catch (error) {
      console.error(`❌ Error handling ${eventName}:`, error);
      emitServerError(socket, responseEvent, error);
    }
  };
};

// ======================== SPECIFIC HANDLER FACTORIES ========================

/**
 * Factory để tạo CRUD handlers
 */
export const createCrudHandlers = (service: any) => ({

  create: <TData>(validator: (data: TData) => Promise<any>) =>
    createValidatedSocketHandler(
      'realEstate:create',
      validator,
      async (validatedData: any) => await service.create(validatedData)
    ),

  findById: () =>
    createSocketHandler(
      'realEstate:findById',
      async (id: string) => await service.findById(service)(id)
    ),

  all: () =>
    createSocketHandler(
      'realEstate:all',
      async () => await service.all(service)()
    ),

  update: <TData>(validator: (data: TData) => Promise<any>) =>
    createValidatedSocketHandler(
      'realEstate:update',
      validator,
      async (validatedData: any) => await service.update(validatedData.id, validatedData)
    ),

  delete: () =>
    createSocketHandler(
      'realEstate:delete',
      async (id: string) => await service.delete(service)(id)
    )
});

export default {
  emitSuccess,
  emitValidationError,
  emitServerError,
  createSocketHandler,
  createSimpleSocketHandler,
  createValidatedSocketHandler,
  createCrudHandlers
};