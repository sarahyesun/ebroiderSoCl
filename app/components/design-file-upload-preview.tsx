import {AttachmentIcon, WarningTwoIcon} from '@chakra-ui/icons';
import {BoxProps, Box} from '@chakra-ui/react';
import {FormSpy} from 'react-final-form';

const ImageUploadPreview = ({
	name,
	initialUrl,
	...boxProps
}: { name: string; initialUrl?: string } & BoxProps) => (
	<Box
		rounded="sm"
		overflow="hidden"
		{...boxProps}
	>
		<FormSpy subscription={{values: true}}>
			{props => {
				const files = props.values[name];

				let src: string | null = null;
				let isEXP = false;

				if (files && files.length > 0) {
					if (files[0].type === '') {
						isEXP = true;
					} else {
						src = URL.createObjectURL(files[0]);
					}
				} else if (initialUrl) {
					src = initialUrl;
				}

				if (src && !isEXP) {
					return (
						<img
							src={src}
							style={{display: 'block', width: '100%'}}
							alt="Design preview"
						/>
					);
				}

				return (
					<Box bg="gray.100" w="full" h="20vh" d="flex" justifyContent="center" alignItems="center">
						{
							isEXP ?
								<AttachmentIcon color="green.400" fontSize={36}/>							:
								<WarningTwoIcon color="yellow.300" fontSize={36}/>
						}
					</Box>
				);
			}}
		</FormSpy>
	</Box>
);

export default ImageUploadPreview;
