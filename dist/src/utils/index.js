"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retResult = void 0;
const datatype_1 = require("../interface/datatype");
async function retResult(fun) {
    const oResult = new datatype_1.OutputDataType(false, "", null);
    try {
        oResult.data =
            Object.prototype.toString.call(fun) === "[object Promise]"
                ? await fun
                : fun;
    }
    catch (error) {
        oResult.hasError = true;
        oResult.message = error;
    }
    return oResult;
}
exports.retResult = retResult;
