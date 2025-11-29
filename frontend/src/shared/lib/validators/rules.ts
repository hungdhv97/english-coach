/**
 * Common Zod validation rules
 */

import { z } from 'zod';

// Common validation schemas that can be reused
export const validationRules = {
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  required: (message?: string) => z.string().min(1, message || 'Trường này là bắt buộc'),
  optionalString: z.string().optional(),
  url: z.string().url('URL không hợp lệ'),
  positiveNumber: z.number().positive('Số phải lớn hơn 0'),
  nonNegativeNumber: z.number().nonnegative('Số phải lớn hơn hoặc bằng 0'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  uuid: z.string().uuid('UUID không hợp lệ'),
};

// Common form schemas
export const commonSchemas = {
  pagination: z.object({
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().max(100).default(10),
  }),
  id: z.object({
    id: validationRules.uuid,
  }),
};

