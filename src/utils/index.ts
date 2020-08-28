import { OutputDataType } from "../interface/datatype";

export async function retResult<T>(fun: T): Promise<OutputDataType> {
    const oResult = new OutputDataType(false, "", null);
    try {
        oResult.data =
            Object.prototype.toString.call(fun) === "[object Promise]"
                ? await fun
                : fun;
    } catch (error) {
        oResult.hasError = true;
        oResult.message = error;
    }
    return oResult;
}

