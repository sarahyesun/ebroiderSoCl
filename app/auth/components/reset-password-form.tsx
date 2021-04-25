import React, {useState} from 'react';
import {useMutation, useRouter} from 'blitz';
import {LabeledTextField} from 'app/components/LabeledTextField';
import {Form, FORM_ERROR} from 'app/components/Form';
import resetPasswordRequest from 'app/auth/mutations/resetPasswordRequest';
import resetPassword from 'app/auth/mutations/resetPassword';
import {PasswordResetRequestInput, PasswordResetInput} from 'app/auth/validations';
import {Heading, Box} from '@chakra-ui/react';

export const ResetPasswordForm = () => {
	const {query, isReady} = useRouter();
	const [resetPasswordRequestMutation] = useMutation(resetPasswordRequest);
	const [resetPasswordMutation] = useMutation(resetPassword);
	const [banner, setBanner] = useState('');

	if (!isReady) {
		return <Box/>;
	}

	const token = query.token as string | undefined;

	return (
		<Box>
			<Heading mb={5}>Reset Password</Heading>

			{
				(token ? (
					<Form
						submitText="Reset"
						banner={banner}
						schema={PasswordResetInput}
						onSubmit={async values => {
							try {
								await resetPasswordMutation({newPassword: values.password1, token});
								setBanner('Your password has been updated.');
							} catch (error: unknown) {
								return {
									[FORM_ERROR]:
                'Sorry, we had an unexpected error. Please try again. - ' +
                (error as Error).message
								};
							}
						}}
					>
						<LabeledTextField name="password1" label="New Password" type="password"/>
						<LabeledTextField name="password2" label="Confirm Password" type="password"/>
					</Form>
				) : (
					<Form
						submitText="Submit"
						schema={PasswordResetRequestInput}
						initialValues={{email: ''}}
						banner={banner === '' ? undefined : banner}
						onSubmit={async values => {
							try {
								await resetPasswordRequestMutation(values);
								setBanner('You should receive an email soon if that\'s a valid account.');
							} catch (error: unknown) {
								return {
									[FORM_ERROR]:
                'Sorry, we had an unexpected error. Please try again. - ' +
                (error as Error).message
								};
							}
						}}
					>
						<LabeledTextField name="email" label="Email" placeholder="Email" />
					</Form>
				))
			}
		</Box>
	);
};

export default ResetPasswordForm;
