import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.resolve(__dirname, '../../logs');

const getLogFilePath = () => {
  const date = new Date().toISOString().slice(0, 10);
  return path.join(logsDir, `app-${date}.txt`);
};

const write = (level, entity, message, uuidRun = '-') => {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${level}] [RUN:${uuidRun}] [${entity}] ${message}\n`;

  process.stdout.write(line);

  fs.mkdirSync(logsDir, { recursive: true });
  fs.appendFileSync(getLogFilePath(), line, 'utf8');
};

export const logger = {
  info:  (entity, message, uuidRun) => write('INFO ', entity, message, uuidRun),
  warn:  (entity, message, uuidRun) => write('WARN ', entity, message, uuidRun),
  error: (entity, message, uuidRun) => write('ERROR', entity, message, uuidRun),
};