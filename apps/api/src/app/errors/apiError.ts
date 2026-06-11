export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR";

type ApiErrorOptions = {
  code: ApiErrorCode;
  message: string;
};

const apiErrorStatusCodeByCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const satisfies Record<ApiErrorCode, number>;

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;

  public constructor(options: ApiErrorOptions) {
    super(options.message);

    this.name = "ApiError";
    this.code = options.code;
    this.statusCode = apiErrorStatusCodeByCode[options.code];
  }
}
