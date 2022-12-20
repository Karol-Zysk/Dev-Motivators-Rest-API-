import Link from "next/link";
import "styles/globals.css";
import { cookies } from "next/headers";

export const getProfile = async () => {
  //@ts-ignore
  const nextCookies = cookies();
  const token = nextCookies.get("cookie");
  console.log(token);

  if (token) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append("Origin", "http://localhost:3000");
    headers.append("Authorization", `Bearer ${token.value}`);

    const res = await fetch("http://127.0.0.1:4000/api/v1/users/profile", {
      headers: headers,
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    console.log(data.profile.user.login);

    return data.profile.user.login;
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const name = await getProfile();
  console.log(name);
  return (
    <html>
      <head />
      <body>
        <header className="p-2 bg-gradient-to-b from-sky-200 to-sky-50 ">
          <ul className="flex justify-end gap-10 m-4 text-lg">
            <li className="text-sky-600">
              <Link href={"/"}>Home</Link>
            </li>
            <li className="text-sky-600">
              <Link href={"/login"}>Login</Link>
            </li>
            <li className="text-sky-600">
              <Link href={"/signup"}>Sign Up</Link>
            </li>
            <li className="text-sky-600">
              <h1>Hello {name}! </h1>
            </li>
          </ul>
        </header>
        {/* <ChakraProvider theme={theme}> */}
        {/* <ColorModeScript initialColorMode={theme.config.initialColorMode}> */}
        {children}
        {/* </ColorModeScript> */}
        {/* </ChakraProvider> */}
      </body>
    </html>
  );
}
