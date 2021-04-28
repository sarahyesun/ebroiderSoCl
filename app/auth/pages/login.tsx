import React from 'react';
import {useRouter, BlitzPage, useParam, useRouterQuery} from 'blitz';
import Layout from 'app/layouts/Layout';
import {LoginForm} from 'app/auth/components/LoginForm';
import {Container} from '@chakra-ui/react';

const LoginPage: BlitzPage = () => {
	const router = useRouter();
	const {redirect} = useRouterQuery();

	return (
		<Container>
			<LoginForm onSuccess={async () => router.push(redirect as string ?? '/')} />
		</Container>
	);
};

LoginPage.getLayout = page => <Layout title="Log In">{page}</Layout>;

export default LoginPage;
