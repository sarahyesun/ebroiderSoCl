import {SecurePassword} from 'blitz';
import db from 'db';

type ResetPasswordMutationInput = {
	token: string;
	newPassword: string;
};

export default async function resetPassword(input: ResetPasswordMutationInput) {
	const token = await db.passwordResetToken.findUnique({where: {token: input.token}});

	if (!token) {
		throw new Error('Token not found.');
	}

	const hashedPassword = await SecurePassword.hash(input.newPassword);

	await db.user.update({
		where: {
			id: token.userId
		},
		data: {
			hashedPassword
		}
	});

	await db.passwordResetToken.delete({where: {token: token.token}});
}
