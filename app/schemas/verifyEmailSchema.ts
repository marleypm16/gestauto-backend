import { z } from 'zod';
export const verifyEmailSchema = z.object({
    to : z.string().email(),
})