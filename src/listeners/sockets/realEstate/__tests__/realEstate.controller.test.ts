// Mock Test cho RealEstate Controller Layer (No Jest Dependencies)
import { Server, Socket } from "socket.io";
import { IRealEstateService } from '../../../modules/realEstate/realEstate.service';

// ======================== MOCK IMPLEMENTATIONS ========================

// Simple Mock Socket implementation
interface MockSocket {
  on: (event: string, callback: Function) => void;
  emit: (event: string, ...args: any[]) => void;
  _trigger: (event: string, ...args: any[]) => void;
  _getEmittedEvents: () => { [event: string]: any[] };
}

const createMockSocket = (): MockSocket => {
  const emittedEvents: { [event: string]: any[] } = {};
  const eventListeners: { [event: string]: Function[] } = {};

  return {
    on: (event: string, callback: Function) => {
      if (!eventListeners[event]) {
        eventListeners[event] = [];
      }
      eventListeners[event].push(callback);
      console.log(`🧪 Mock Socket: Registered listener for '${event}'`);
    },

    emit: (event: string, ...args: any[]) => {
      if (!emittedEvents[event]) {
        emittedEvents[event] = [];
      }
      emittedEvents[event].push(args);
      console.log(`🧪 Mock Socket: Emitted '${event}' with:`, args);
    },

    _trigger: (event: string, ...args: any[]) => {
      console.log(`🧪 Mock Socket: Triggering '${event}' event`);
      if (eventListeners[event]) {
        eventListeners[event].forEach(callback => callback(...args));
      }
    },

    _getEmittedEvents: () => emittedEvents
  };
};

// Simple Mock IO Server implementation  
interface MockIOServer {
  emit: (event: string, ...args: any[]) => void;
}

const createMockIOServer = (): MockIOServer => ({
  emit: (event: string, ...args: any[]) => {
    console.log(`🧪 Mock IO Server: Broadcasted '${event}' with:`, args);
  }
});

// Mock Service implementation
const createMockService = (shouldSucceed: boolean = true): IRealEstateService => ({
  ping: (service: IRealEstateService) => async (): Promise<boolean> => {
    console.log('🧪 Mock Service: ping executed');

    if (!shouldSucceed) {
      throw new Error('Mock service error for testing');
    }

    return true;
  }
});

// ======================== CONTROLLER LOGIC FOR TESTING ========================

const createControllerLogic = (service: IRealEstateService) => {
  return async (socket: MockSocket, io: MockIOServer) => {
    socket.on('realEstate:ping', async () => {
      console.log('🎯 Mock Controller: received realEstate:ping event');

      try {
        // HOF pattern: service.ping(service)() 
        const result = await service.ping(service)();

        // Emit success response
        socket.emit('realEstate:pingResponse', {
          success: true,
          message: 'Pong from server!',
          data: result,
          timestamp: new Date().toISOString()
        });

        console.log('✅ Mock Controller: Successfully handled ping request');

      } catch (error) {
        console.error('❌ Mock Controller: Error handling ping:', error);

        // Emit error response
        socket.emit('realEstate:pingResponse', {
          success: false,
          message: 'Server error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  };
};

// ======================== TEST FUNCTIONS ========================

async function testControllerPingSuccess() {
  console.log('\n🧪 === TEST: Controller Ping Success ===');

  try {
    // Arrange
    const mockSocket = createMockSocket();
    const mockIO = createMockIOServer();
    const mockService = createMockService(true);

    const controllerLogic = createControllerLogic(mockService);

    // Act - Setup controller
    await controllerLogic(mockSocket, mockIO);

    // Trigger the ping event
    mockSocket._trigger('realEstate:ping');

    // Wait a bit for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    // Assert
    const emittedEvents = mockSocket._getEmittedEvents();
    console.log('✅ Emitted events:', Object.keys(emittedEvents));

    const pingResponses = emittedEvents['realEstate:pingResponse'];
    if (pingResponses && pingResponses.length > 0) {
      const response = pingResponses[0][0];
      console.log('✅ Response:', response);
      console.log(response.success === true ? '✅ PASS' : '❌ FAIL');
      return response.success === true;
    } else {
      console.log('❌ FAIL: No ping response emitted');
      return false;
    }

  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    return false;
  }
}

async function testControllerPingError() {
  console.log('\n🧪 === TEST: Controller Ping Error Handling ===');

  try {
    // Arrange
    const mockSocket = createMockSocket();
    const mockIO = createMockIOServer();
    const mockService = createMockService(false); // Will throw error

    const controllerLogic = createControllerLogic(mockService);

    // Act - Setup controller
    await controllerLogic(mockSocket, mockIO);

    // Trigger the ping event
    mockSocket._trigger('realEstate:ping');

    // Wait a bit for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    // Assert
    const emittedEvents = mockSocket._getEmittedEvents();
    const pingResponses = emittedEvents['realEstate:pingResponse'];

    if (pingResponses && pingResponses.length > 0) {
      const response = pingResponses[0][0];
      console.log('✅ Error response:', response);
      console.log(response.success === false ? '✅ PASS' : '❌ FAIL');
      return response.success === false;
    } else {
      console.log('❌ FAIL: No error response emitted');
      return false;
    }

  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    return false;
  }
}

// ======================== TEST RUNNER ========================

export async function runControllerTests() {
  console.log('🚀 === STARTING CONTROLLER LAYER TESTS ===');

  const tests = [
    { name: 'Controller Ping Success', fn: testControllerPingSuccess },
    { name: 'Controller Error Handling', fn: testControllerPingError }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
        console.log(`✅ ${test.name}: PASSED`);
      } else {
        failed++;
        console.log(`❌ ${test.name}: FAILED`);
      }
    } catch (error) {
      failed++;
      console.log(`❌ ${test.name}: ERROR -`, error);
    }
  }

  console.log(`\n📊 === CONTROLLER TEST RESULTS ===`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${(passed / (passed + failed) * 100).toFixed(1)}%`);

  return { passed, failed };
}

// Export for manual testing
export { createMockSocket, createMockIOServer, createMockService, createControllerLogic };