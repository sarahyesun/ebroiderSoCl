import React, {PropsWithoutRef} from 'react';
import {useField} from 'react-final-form';
import {Except} from 'type-fest';
import {
	Input,
	Checkbox,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Textarea
} from '@chakra-ui/react';

export interface LabeledTextFieldProps
	extends PropsWithoutRef<
	JSX.IntrinsicElements['input'] | JSX.IntrinsicElements['textarea']
	> {
	/** Field name. */
	name: string;
	/** Field label. */
	label: string;
	/** Field type. Doesn't include radio buttons. */
	type?: 'text' | 'password' | 'email' | 'number' | 'checkbox' | 'textarea';
	outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>;
}

export const LabeledTextField = React.forwardRef<
HTMLInputElement | HTMLTextAreaElement,
LabeledTextFieldProps
>(({name, label, outerProps, ...props}, ref) => {
	const {
		input,
		meta: {touched, error, submitError, submitting}
	} = useField(name, {
		parse: props.type === 'number' ? Number : undefined,
		type: props.type
	});

	const normalizedError = Array.isArray(error) ?
		error.join(', ') :
		error || submitError;

	const {size, ...propsWithoutSize} = props as JSX.IntrinsicElements['input'];
	const {value, ...propsWithoutValue} = propsWithoutSize;

	return (
		<FormControl isInvalid={normalizedError && touched} {...outerProps} mb={6}>
			{props.type === 'checkbox' ? (
				<Checkbox
					{...input}
					{...propsWithoutValue}
					defaultChecked={input.checked}
					ref={ref as React.ForwardedRef<HTMLInputElement>}
					isDisabled={submitting}
				>
					{label}
				</Checkbox>
			) : (
				<>
					<FormLabel htmlFor={input.name}>{label}</FormLabel>

					{props.type === 'textarea' ? (
						<Textarea
							{...input}
							disabled={submitting}
							{...(props as JSX.IntrinsicElements['textarea'])}
							ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
						/>
					) : (
						<Input
							{...input}
							disabled={submitting}
							{...(propsWithoutSize as Except<
							JSX.IntrinsicElements['input'],
							'size'
							>)}
							ref={ref as React.ForwardedRef<HTMLInputElement>}
						/>
					)}
				</>
			)}

			<FormErrorMessage>{normalizedError}</FormErrorMessage>
		</FormControl>
	);
});

export default LabeledTextField;
