/* eslint-disable no-console */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function timestamp(): string {
  return new Date().toISOString();
}

function write(level: LogLevel, message: string, meta?: unknown): void {
  const line = `[${timestamp()}] [${level.toUpperCase()}] ${message}`;
  const payload = meta !== undefined ? [line, meta] : [line];
  // eslint-disable-next-line default-case
  switch (level) {
    case 'error':
      console.error(...payload);
      break;
    case 'warn':
      console.warn(...payload);
      break;
    default:
      console.log(...payload);
  }
}

export const logger = {
  info: (message: string, meta?: unknown) => write('info', message, meta),
  warn: (message: string, meta?: unknown) => write('warn', message, meta),
  error: (message: string, meta?: unknown) => write('error', message, meta),
  debug: (message: string, meta?: unknown) => write('debug', message, meta),
};
