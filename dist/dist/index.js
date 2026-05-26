// src/types.ts
var LOG_LEVEL_RANK = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

// src/core.ts
var LEVEL_LABEL = {
  debug: "DEBUG",
  info: "INFO ",
  warn: "WARN ",
  error: "ERROR"
};
var LEVEL_COLOR = {
  debug: "\x1B[36m",
  // cyan
  info: "\x1B[32m",
  // green
  warn: "\x1B[33m",
  // yellow
  error: "\x1B[31m"
  // red
};
var RESET = "\x1B[0m";
function formatTimestamp(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
function serializeData(data) {
  if (data instanceof Error) {
    return `${data.name}: ${data.message}`;
  }
  return JSON.stringify(data);
}
function formatEntry(entry, colored = false) {
  const ts = formatTimestamp(entry.timestamp);
  const label = LEVEL_LABEL[entry.level];
  const color = colored ? LEVEL_COLOR[entry.level] : "";
  const reset = colored ? RESET : "";
  const data = entry.data !== void 0 ? ` ${serializeData(entry.data)}` : "";
  return `[${ts}] ${color}[${label}]${reset} ${entry.message}${data}`;
}
var CoreLogger = class {
  config;
  constructor(config = {}) {
    this.config = {
      minLevel: config.minLevel ?? "debug",
      fileOutput: config.fileOutput ?? false,
      logDir: config.logDir ?? "./logs"
    };
  }
  shouldLog(level) {
    return LOG_LEVEL_RANK[level] >= LOG_LEVEL_RANK[this.config.minLevel];
  }
  createEntry(level, message, data) {
    return { level, message, timestamp: /* @__PURE__ */ new Date(), data };
  }
  writeToConsole(entry) {
    const line = formatEntry(entry, true);
    if (entry.level === "error") {
      console.error(line);
    } else if (entry.level === "warn") {
      console.warn(line);
    } else {
      console.log(line);
    }
  }
  log(level, message, data) {
    if (!this.shouldLog(level)) return;
    const entry = this.createEntry(level, message, data);
    this.writeToConsole(entry);
  }
  debug(message, data) {
    this.log("debug", message, data);
  }
  info(message, data) {
    this.log("info", message, data);
  }
  warn(message, data) {
    this.log("warn", message, data);
  }
  error(message, data) {
    this.log("error", message, data);
  }
};
export {
  CoreLogger
};
