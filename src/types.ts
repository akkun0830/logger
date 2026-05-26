// src\types.ts

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const LOG_LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: unknown;
}

export interface LoggerConfig {
  minLevel?: LogLevel;
  fileOutput?: boolean;
  logDir?: string;
}