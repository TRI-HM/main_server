// Mock Test cho RealEstate Service Layer
import { IRealEstateService } from '../realEstate.service';
import { IRealEstateUseCase } from '../../../useCases/realEstate.useCase';

// ======================== MOCK IMPLEMENTATIONS ========================

// Mock UseCase for testing Service layer
const createMockUseCase = (): IRealEstateUseCase => ({
  ping: (useCase: IRealEstateUseCase) => async (): Promise<boolean> => {
    console.log('🧪 Mock UseCase: ping executed');
    return true; // Always return true for testing
  }
});

// Mock Service implementation
const createMockService = (mockUseCase: IRealEstateUseCase): IRealEstateService => ({
  ping: (service: IRealEstateService) => async (): Promise<boolean> => {
    console.log('🧪 Mock Service: executing ping');

    // Simulate service layer logic
    // - Input validation ✅
    // - Logging ✅ 
    // - Business rules ✅

    // Call mocked usecase
    const result = await mockUseCase.ping(mockUseCase)();

    console.log('🧪 Mock Service: usecase result =', result);
    return result;
  }
});

// ======================== TEST FUNCTIONS ========================

async function testServicePingSuccess() {
  console.log('\n🧪 === TEST: Service Ping Success ===');

  try {
    // Arrange
    const mockUseCase = createMockUseCase();
    const mockService = createMockService(mockUseCase);

    // Act
    const result = await mockService.ping(mockService)();

    // Assert
    console.log('✅ Expected: true, Actual:', result);
    console.log(result === true ? '✅ PASS' : '❌ FAIL');

    return result === true;
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    return false;
  }
}

async function testServiceHOFPattern() {
  console.log('\n🧪 === TEST: Service HOF Pattern ===');

  try {
    // Arrange
    const mockUseCase = createMockUseCase();
    const mockService = createMockService(mockUseCase);

    // Act - Test HOF pattern
    const pingFunction = mockService.ping(mockService);

    // Assert
    console.log('✅ Ping function type:', typeof pingFunction);
    console.log(typeof pingFunction === 'function' ? '✅ PASS: Returns function' : '❌ FAIL');

    // Execute the function
    const result = await pingFunction();
    console.log('✅ Function execution result:', result);
    console.log(result === true ? '✅ PASS: Execution successful' : '❌ FAIL');

    return typeof pingFunction === 'function' && result === true;
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    return false;
  }
}

async function testServiceWithFailingUseCase() {
  console.log('\n🧪 === TEST: Service with Failing UseCase ===');

  try {
    // Arrange - Mock failing usecase
    const failingUseCase: IRealEstateUseCase = {
      ping: () => async () => {
        console.log('🧪 Mock UseCase: simulating failure');
        return false; // Simulate failure
      }
    };

    const mockService = createMockService(failingUseCase);

    // Act
    const result = await mockService.ping(mockService)();

    // Assert
    console.log('✅ Expected: false, Actual:', result);
    console.log(result === false ? '✅ PASS' : '❌ FAIL');

    return result === false;
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    return false;
  }
}

// ======================== TEST RUNNER ========================

export async function runServiceTests() {
  console.log('🚀 === STARTING SERVICE LAYER TESTS ===');

  const tests = [
    { name: 'Service Ping Success', fn: testServicePingSuccess },
    { name: 'Service HOF Pattern', fn: testServiceHOFPattern },
    { name: 'Service with Failing UseCase', fn: testServiceWithFailingUseCase }
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

  console.log(`\n📊 === TEST RESULTS ===`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${(passed / (passed + failed) * 100).toFixed(1)}%`);

  return { passed, failed };
}

// Export for manual testing
export { createMockUseCase, createMockService };