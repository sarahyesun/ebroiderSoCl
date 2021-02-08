import React from "react"
import * as z from "zod"
import { Design } from "@prisma/client"
import Form from "app/components/Form"
import TextField from "app/components/LabeledTextField"

type EditableFields = Omit<Design, "createdAt" | "updatedAt" | "userId" | "id" | "isApproved">

type DesignFormProps = {
  initialValues: Partial<EditableFields>
  onSubmit: (values: EditableFields) => {}
  submitIcon?: React.ReactElement
}

const schema = z.object({
  name: z.string(),
  description: z.string(),
  isPublic: z.boolean(),
})

const DesignForm = ({ initialValues, onSubmit, submitIcon }: DesignFormProps) => {
  return (
    <Form
      submitText="Create Design"
      onSubmit={onSubmit}
      submitIcon={submitIcon}
      schema={schema}
      initialValues={initialValues}
    >
      <TextField name="name" label="Name:" placeholder="My awesome new design" />

      <TextField
        type="textarea"
        name="description"
        label="Description:"
        placeholder="My awesome new design"
      />

      <TextField name="isPublic" label="Make public" type="checkbox" />
    </Form>
  )
}

export default DesignForm
