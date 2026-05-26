import type { LogEntry, LoggerConfig, LogLevel } from './types.js';
export declare function formatTimestamp(date: Date): string;
export declare function formatEntry(entry: LogEntry, colored?: boolean): string;
export declare class CoreLogger {
    protected config: Required<LoggerConfig>;
    constructor(config?: LoggerConfig);
    protected shouldLog(level: LogLevel): boolean;
    protected createEntry(level: LogLevel, message: string, data?: unknown): LogEntry;
    protected writeToConsole(entry: LogEntry): void;
    protected log(level: LogLevel, message: string, data?: unknown): void;
    debug(message: string, data?: unknown): void;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, data?: unknown): void;
}
