import {BoxProps, Box} from '@chakra-ui/react';
import {FormSpy} from 'react-final-form';

const ImageUploadPreview = ({
	name,
	initialUrl,
	...boxProps
}: { name: string; initialUrl?: string } & BoxProps) => (
	<Box
		display="inline-block"
		height="100%"
		rounded="sm"
		overflow="hidden"
		{...boxProps}
	>
		<FormSpy subscription={{values: true}}>
			{props => {
				const files = props.values[name];

				let src: string | null = null;

				if (files && files.length > 0) {
					src = URL.createObjectURL(files[0]);
				} else if (initialUrl) {
					src = initialUrl;
				}

				if (src) {
					return (
						<img
							src={src}
							style={{display: 'block', width: '100%'}}
							alt="Design preview"
						/>
					);
				}

				return null;
			}}
		</FormSpy>
	</Box>
);

export default ImageUploadPreview;
