import React, {useCallback} from 'react';
import {useMutation} from 'blitz';
import TextField from 'app/components/LabeledTextField';
import {Form, FORM_ERROR} from 'app/components/Form';
import signup from 'app/auth/mutations/signup';
import {SignupInput} from 'app/auth/validations';
import {Heading, Container} from '@chakra-ui/react';

type SignupFormProps = {
	onSuccess?: () => void;
};

export const SignupForm = (props: SignupFormProps) => {
	const [signupMutation] = useMutation(signup);

	const onSubmit = useCallback(
		async values => {
			try {
				await signupMutation(values);
				props.onSuccess?.();
			} catch (error: unknown) {
				return {[FORM_ERROR]: (error as Error).message};
			}
		},
		[signupMutation, props]
	);

	return (
		<Container>
			<Heading mb={5}>Create an Account</Heading>

			<Form
				submitText="Signup"
				schema={SignupInput}
				initialValues={{email: '', password: ''}}
				onSubmit={onSubmit}
			>
				<TextField name="email" label="Email" placeholder="Email" />
				<TextField name="name" label="Name" placeholder="Name" />
				<TextField
					name="password"
					label="Password"
					placeholder="Password"
					type="password"
				/>
			</Form>
		</Container>
	);
};

export default SignupForm;
