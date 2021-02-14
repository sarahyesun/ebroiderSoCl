import { BoxProps, Box } from "@chakra-ui/react"
import { FormSpy } from "react-final-form"

const ImageUploadPreview = ({ name, ...boxProps }: { name: string } & BoxProps) => (
  <Box display="inline-block" height="100%" rounded="sm" overflow="hidden" {...boxProps}>
    <FormSpy subscription={{ values: true }}>
      {(props) => {
        const files = props.values[name]

        if (files && files.length > 0) {
          return (
            <img
              src={URL.createObjectURL(files[0])}
              style={{ display: "block", width: "100%" }}
              alt="Design preview"
            />
          )
        }

        return null
      }}
    </FormSpy>
  </Box>
)

export default ImageUploadPreview
