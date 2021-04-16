import {
	AppProps,
	ErrorComponent,
	AuthenticationError,
	AuthorizationError
} from 'blitz';
import {ErrorBoundary, FallbackProps} from 'react-error-boundary';
import {useQueryErrorResetBoundary} from 'react-query';
import {ChakraProvider, extendTheme, Container, Heading, Alert, AlertIcon, AlertTitle} from '@chakra-ui/react';
import LoginForm from 'app/auth/components/LoginForm';

// Fix Font Awesome sizing
import {config} from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import React from 'react';
config.autoAddCss = false;

const theme = extendTheme({
	components: {
		Container: {
			sizes: {
				lg: {
					maxW: 'min(80vw, 1200px)'
				}
			}
		}
	}
});

export default function App({Component, pageProps}: AppProps) {
	const getLayout = Component.getLayout ?? (page => page);

	const {reset} = useQueryErrorResetBoundary();

	return (
		<ChakraProvider theme={theme}>
			<ErrorBoundary
				FallbackComponent={RootErrorFallback}
				resetKeys={['']}
				onReset={() => {
					// This ensures the Blitz useQuery hooks will automatically refetch
					// data any time you reset the error boundary
					reset();
				}}
			>
				{getLayout(<Component {...pageProps} />)}
			</ErrorBoundary>
		</ChakraProvider>
	);
}

function RootErrorFallback({error, resetErrorBoundary}: FallbackProps) {
	if (error instanceof AuthenticationError) {
		return (
			<Container>
				<Alert status="error" mt={4} mb={4}>
					<AlertIcon />
					<AlertTitle mr={2}>You must be logged in to access this.</AlertTitle>
				</Alert>
				<LoginForm onSuccess={resetErrorBoundary} />
			</Container>
		);
	}

	if (error instanceof AuthorizationError) {
		return (
			<ErrorComponent
				statusCode={(error as any).statusCode}
				title="Sorry, you are not authorized to access this"
			/>
		);
	}

	return (
		<ErrorComponent
			statusCode={(error as any)?.statusCode || 400}
			title={error?.message || error?.name}
		/>
	);
}
