export type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export const unexpectedErrorResponse: ErrorResponse = {
  error: {
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
  },
};
