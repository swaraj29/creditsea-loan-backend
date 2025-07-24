import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

/**
 * Utility class for consistent API responses
 */
export class ResponseUtil {
  /**
   * Send success response
   */
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    
    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 400,
    error?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString()
    };
    
    return res.status(statusCode).json(response);
  }

  /**
   * Send paginated response
   */
  static paginated<T>(
    res: Response,
    message: string,
    data: T,
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    },
    statusCode: number = 200
  ): Response {
    const response: PaginatedResponse<T> = {
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString()
    };
    
    return res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   */
  static validationError(
    res: Response,
    errors: string[]
  ): Response {
    return this.error(res, 'Validation failed', 422, errors.join(', '));
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 401);
  }

  /**
   * Send forbidden response
   */
  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }

  /**
   * Send not found response
   */
  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }
}
