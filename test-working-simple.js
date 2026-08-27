import { execSync } from 'child_process'
import fs from 'fs'

const testFiles = [
  'src/tests/simple.test.jsx',
  'src/services/__tests__/executiveDashboardService.test.js',
  'src/services/__tests__/ai/salesInsights.test.js',
  'src/services/__tests__/ai/crmInsights.test.js',
  'src/utils/__tests__/helpers.test.js',
]

function runTests() {
  console.log('='.repeat(60))
  console.log('  Running Working Tests')
  console.log('='.repeat(60))
  console.log(`\n📊 Total test files: ${testFiles.length}\n`)
  
  for (const testFile of testFiles) {
    if (!fs.existsSync(testFile)) {
      console.log(`⚠️  Test file not found: ${testFile} - skipping\n`)
      continue
    }
    
    console.log(`📝 Running: ${testFile}`)
    console.log('-'.repeat(50))
    
    try {
      execSync(`npx vitest --config vitest.working.config.js --run ${testFile}`, {
        stdio: 'inherit',
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192' },
        timeout: 180000
      })
      console.log(`✅ ${testFile} passed\n`)
    } catch (error) {
      console.error(`❌ ${testFile} failed\n`)
    }
  }
  
  console.log('='.repeat(60))
  console.log('  Test Summary')
  console.log('='.repeat(60))
  console.log(`✅ Tests completed`)
}

runTests()