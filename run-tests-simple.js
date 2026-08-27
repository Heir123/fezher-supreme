import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const testFiles = [
  'src/services/__tests__/executiveDashboardService.test.js',
  'src/components/__tests__/Sidebar.test.jsx',
  'src/components/tests/Navbar.test.jsx',
]

async function runTestsSequentially() {
  let passedTests = 0
  let failedTests = []
  
  console.log('='.repeat(60))
  console.log('  Running BizFlow Tests (Sequential)')
  console.log('='.repeat(60))
  console.log(`\n📊 Total test files: ${testFiles.length}\n`)
  
  const startTime = Date.now()
  
  for (let i = 0; i < testFiles.length; i++) {
    const testFile = testFiles[i]
    
    if (!fs.existsSync(path.join(__dirname, testFile))) {
      console.log(`⚠️  Test file not found: ${testFile} - skipping\n`)
      continue
    }
    
    console.log(`📝 [${i+1}/${testFiles.length}] Running: ${testFile}`)
    console.log('-'.repeat(50))
    
    const testStart = Date.now()
    
    try {
      execSync(`npx vitest --config vitest.no-setup.config.js --run --no-isolate --testTimeout=120000 ${testFile}`, {
        stdio: 'inherit',
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' },
        timeout: 180000
      })
      
      const duration = ((Date.now() - testStart) / 1000).toFixed(2)
      console.log(`✅ ${testFile} passed (${duration}s)`)
      passedTests++
    } catch (error) {
      const duration = ((Date.now() - testStart) / 1000).toFixed(2)
      console.error(`❌ ${testFile} failed (${duration}s)`)
      failedTests.push(testFile)
    }
    console.log('')
  }
  
  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2)
  
  console.log('='.repeat(60))
  console.log('  Test Summary')
  console.log('='.repeat(60))
  console.log(`✅ Passed: ${passedTests}/${testFiles.length}`)
  console.log(`❌ Failed: ${failedTests.length}/${testFiles.length}`)
  console.log(`⏱️  Total time: ${totalDuration}s`)
  console.log('\n💡 Run simple test separately: npm run test:simple')
  
  if (failedTests.length > 0) {
    console.log('\n❌ Failed tests:')
    failedTests.forEach(test => console.log(`   - ${test}`))
    process.exit(1)
  } else {
    console.log('\n✅ All tests passed successfully! 🎉')
    process.exit(0)
  }
}

runTestsSequentially()