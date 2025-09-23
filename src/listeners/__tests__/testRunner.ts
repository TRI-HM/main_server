// Main Test Runner cho RealEstate Module
import { runServiceTests } from '../modules/realEstate/__tests__/realEstate.service.test';
import { runControllerTests } from '../sockets/realEstate/__tests__/realEstate.controller.test';

// ======================== INTEGRATION TEST ========================

async function runIntegrationTest() {
  console.log('\n🧪 === INTEGRATION TEST: Full Flow ===');

  try {
    // Import actual implementations
    const realEstateUseCase = await import('../useCases/realEstate.useCase');
    const realEstateService = await import('../modules/realEstate/realEstate.service');

    console.log('🔄 Testing actual implementation...');

    // Test UseCase
    const useCaseResult = await realEstateUseCase.default.ping(realEstateUseCase.default)();
    console.log('✅ UseCase result:', useCaseResult);

    // Test Service
    const serviceResult = await realEstateService.default.ping(realEstateService.default)();
    console.log('✅ Service result:', serviceResult);

    // Assert
    const success = useCaseResult === true && serviceResult === true;
    console.log(success ? '✅ INTEGRATION TEST PASSED' : '❌ INTEGRATION TEST FAILED');

    return success;

  } catch (error) {
    console.error('❌ INTEGRATION TEST ERROR:', error);
    return false;
  }
}

// ======================== MAIN TEST RUNNER ========================

async function runAllTests() {
  console.log('🚀 === STARTING REAL ESTATE MODULE TESTS ===');
  console.log('📅 Test Run Time:', new Date().toISOString());
  console.log('🏗️  Architecture: Controller → Service → UseCase (HOF + DI)');

  let totalPassed = 0;
  let totalFailed = 0;

  try {
    // 1. Service Layer Tests
    console.log('\n📦 === SERVICE LAYER TESTS ===');
    const serviceResults = await runServiceTests();
    totalPassed += serviceResults.passed;
    totalFailed += serviceResults.failed;

    // 2. Controller Layer Tests  
    console.log('\n🎯 === CONTROLLER LAYER TESTS ===');
    const controllerResults = await runControllerTests();
    totalPassed += controllerResults.passed;
    totalFailed += controllerResults.failed;

    // 3. Integration Test
    console.log('\n🔗 === INTEGRATION TESTS ===');
    const integrationSuccess = await runIntegrationTest();
    if (integrationSuccess) {
      totalPassed++;
    } else {
      totalFailed++;
    }

  } catch (error) {
    console.error('❌ Test runner error:', error);
    totalFailed++;
  }

  // Final Results
  console.log('\n' + '='.repeat(50));
  console.log('🎯 === FINAL TEST RESULTS ===');
  console.log('='.repeat(50));
  console.log(`✅ Total Passed: ${totalPassed}`);
  console.log(`❌ Total Failed: ${totalFailed}`);
  console.log(`📊 Success Rate: ${(totalPassed / (totalPassed + totalFailed) * 100).toFixed(1)}%`);
  console.log(`🏆 Status: ${totalFailed === 0 ? 'ALL TESTS PASSED! 🎉' : 'SOME TESTS FAILED 🔴'}`);
  console.log('='.repeat(50));

  return {
    passed: totalPassed,
    failed: totalFailed,
    success: totalFailed === 0
  };
}

// ======================== DEMO FUNCTIONS ========================

export async function demoMockTesting() {
  console.log('🎬 === MOCK TESTING DEMO ===');
  console.log('This demonstrates how to test each layer in isolation:');
  console.log('');
  console.log('🏗️  Architecture Layers:');
  console.log('   🎯 Controller: Socket events + responses');
  console.log('   🏢 Service: Business validation + orchestration');
  console.log('   💼 UseCase: Pure domain logic');
  console.log('');
  console.log('🧪 Testing Strategy:');
  console.log('   ✅ Unit Tests: Each layer with mocked dependencies');
  console.log('   ✅ Integration Tests: Full flow with real implementations');
  console.log('   ✅ HOF Pattern: Dependency injection for testability');
  console.log('');

  const results = await runAllTests();

  if (results.success) {
    console.log('🎉 Demo completed successfully!');
    console.log('💡 Key takeaways:');
    console.log('   - HOF pattern enables easy mocking');
    console.log('   - Each layer can be tested independently');
    console.log('   - Clean separation of concerns');
    console.log('   - Enterprise-ready architecture');
  }

  return results;
}

// Export main functions
export { runAllTests, runIntegrationTest };

// Auto-run if this file is executed directly
if (require.main === module) {
  demoMockTesting().catch(console.error);
}