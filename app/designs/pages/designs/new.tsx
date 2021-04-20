import React from 'react';
import Layout from 'app/layouts/Layout';
import {useRouter, useMutation, BlitzPage} from 'blitz';
import createDesign from 'app/designs/mutations/createDesign';
import DesignForm from 'app/designs/components/DesignForm';
import {Container, Heading} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';
import {SetRequired} from 'type-fest';

const NewDesignPage: BlitzPage = () => {
	const router = useRouter();
	const [createDesignMutation] = useMutation(createDesign);

	return (
		<Container size="lg">
			<Heading mb={6}>New Design</Heading>

			<DesignForm
				initialValues={{isPublic: false}}
				submitIcon={<AddIcon />}
				onSubmit={async data => {
					if (!data.stitchFileId) {
						throw new Error('Missing file');
					}

					const design = await createDesignMutation(data as (SetRequired<typeof data, 'stitchFileId'>));

					await router.push(`/designs/${design.id}`);
				}}
			/>
		</Container>
	);
};

NewDesignPage.getLayout = page => (
	<Layout title={'Create New Design'} bg="gray.50">{page}</Layout>
);
NewDesignPage.authenticate = true;

export default NewDesignPage;
