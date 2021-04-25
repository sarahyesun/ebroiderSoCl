import {generateToken} from 'blitz';
import {PasswordResetRequestInput, PasswordResetRequestInputType} from 'app/auth/validations';
import db from 'db';
import mailer from 'utils/mailer';

export default async function resetPasswordRequest(input: PasswordResetRequestInputType) {
	// This throws an error if input is invalid
	const {email} = PasswordResetRequestInput.parse(input);

	const user = await db.user.findFirst({where: {email}});

	if (user) {
		const {token} = await db.passwordResetToken.create({
			data: {
				userId: user.id,
				token: generateToken()
			}
		});

		const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL!}/reset-password?token=${token}`;

		await new Promise((resolve, reject) => {
			mailer.sendMail({
				from: process.env.SMTP_FROM,
				to: email,
				subject: 'Password Reset for SoCl',
				text: `Reset your password: ${resetUrl}`
			}, (error, result) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(result);
			});
		});
	}
}
