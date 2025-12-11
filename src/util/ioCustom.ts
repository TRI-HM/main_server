type ErrorType = {
  code: number;
  message: string;
};

type toResponseType = {
  statusCode: number;
  message: string;
  data?: any;
}

const toResponseError = (error: ErrorType, data?: any): toResponseType => {
  return {
    statusCode: error.code,
    message: error.message,
    data,
  };
}

const toResponse = (statusCode: number, message: string, data?: any): toResponseType => {
  return {
    statusCode,
    message,
    data,
  };
}
const ioCustom = {
  toResponseError,
  toResponse,
};

export default ioCustom;