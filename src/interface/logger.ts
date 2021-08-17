import * as tracer from "tracer";
import * as path from 'path';
import * as fs from 'fs';
const filePath = path.join(process.cwd(), 'log');
interface Logger {
  (msg: string, level?: LogLevel, path?: string): void;
}

export type LogLevel = "log" | "trace" | "debug" | "info" | "warn" | "error" | "fatal";

let write: Logger;
write = function (msg: string, level: string = 'log', path: string = filePath) {
  !fs.existsSync(path) && fs.mkdirSync(path);
  const logger = tracer.dailyfile({ root: path });
  logger[level](msg);
};
export default { write: write };