import { execSync } from 'child_process'

const testFile = process.argv[2] || 'src/tests/simple.test.jsx'

console.log(`Running: ${testFile}`)

try {
  execSync(`npx vitest --run ${testFile}`, { 
    stdio: 'inherit',
    timeout: 120000 
  })
  console.log('✅ Test passed!')
} catch (error) {
  console.log('❌ Test failed!')
  process.exit(1)
}