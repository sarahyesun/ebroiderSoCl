import React from "react"
import { useField } from "react-final-form"
import { Button, Box } from "@chakra-ui/react"
import { ArrowUpIcon } from "@chakra-ui/icons"

type ImageUploadFieldProps = {
  label: string
  name: string
}

const cloneFileList = (list: FileList) => {
  const newList: File[] = []

  for (let i = 0; i < list.length; i++) {
    newList.push(list[i])
  }

  return newList
}

const ImageUploadField = (props: ImageUploadFieldProps) => {
  const {
    input: { value, onChange, ...input },
  } = useField(props.name)

  return (
    <Box mb={6}>
      <input
        {...input}
        onChange={({ target }) => onChange(cloneFileList(target.files ?? new FileList()))}
        type="file"
        id={props.name}
        style={{ display: "none" }}
        accept="image/*"
      />

      <Button
        leftIcon={<ArrowUpIcon />}
        htmlFor={props.name}
        as="label"
        _hover={{ cursor: "pointer" }}
      >
        {props.label}
      </Button>
    </Box>
  )
}

export default ImageUploadField
