"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tracer = require("tracer");
const path = require("path");
const fs = require("fs");
const filePath = path.join(process.cwd(), 'log');
let write;
write = function (msg, level = 'log', path = filePath) {
    !fs.existsSync(path) && fs.mkdirSync(path);
    const logger = tracer.dailyfile({ root: path });
    logger[level](msg);
};
exports.default = { write: write };
