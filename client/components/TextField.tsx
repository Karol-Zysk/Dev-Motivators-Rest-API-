"use client";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Field, useField } from "formik";

interface TextFieldInterface {
  label: string;
  type?: string;
  name: string;
  placeholder: string;
  autoComplete: string;
}

const TextField = ({ label, ...props }: TextFieldInterface) => {
  const [field, meta] = useField(props);

  return (
    //@ts-ignore
    <FormControl isInvalid={meta.touched && meta.error}>
      <FormLabel>{label}</FormLabel>
      <Input as={Field} {...field} {...props} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default TextField;
