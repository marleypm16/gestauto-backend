import { z } from 'zod';
export const verifyEmailModel = z.object({
    to : z.string().email(),
})