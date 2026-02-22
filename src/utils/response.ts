export class APIResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  error?: any;

  constructor(statusCode: number, message: string, data?: T, error?: any) {
    this.statusCode = statusCode;
    this.message = message;
    if (data !== undefined) this.data = data;
    if (error !== undefined) this.error = error;
  }

  static success<T>(
    data: T,
    message: string = "Success",
    statusCode: number = 200,
  ) {
    return new APIResponse(statusCode, message, data);
  }

  static error(message: string, statusCode: number = 400, error?: any) {
    return new APIResponse(statusCode, message, undefined, error);
  }

  static notFound(message: string = "Not Found") {
    return new APIResponse(404, message);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new APIResponse(401, message);
  }

  static forbidden(message: string = "Forbidden") {
    return new APIResponse(403, message);
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      ...(this.data !== undefined && { data: this.data }),
      ...(this.error !== undefined && { error: this.error }),
    };
  }
}
