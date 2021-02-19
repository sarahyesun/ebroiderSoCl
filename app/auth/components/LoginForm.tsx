import React from 'react';
import {AuthenticationError, useMutation} from 'blitz';
import {LabeledTextField} from 'app/components/LabeledTextField';
import {Form, FORM_ERROR} from 'app/components/Form';
import login from 'app/auth/mutations/login';
import {LoginInput} from 'app/auth/validations';
import {Heading} from '@chakra-ui/react';
import WrappedLink from 'app/components/link';

type LoginFormProps = {
	onSuccess?: () => void;
};

export const LoginForm = (props: LoginFormProps) => {
	const [loginMutation] = useMutation(login);

	return (
		<div>
			<Heading mb={5}>Login</Heading>

			<Form
				submitText="Login"
				schema={LoginInput}
				initialValues={{email: '', password: ''}}
				onSubmit={async values => {
					try {
						await loginMutation(values);
						props.onSuccess?.();
					} catch (error: unknown) {
						if (error instanceof AuthenticationError) {
							return {[FORM_ERROR]: 'Sorry, those credentials are invalid.'};
						}

						return {
							[FORM_ERROR]:
                'Sorry, we had an unexpected error. Please try again. - ' +
                (error as Error).message
						};
					}
				}}
			>
				<LabeledTextField name="email" label="Email" placeholder="Email" />
				<LabeledTextField
					name="password"
					label="Password"
					placeholder="Password"
					type="password"
				/>
			</Form>

			<div style={{marginTop: '1rem'}}>
        Or, <WrappedLink href="/signup">sign up</WrappedLink>.
			</div>
		</div>
	);
};

export default LoginForm;
