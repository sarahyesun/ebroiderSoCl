import React, { ReactNode, PropsWithoutRef } from "react";
import {
  Form as FinalForm,
  FormProps as FinalFormProps,
} from "react-final-form";
import * as z from "zod";
import { Alert, AlertDescription, AlertIcon, Button } from "@chakra-ui/react";
export { FORM_ERROR } from "final-form";
import { Except } from "type-fest";

type ChildWithRenderMethod = (options: {
  submitButton: React.ReactNode;
}) => React.ReactNode;

const hasRenderMethod = (children: any): children is ChildWithRenderMethod =>
  typeof children === "function";

type FormProps<S extends z.ZodType<any, any>> = {
  /** All your form fields */
  children: ReactNode | ChildWithRenderMethod;
  /** Text to display in the submit button */
  submitText: string;
  submitIcon?: React.ReactElement;
  schema?: S;
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"];
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"];
} & Except<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit">;

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  submitIcon,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={(values) => {
        if (!schema) {
          return;
        }

        try {
          schema.parse(values);
        } catch (error: unknown) {
          return (error as any).formErrors.fieldErrors;
        }
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, submitError }) => (
        <form onSubmit={handleSubmit} className="form" {...props}>
          {submitError && (
            <Alert status="error" mb={5}>
              <AlertIcon />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Form fields supplied as children are rendered here */}
          {hasRenderMethod(children)
            ? children({
                submitButton: (
                  <Button
                    type="submit"
                    disabled={submitting}
                    colorScheme="blue"
                    leftIcon={submitIcon ?? undefined}
                  >
                    {submitText}
                  </Button>
                ),
              })
            : children}

          {!hasRenderMethod(children) && (
            <Button
              type="submit"
              disabled={submitting}
              colorScheme="blue"
              leftIcon={submitIcon ?? undefined}
            >
              {submitText}
            </Button>
          )}
        </form>
      )}
    />
  );
}

export default Form;
