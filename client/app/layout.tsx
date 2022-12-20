// import { ChakraProvider } from "@chakra-ui/react";
// import { ColorModeScript } from "@chakra-ui/color-mode";
import { getCookies, setCookie, deleteCookie } from "cookies-next";
import axios from "axios";
import Link from "next/link";
import "styles/globals.css";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body>
        <header className="p-2 bg-gradient-to-b from-sky-200 to-sky-50 ">
          <ul className="flex gap-10">
            <li className="text-sky-600">
              <Link href={"/"}>Home</Link>
            </li>
            <li className="text-sky-600">
              <Link href={"/login"}>Login</Link>
            </li>
            <li className="text-sky-600">
              <Link href={"/signup"}>Sign Up</Link>
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
