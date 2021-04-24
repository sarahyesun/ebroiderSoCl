import React, {Suspense} from 'react';
import * as z from 'zod';
import {Design} from '@prisma/client';
import {Grid, Box, HStack, Spacer, Button, BoxProps} from '@chakra-ui/react';
import {DeleteIcon} from '@chakra-ui/icons';
import {Except} from 'type-fest';
import Form from 'app/components/Form';
import TextField from 'app/components/LabeledTextField';
import ImageUploadField from 'app/components/design-file-upload-field';
import ImageUploadPreview from 'app/components/design-file-upload-preview';
import MultiImageUploadField from 'app/components/multi-image-upload-field';
import {useCurrentUser} from 'app/hooks/useCurrentUser';
import getUploadPreviewUrl from 'utils/get-upload-preview-url';

type PartialBy<T, K extends keyof T> = Except<T, K> & Partial<Pick<T, K>>;

type AdminEditableFields = 'isApproved';
type UneditableFields = 'createdAt' | 'updatedAt' | 'userId' | 'id' | 'price';
type ComputedFields = {pictureIds: string[]; fileIds: string[]};

type EditableFields = Except<PartialBy<Design, AdminEditableFields>, UneditableFields> & ComputedFields;

type HydrateableFields = {previewId: string};

type DesignFormProps = {
	initialValues: Partial<EditableFields>;
	hydrateValues?: Partial<HydrateableFields>;
	onSubmit: (values: EditableFields) => Record<string, unknown> | Promise<void>;
	onDelete?: () => Promise<void>;
	submitIcon?: React.ReactElement;
	submitText?: string;
};

const schema = z.object({
	name: z.string(),
	description: z.string(),
	design: z.array(z.instanceof(typeof window === 'undefined' ? Object : File)),
	pictures: z.array(z.union([z.instanceof(typeof window === 'undefined' ? Object : File), z.string()])),
	isPublic: z.boolean(),
	isApproved: z.boolean().optional()
});

const AdminFields = () => {
	const user = useCurrentUser();

	if (user?.role === 'ADMIN') {
		return (
			<>
				<TextField name="isApproved" label="Approved for public display" type="checkbox" outerProps={{mb: 0}} />
			</>
		);
	}

	return null;
};

type FormCardProps = BoxProps & {children: React.ReactElement | React.ReactElement[]};

const FormCard = ({children, ...rest}: FormCardProps) => (
	<Box shadow="md" borderRadius="md" p={4} bg="white" mb={4} d="flex" flexDirection="column" {...rest}>
		{children}
	</Box>
);

const DesignForm = ({
	initialValues,
	hydrateValues,
	onSubmit,
	onDelete,
	submitIcon,
	submitText = 'Create Design'
}: DesignFormProps) => {
	return (
		<Form
			submitText={submitText}
			onSubmit={async values => {
				const {design, pictures, ...rest} = values;

				const valuesToSubmit: EditableFields = {...rest, pictureIds: [], fileIds: []};

				// Upload design
				if (design && design.length > 0) {
					const file = design[0] as File;
					const formData = new FormData();
					formData.append('file', file);
					const {id} = await (await fetch('/api/uploads', {body: formData, method: 'POST'})).json();
					valuesToSubmit.fileIds.push(id);
				}

				// Upload pictures
				if (pictures.length > 0) {
					const formData = new FormData();

					const pictureIds: Array<string | null> = [];

					for (const picture of pictures) {
						if (picture.constructor === File) {
							formData.append('picture', picture);
							pictureIds.push(null);
						} else {
							pictureIds.push(picture as string);
						}
					}

					if (!formData.entries().next().done) {
						const {ids} = await (await fetch('/api/uploads/pictures', {body: formData, method: 'POST'})).json();

						for (const id of ids) {
							pictureIds[pictureIds.indexOf(null)] = id;
						}
					}

					valuesToSubmit.pictureIds = pictureIds as string[];
				}

				await onSubmit(valuesToSubmit);
			}}
			submitIcon={submitIcon}
			schema={schema}
			initialValues={{design: [], ...initialValues, pictures: initialValues.pictureIds ?? []}}
		>
			{({submitButton, submitting}) => (
				<Grid
					templateColumns={{md: '1fr min(20vw, 20rem)'}}
					templateRows="1fr 1fr"
					gap={6}
				>
					<Box>
						<FormCard>
							<TextField
								name="name"
								label="Name:"
								placeholder="My awesome new design"
							/>

							<TextField
								type="textarea"
								name="description"
								label="Description:"
								placeholder="My awesome new design"
							/>
						</FormCard>

						<FormCard>
							<MultiImageUploadField name="pictures"/>
						</FormCard>

						<FormCard>
							<TextField name="isPublic" label="Make public" type="checkbox" />

							<Suspense fallback={<div/>}>
								<AdminFields/>
							</Suspense>
						</FormCard>

						<FormCard>
							<HStack>
								{submitButton}

								<Spacer/>

								{onDelete && (
									<Button colorScheme="red" leftIcon={<DeleteIcon/>} onClick={onDelete} disabled={submitting}>Delete</Button>
								)}
							</HStack>
						</FormCard>
					</Box>

					<Box pb={4}>
						<FormCard h="min(100%, 50vh)">
							<ImageUploadPreview name="design" mb={6} initialUrl={hydrateValues?.previewId ? getUploadPreviewUrl(hydrateValues.previewId, 'svg') : undefined}/>
							<Spacer/>
							<ImageUploadField label="Upload Design" name="design"/>
						</FormCard>
					</Box>
				</Grid>
			)}
		</Form>
	);
};

export default DesignForm;
