 import { execSync } from 'child_process'
import fs from 'fs'

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
}

console.log(`${colors.bold}${colors.blue}========================================`)
console.log('  BizFlow Test Suite Runner')
console.log(`========================================${colors.reset}\n`)

// Find all test files
const findTestFiles = (dir) => {
  const files = []
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = `${dir}/${entry.name}`
      if (entry.isDirectory()) {
        files.push(...findTestFiles(fullPath))
      } else if (entry.name.match(/\.(test|spec)\.(js|jsx)$/)) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    // Ignore
  }
  return files
}

const testFiles = findTestFiles('src')

if (testFiles.length === 0) {
  console.log('No test files found!')
  process.exit(0)
}

console.log(`Found ${testFiles.length} test files\n`)

let passed = 0
let failed = 0
const results = []

// Run tests one at a time
for (const [index, test] of testFiles.entries()) {
  process.stdout.write(`[${index + 1}/${testFiles.length}] ${test} ... `)
  const start = Date.now()
  
  try {
    // Run each test individually with longer timeout
    execSync(`npx vitest --run ${test}`, { 
      stdio: 'pipe',
      timeout: 60000,
      maxBuffer: 1024 * 1024 * 10
    })
    const duration = ((Date.now() - start) / 1000).toFixed(2)
    console.log(`${colors.green}✓${colors.reset} (${duration}s)`)
    passed++
    results.push({ test, status: 'passed', duration })
  } catch (error) {
    const duration = ((Date.now() - start) / 1000).toFixed(2)
    console.log(`${colors.red}✗${colors.reset} (${duration}s)`)
    failed++
    results.push({ test, status: 'failed', duration })
  }
}

console.log(`\n${colors.bold}${colors.blue}========================================`)
console.log(`Results: ${colors.green}${passed} passed${colors.reset}, ${colors.red}${failed} failed${colors.reset}`)
console.log(`Total tests: ${testFiles.length}`)
console.log(`========================================${colors.reset}`)

if (failed === 0) {
  console.log(`\n${colors.green}${colors.bold}✅ All tests passed!${colors.reset}`)
} else {
  console.log(`\n${colors.red}${colors.bold}❌ ${failed} test(s) failed${colors.reset}`)
  console.log('\nFailed tests:')
  for (const result of results.filter(r => r.status === 'failed')) {
    console.log(`  ${colors.red}✗${colors.reset} ${result.test}`)
  }
}

process.exit(failed > 0 ? 1 : 0)