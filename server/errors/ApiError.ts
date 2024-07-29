import BaseError from "./BaseError";

import { type ErrorName, type ErrorCode } from "../utils/types";

class ApiError extends BaseError<ErrorName, ErrorCode> {}
export default ApiError;
