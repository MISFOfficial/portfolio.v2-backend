import type { Response } from 'express';

export interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  [key: string]: any;
}

export interface SuccessHandlerArgs {
  res: Response;
  data: any;
  message?: string;
  statusCode?: number;
  meta?: Meta;
  responseCode?: number; // 1 = success, 0 = failure
}

export const successHandler = ({
  res,
  statusCode = 200,
  data,
  message = 'Request successful',
  meta,
  responseCode = 1, // Default to success
}: SuccessHandlerArgs): Response<any, Record<string, any>> => {
  const responseBody: Record<string, any> = {
    success: true,
    responseCode, // Add responseCode to response
    statusCode,
    message,
    data,
  };

  if (meta) responseBody.meta = meta;

  return (res as any).status(statusCode).json(responseBody);
};
