import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = dirname(scriptDirectory);
const serverDirectory = join(projectDirectory, 'dist', 'server');

await mkdir(serverDirectory, { recursive: true });
await copyFile(
  join(projectDirectory, 'sites-worker.js'),
  join(serverDirectory, 'index.js')
);

