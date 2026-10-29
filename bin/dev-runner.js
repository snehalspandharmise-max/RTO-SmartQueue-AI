import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('====================================================');
console.log('  RTO SmartQueue AI — Academic Demonstration System');
console.log('====================================================\n');
console.log('Starting Backend API & Frontend Client simultaneously...\n');

const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'backend'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'frontend'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

function prefixOutput(stream, prefix, colorCode) {
  stream.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`\x1b[${colorCode}m[${prefix}]\x1b[0m ${line}`);
      }
    });
  });
}

prefixOutput(backend.stdout, 'BACKEND', '34'); // Blue
prefixOutput(backend.stderr, 'BACKEND', '31'); // Red
prefixOutput(frontend.stdout, 'FRONTEND', '36'); // Cyan
prefixOutput(frontend.stderr, 'FRONTEND', '31'); // Red

function cleanup() {
  console.log('\nShutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
