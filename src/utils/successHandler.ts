import type { Response } from 'express';
import { envConfig } from '../config';
import { FrontEncryptToken } from './encryption';

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
    encrypted?: boolean;
    responseCode?: number; // 1 = success, 0 = failure
}

export const successHandler = ({
    res,
    statusCode = 200,
    data,
    message = 'Request successful',
    meta,
    encrypted = envConfig.ENCRYPTED || false,
    responseCode = 1, // Default to success
}: SuccessHandlerArgs): Response<any, Record<string, any>> => {
    const responseBody: Record<string, any> = {
        success: true,
        responseCode, // Add responseCode to response
        statusCode,
        message: encrypted == true ? FrontEncryptToken(message) : message,
        data: encrypted == true ? FrontEncryptToken(JSON.stringify(data)) : data,
        encrypted,
    };

    if (meta) responseBody.meta = meta;

    return res.status(statusCode).json(responseBody);
};