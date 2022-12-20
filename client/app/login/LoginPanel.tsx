import cookie from "js-cookie";
import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import TextField from "../../components/TextField";
import { getCookies } from "cookies-next";

export const getProfile = async () => {
  //@ts-ignore
  const token = getCookies("cookie");

  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Origin", "http://localhost:3000");
  headers.append("Authorization", `Bearer ${token.cookie}`);

  //@ts-ignore
  return fetch("http://127.0.0.1:4000/api/v1/motivators/getMyMotivators", {
    headers: headers,
    method: "GET",
    credentials: "include",
    cache: "no-store",
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);

      return res.data;
    });
};

async function getUserName() {
  try {
    // Pobierz dane profilu użytkownika za pomocą funkcji getProfile
    const profile = await getProfile();

    // Pobierz imię użytkownika
    // const { firstName } = profile;

    // Przypisz imię do zmiennej
    // const userName = firstName;

    return profile;
  } catch (error) {
    console.error(error);
  }
}

const LoginPanel = () => {
  const router = useRouter();
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string()
          .required("Email required!")
          .min(6, "Email too short!")
          .max(28, "Email too long!"),
        password: Yup.string()
          .required("Password required!")
          .min(6, "Password too short!")
          .max(28, "Password too long!"),
      })}
      onSubmit={(values, actions) => {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append("Origin", "http://localhost:3000");
        const vals = { ...values };
        alert(JSON.stringify(values, null, 2));
        actions.resetForm();
        fetch("http://127.0.0.1:4000/api/v1/users/login", {
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
            if (!res || !res.ok || res.status >= 400) {
              return;
            }

            return res.json();
          })
          .then((data) => {
            cookie.set("cookie", data.token, { expires: 700000 });
            getUserName();
            if (!data) return;

            // if (data.status) {
            //   setError(data.status);
            // } Add better error handling on backend
            if (data.token) {
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
        <Heading>Log In</Heading>
        <Text as="p" color="red.500">
          {"elo"}
        </Text>
        <TextField
          name="email"
          placeholder="Enter email"
          autoComplete="off"
          label="Email"
          type="text"
        />

        <TextField
          name="password"
          type="password"
          placeholder="Enter password"
          autoComplete="off"
          label="Password"
        />

        <ButtonGroup pt="1rem">
          <Button colorScheme="blue" type="submit">
            Log In
          </Button>
          <Button onClick={() => router.push("/signup")}>Create Account</Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default LoginPanel;
