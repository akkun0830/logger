import type { Request, Response, NextFunction } from 'express';
import { CoreLogger } from './core.js';
import type { LoggerConfig, LogLevel } from './types.js';
export declare class NodeLogger extends CoreLogger {
    constructor(config?: LoggerConfig);
    protected log(level: LogLevel, message: string, data?: unknown): Promise<void>;
    private writeToFile;
    requestLogger(): (req: Request, res: Response, next: NextFunction) => void;
}
export declare function createLogger(config?: LoggerConfig): NodeLogger;
