/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.message, err.stack);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Terjadi kesalahan pada server';

  res.status(statusCode).json({
    success: false,
    data: null,
    message,
  });
};

/**
 * Custom error class dengan status code
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

/**
 * Wrapper async untuk controller agar tidak perlu try/catch berulang
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
