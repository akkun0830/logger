export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export declare const LOG_LEVEL_RANK: Record<LogLevel, number>;
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
