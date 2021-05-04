import React from 'react';
import Layout from 'app/layouts/Layout';
import {useRouter, useMutation, BlitzPage} from 'blitz';
import createDesign from 'app/designs/mutations/createDesign';
import DesignForm from 'app/designs/components/DesignForm';
import {Container, Heading} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';

const NewDesignPage: BlitzPage = () => {
	const router = useRouter();
	const [createDesignMutation] = useMutation(createDesign);

	return (
		<DesignForm
			initialValues={{isPublic: false}}
			submitIcon={<AddIcon />}
			onSubmit={async data => {
				const design = await createDesignMutation(data);

				await router.push(`/designs/${design.id}`);
			}}
		/>
	);
};

NewDesignPage.getLayout = page => (
	<Layout title={'Create New Design'} header="New Design" bg="gray.50">{page}</Layout>
);
NewDesignPage.authenticate = true;

export default NewDesignPage;
