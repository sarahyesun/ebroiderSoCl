import React, {Suspense} from 'react';
import Layout from 'app/layouts/Layout';
import {
	Link,
	useRouter,
	useQuery,
	useMutation,
	useParam,
	BlitzPage
} from 'blitz';
import {Container, Heading} from '@chakra-ui/react';
import getDesign from 'app/designs/queries/getDesign';
import updateDesign from 'app/designs/mutations/updateDesign';
import DesignForm from 'app/designs/components/DesignForm';
import deleteDesign from 'app/designs/mutations/deleteDesign';

export const EditDesign = () => {
	const router = useRouter();
	const designId = useParam('designId', 'number');
	const [design, {setQueryData}] = useQuery(getDesign, {
		where: {id: designId}
	});
	const [updateDesignMutation] = useMutation(updateDesign);
	const [deleteDesignMutation] = useMutation(deleteDesign);

	return (
		<DesignForm
			initialValues={{
				name: design.name,
				description: design.description,
				isPublic: design.isPublic,
				isApproved: design.isApproved,
				stitchFileId: design.stitchFileId,
				pictureIds: design.pictures.map(p => p.id)
			}}
			onSubmit={async data => {
				const {pictureIds, ...restOfData} = data;

				const updated = await updateDesignMutation({
					where: {id: design.id},
					data: {
						...restOfData,
						pictures: {
							upsert: pictureIds.map((id, i) => ({
								where: {id},
								create: {
									id,
									order: i
								},
								update: {
									order: i
								}
							}))
						}
					}
				});

				await setQueryData(updated);

				await router.push(router.query.redirect ? router.query.redirect.toString() : `/designs/${updated.id}`);
			}}
			submitText="Edit Design"
			onDelete={async () => {
				await deleteDesignMutation({
					where: {
						id: design.id
					}
				});

				await router.push('/designs');
			}}
		/>
	);
};

const EditDesignPage: BlitzPage = () => {
	return (
		<Container size="lg">
			<Heading mb={6}>Edit Design</Heading>

			<Suspense fallback={<div/>}>
				<EditDesign/>
			</Suspense>
		</Container>
	);
};

EditDesignPage.getLayout = page => (
	<Layout bg="gray.50" title={'Edit Design'}>{page}</Layout>
);
EditDesignPage.authenticate = true;

export default EditDesignPage;
