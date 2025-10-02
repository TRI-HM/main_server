#!/usr/bin/env node

// Quick Test Script cho RealEstate Module
import { demoMockTesting } from '../src/listeners/__tests__/testRunner';

console.log('🧪 === REALESTATE MOCK TESTING DEMO ===');
console.log('');

demoMockTesting()
  .then((results: any) => {
    console.log('\n✨ Test demo completed!');
    process.exit(results.success ? 0 : 1);
  })
  .catch((error: any) => {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  });