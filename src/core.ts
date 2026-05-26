// src\core.ts

import type { LogEntry, LoggerConfig, LogLevel } from './types.js';
import { LOG_LEVEL_RANK } from './types.js';

const LEVEL_LABEL: Record<LogLevel, string> = {
  debug: 'DEBUG',
  info: 'INFO ',
  warn: 'WARN ',
  error: 'ERROR',
};

const LEVEL_COLOR: Record<LogLevel, string> = {
  debug: '\x1b[36m', // cyan
  info: '\x1b[32m', // green
  warn: '\x1b[33m', // yellow
  error: '\x1b[31m', // red
};

const RESET = '\x1b[0m';

export function formatTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

function serializeData(data: unknown): string {
  if (data instanceof Error) {
    return `${data.name}: ${data.message}`;
  }
  return JSON.stringify(data);
}

export function formatEntry(entry: LogEntry, colored = false): string {
  const ts = formatTimestamp(entry.timestamp);
  const label = LEVEL_LABEL[entry.level];
  const color = colored ? LEVEL_COLOR[entry.level] : '';
  const reset = colored ? RESET : '';
  const data = entry.data !== undefined ? ` ${serializeData(entry.data)}` : '';
  return `[${ts}] ${color}[${label}]${reset} ${entry.message}${data}`;
}

export class CoreLogger {
  protected config: Required<LoggerConfig>;

  constructor(config: LoggerConfig = {}) {
    this.config = {
      minLevel: config.minLevel ?? 'debug',
      fileOutput: config.fileOutput ?? false,
      logDir: config.logDir ?? './logs',
    };
  }

  protected shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_RANK[level] >= LOG_LEVEL_RANK[this.config.minLevel];
  }

  protected createEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
    return { level, message, timestamp: new Date(), data };
  }

  protected writeToConsole(entry: LogEntry): void {
    const line = formatEntry(entry, true);
    if (entry.level === 'error') {
      console.error(line);
    } else if (entry.level === 'warn') {
      console.warn(line);
    } else {
      console.log(line);
    }
  }

  protected log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;
    const entry = this.createEntry(level, message, data);
    this.writeToConsole(entry);
  }

  debug(message: string, data?: unknown) { this.log('debug', message, data); }
  info(message: string, data?: unknown) { this.log('info', message, data); }
  warn(message: string, data?: unknown) { this.log('warn', message, data); }
  error(message: string, data?: unknown) { this.log('error', message, data); }
}