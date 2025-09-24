const { execSync } = require('child_process');

try {
  execSync('node --experimental-modules --no-warnings /home/roy/Desktop/1/backend/tests/contract/advanced-agent-chat.test.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Test failed:', error.message);
  process.exit(1);
}
