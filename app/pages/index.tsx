import React from 'react';
import {BlitzPage, Image, Link} from 'blitz';
import Layout from 'app/layouts/Layout';
import {Button, Box, ButtonGroup, Heading, Text, VStack, Container} from '@chakra-ui/react';

const Home: BlitzPage = () => {
	return (
		<Box minH="calc(100vh - 5rem)" bg="black" mt={-10} color="white" display="flex" justifyContent="center" alignItems="center">
			<Box opacity={0.5}>
				{/* TODO: https://github.com/vercel/next.js/issues/23590 */}
				<Image src="https://images.unsplash.com/photo-1507220529008-e931df30d1ed" layout="fill" objectFit="cover" unoptimized={true}/>
			</Box>

			<Container>
				<VStack zIndex={10} position="relative" alignItems="flex-start" spacing={4}>
					<Heading>SoCl Wearable Electronics Factory</Heading>

					<Text>
						Welcome to SoCl Cloud Manufacturing Network for designing and manufacturing of embroidered wearable electronics!
					</Text>

					<ButtonGroup>
						<Link passHref href="/designs">
							<Button colorScheme="blue" as="a">Get Started</Button>
						</Link>

						<Link passHref href="/designs/public">
							<Button as="a" variant="link">Explore Designs</Button>
						</Link>
					</ButtonGroup>
				</VStack>
			</Container>
		</Box>
	);
};

Home.getLayout = page => <Layout title="Home">{page}</Layout>;

export default Home;
