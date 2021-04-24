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
import arrDiff from 'arr-diff';

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
				pictureIds: design.pictures.map(p => p.id),
				fileIds: design.files.map(f => f.id)
			}}
			hydrateValues={{
				previewId: design.files.find(f => f.type === 'image/svg+xml')?.id
			}}
			onSubmit={async data => {
				const {pictureIds, fileIds, ...restOfData} = data;

				const updated = await updateDesignMutation({
					where: {id: design.id},
					data: {
						...restOfData,
						pictures: {
							connect: pictureIds.map(id => ({id})),
							disconnect: arrDiff(design.pictures.map(p => p.id), pictureIds).map(id => ({id}))
						},
						files: fileIds.length > 0 ? {
							connect: fileIds.map(id => ({id})),
							disconnect: design.files.map(({id}) => ({id}))
						} : undefined
					},
					pictureOrder: pictureIds
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
