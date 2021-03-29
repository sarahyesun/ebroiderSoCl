import React, {Suspense, useCallback} from 'react';
import * as z from 'zod';
import {Design} from '@prisma/client';
import {Grid, Box, HStack, Spacer, Button} from '@chakra-ui/react';
import {DeleteIcon} from '@chakra-ui/icons';
import {Except, SetOptional} from 'type-fest';
import Form from 'app/components/Form';
import TextField from 'app/components/LabeledTextField';
import ImageUploadField from 'app/components/image-upload-field';
import ImageUploadPreview from 'app/components/image-upload-preview';
import getUploadPreviewUrl from 'utils/get-upload-preview-url';
import {useCurrentUser} from 'app/hooks/useCurrentUser';

type EditableFields = SetOptional<Except<
Design,
'createdAt' | 'updatedAt' | 'userId' | 'id' | 'price'
>, 'stitchFileId'>;

type DesignFormProps = {
	initialValues: Partial<EditableFields>;
	onSubmit: (values: EditableFields) => Record<string, unknown> | Promise<void>;
	onDelete?: () => Promise<void>;
	submitIcon?: React.ReactElement;
	submitText?: string;
};

const schema = z.object({
	name: z.string(),
	description: z.string(),
	design: z.array(z.instanceof(typeof window === 'undefined' ? Object : File)),
	isPublic: z.boolean(),
	isApproved: z.boolean().optional()
});

const schemaWithoutImage = schema.extend({design: z.undefined()});

const AdminFields = () => {
	const user = useCurrentUser();

	if (user?.role === 'ADMIN') {
		return (
			<>
				<TextField name="isApproved" label="Approved" type="checkbox"/>
			</>
		);
	}

	return null;
};

const DesignForm = ({
	initialValues,
	onSubmit,
	onDelete,
	submitIcon,
	submitText = 'Create Design'
}: DesignFormProps) => {
	return (
		<Form
			submitText={submitText}
			onSubmit={async values => {
				const {design, ...valuesToSubmit} = values;

				// Upload design
				if (design && design.length > 0) {
					const formData = new FormData();
					formData.append('file', design[0] as File);
					const {id} = await (await fetch('/api/uploads', {body: formData, method: 'POST'})).json();
					(valuesToSubmit as EditableFields).stitchFileId = id;
				}

				await onSubmit({isApproved: valuesToSubmit.isApproved ?? false, ...valuesToSubmit});
			}}
			submitIcon={submitIcon}
			schema={initialValues.stitchFileId ? schemaWithoutImage : schema}
			initialValues={initialValues}
		>
			{({submitButton, submitting}) => (
				<Grid
					templateColumns={{md: '1fr min(20vw, 20rem)'}}
					templateRows="1fr 1fr"
					gap={6}
				>
					<Box>
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

						<ImageUploadField label="Upload Design" name="design" />

						<TextField name="isPublic" label="Make public" type="checkbox" />

						<Suspense fallback={<div/>}>
							<AdminFields/>
						</Suspense>

						<HStack>
							{submitButton}

							<Spacer/>

							{onDelete && (
								<Button colorScheme="red" leftIcon={<DeleteIcon/>} onClick={onDelete} disabled={submitting}>Delete</Button>
							)}
						</HStack>
					</Box>

					<ImageUploadPreview name="design" mb={6} initialUrl={initialValues.stitchFileId ? getUploadPreviewUrl(initialValues.stitchFileId, 'svg') : undefined}/>
				</Grid>
			)}
		</Form>
	);
};

export default DesignForm;
