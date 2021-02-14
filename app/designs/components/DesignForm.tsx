import React from "react";
import * as z from "zod";
import { Design } from "@prisma/client";
import { Grid, Box } from "@chakra-ui/react";
import { Except } from "type-fest";
import Form from "app/components/Form";
import TextField from "app/components/LabeledTextField";
import ImageUploadField from "app/components/image-upload-field";
import ImageUploadPreview from "app/components/image-upload-preview";

type EditableFields = Except<
  Design,
  "createdAt" | "updatedAt" | "userId" | "id" | "isApproved"
>;

type DesignFormProps = {
  initialValues: Partial<EditableFields>;
  onSubmit: (values: EditableFields) => Record<string, unknown>;
  submitIcon?: React.ReactElement;
};

const schema = z.object({
  name: z.string(),
  description: z.string(),
  design: z.any(),
  isPublic: z.boolean(),
});

const DesignForm = ({
  initialValues,
  onSubmit,
  submitIcon,
}: DesignFormProps) => {
  return (
    <Form
      submitText="Create Design"
      onSubmit={onSubmit}
      submitIcon={submitIcon}
      schema={schema}
      initialValues={initialValues}
    >
      {({ submitButton }) => (
        <Grid
          templateColumns={{ md: "1fr min(20vw, 20rem)" }}
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

            {submitButton}
          </Box>

          <ImageUploadPreview name="design" mb={6} />
        </Grid>
      )}
    </Form>
  );
};

export default DesignForm;
