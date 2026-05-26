// src\node.ts

import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { Request, Response, NextFunction } from 'express';
import { CoreLogger } from './core.js';
import { formatEntry } from './core.js';
import type { LogEntry, LoggerConfig, LogLevel } from './types.js';

export class NodeLogger extends CoreLogger {
  constructor(config: LoggerConfig = {}) {
    super(config);
  }

  protected override async log(level: LogLevel, message: string, data?: unknown): Promise<void> {
    if (!this.shouldLog(level)) return;
    const entry = this.createEntry(level, message, data);
    this.writeToConsole(entry);
    if (this.config.fileOutput) {
      await this.writeToFile(entry);
    }
  }

  private async writeToFile(entry: LogEntry): Promise<void> {
    try {
      await mkdir(this.config.logDir, { recursive: true });
      const date = entry.timestamp.toISOString().slice(0, 10);
      const filename = join(this.config.logDir, `${date}.log`);
      const line = formatEntry(entry, false) + '\n';
      await appendFile(filename, line, 'utf-8');
    } catch (err) {
      console.error('[Logger] ファイル出力に失敗しました:', err);
    }
  }

  // Expressミドルウェア
  requestLogger() {
    return (req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      res.on('finish', () => {
        const ms = Date.now() - start;
        const level: LogLevel = res.statusCode >= 500 ? 'error'
          : res.statusCode >= 400 ? 'warn'
            : 'debug';
        this.log(level, `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
      });
      next();
    };
  }
}

export function createLogger(config: LoggerConfig = {}): NodeLogger {
  return new NodeLogger(config);
}