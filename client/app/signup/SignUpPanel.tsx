"use client";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import TextField from "../../components/TextField";
import cookie from "js-cookie";

const SignUp = () => {
  const router = useRouter();
  return (
    <Formik
      initialValues={{
        login: "",
        email: "",
        password: "",
        passwordConfirm: "",
      }}
      validationSchema={Yup.object({
        email: Yup.string()
          .required("Email required!")
          .min(6, "Email too short!")
          .max(28, "Email too long!"),
        login: Yup.string()
          .required("Username required!")
          .min(6, "Username too short!")
          .max(28, "Username too long!"),
        password: Yup.string()
          .required("Password required!")
          .min(8, "Password too short!")
          .max(28, "Password too long!"),
        passwordConfirm: Yup.string()
          .required("Password required!")
          .min(8, "Password too short!")
          .max(28, "Password too long!"),
      })}
      onSubmit={(values, actions) => {
        const vals = { ...values };
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append("Origin", "http://localhost:3000");
        alert(JSON.stringify(values, null, 2));
        actions.resetForm();
        fetch("http://localhost:4001/api/v1/users/signup", {
          headers: headers,
          method: "POST",
          credentials: "include",
          cache: "no-store",

          body: JSON.stringify(vals),
        })
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            console.log(res);
            if (!res || !res.ok || res.status >= 400) {
              return;
            }
            return res.json();
          })
          .then((data) => {
            if (!data) return;
            // if (data.status) {
            //   setError(data.status);
            // } Add better error handling on backend
            if (data.token) {
              cookie.set("cookie", data.token, { expires: 700000 });
              router.push("/");
            }
          });
      }}
    >
      <VStack
        as={Form}
        w={{ base: "90%", md: "500px" }}
        m="auto"
        justify="center"
        h="100vh"
        spacing="1rem"
      >
        <Heading>Sign Up</Heading>
        <Text as="p" color="red.500">
          {"elo"}
        </Text>
        <TextField
          name="login"
          placeholder="Enter Username"
          autoComplete="off"
          label="Username"
          type="text"
        />
        <TextField
          name="email"
          placeholder="Enter Email"
          autoComplete="off"
          label="Email"
          type="text"
        />

        <TextField
          name="password"
          placeholder="Enter password"
          autoComplete="off"
          label="Password"
          type="password"
        />
        <TextField
          name="passwordConfirm"
          placeholder="Enter password"
          autoComplete="off"
          label="PasswordConfirm"
          type="password"
        />

        <ButtonGroup pt="1rem">
          <Button colorScheme="blue" type="submit">
            Create Account
          </Button>
          <Button onClick={() => router.push("/")} leftIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default SignUp;
