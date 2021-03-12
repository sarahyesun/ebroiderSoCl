import React from 'react';
import {useField} from 'react-final-form';
import {Button, Box, FormErrorMessage, FormControl} from '@chakra-ui/react';
import {ArrowUpIcon} from '@chakra-ui/icons';

type ImageUploadFieldProps = {
	label: string;
	name: string;
};

const cloneFileList = (list: FileList) => {
	const newList: File[] = [];

	// eslint-disable-next-line unicorn/no-for-loop, @typescript-eslint/prefer-for-of
	for (let i = 0; i < list.length; i++) {
		newList.push(list[i]);
	}

	return newList;
};

const ImageUploadField = (props: ImageUploadFieldProps) => {
	const {
		input: {value, onChange, ...input},
		meta: {error, submitError, touched}
	} = useField(props.name);

	const normalizedError = error ?
		error.join(', ') :
		error || submitError;

	return (
		<FormControl mb={6} isInvalid={normalizedError && touched}>
			<input
				{...input}
				onChange={({target}) => {
					onChange(cloneFileList(target.files ?? new FileList()));
				}}
				type="file"
				id={props.name}
				style={{display: 'none'}}
				accept="image/*"
			/>

			<Button
				leftIcon={<ArrowUpIcon />}
				htmlFor={props.name}
				as="label"
				_hover={{cursor: 'pointer'}}
			>
				{props.label}
			</Button>

			<FormErrorMessage>{normalizedError}</FormErrorMessage>
		</FormControl>
	);
};

export default ImageUploadField;
