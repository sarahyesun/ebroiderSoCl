import * as z from 'zod';

export const SignupInput = z.object({
	email: z.string().email(),
	name: z.string(),
	password: z.string().min(10).max(100)
});
export type SignupInputType = z.infer<typeof SignupInput>;

export const LoginInput = z.object({
	email: z.string().email(),
	password: z.string()
});

export type LoginInputType = z.infer<typeof LoginInput>;

export const PasswordResetRequestInput = z.object({
	email: z.string().email()
});

export type PasswordResetRequestInputType = z.infer<typeof PasswordResetRequestInput>;

export const PasswordResetInput = z.object({
	password1: z.string().min(10).max(100),
	password2: z.string()
}).refine(data => data.password1 === data.password2, {
	message: 'Passwords don\'t match',
	path: ['password2']
});

export type PasswordResetInputType = z.infer<typeof PasswordResetInput>;
