"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputDataType = void 0;
class OutputDataType {
    constructor(hasError, message, data) {
        this._hasError = hasError || false;
        this._message = message || '';
        this._data = data || null;
    }
    get hasError() { return this._hasError; }
    set hasError(hasError) { this._hasError = hasError; }
    get message() { return this._message; }
    set message(message) { this._message = message; }
    get data() { return this._data; }
    set data(data) { this._data = data; }
}
exports.OutputDataType = OutputDataType;
