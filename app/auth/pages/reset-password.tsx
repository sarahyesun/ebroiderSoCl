import React from 'react';
import {BlitzPage} from 'blitz';
import Layout from 'app/layouts/Layout';
import {ResetPasswordForm} from 'app/auth/components/reset-password-form';
import {Container} from '@chakra-ui/react';

const ResetPasswordPage: BlitzPage = () => {
	return (
		<Container>
			<ResetPasswordForm />
		</Container>
	);
};

ResetPasswordPage.getLayout = page => <Layout title="Reset Password">{page}</Layout>;

export default ResetPasswordPage;
