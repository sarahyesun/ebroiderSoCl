import React, {useCallback} from 'react';
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

type EditableFields = SetOptional<Except<
Design,
'createdAt' | 'updatedAt' | 'userId' | 'id' | 'isApproved' | 'price'
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
	design: z.any(),
	isPublic: z.boolean()
});

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
				if (design) {
					const formData = new FormData();
					formData.append('file', design[0]);
					const {id} = await (await fetch('/api/uploads', {body: formData, method: 'POST'})).json();
					(valuesToSubmit as EditableFields).stitchFileId = id;
				}

				await onSubmit(valuesToSubmit);
			}}
			submitIcon={submitIcon}
			schema={schema}
			initialValues={initialValues}
		>
			{({submitButton}) => (
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

						<HStack>
							{submitButton}

							<Spacer/>

							{onDelete && (
								<Button colorScheme="red" leftIcon={<DeleteIcon/>} onClick={onDelete}>Delete</Button>
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
