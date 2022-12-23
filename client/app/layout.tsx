import Link from "next/link";
import "styles/globals.css";
import { cookies } from "next/headers";

export const getProfile = async () => {
  const nextCookies = cookies();
  const token = nextCookies.get("cookie");
  if (token) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append("Origin", "http://localhost:3000");
    headers.append("Authorization", `Bearer ${token.value}`);

    const res = await fetch("http://127.0.0.1:4001/api/v1/users/profile", {
      headers: headers,
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();

    return data.profile.user;
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getProfile();

  return (
    <html>
      <head />
      <body className="w-full h-full min-h-screen">
        <header className="flex items-center justify-between p-3 bg-gradient-to-b from-sky-900 to-slate-900 ">
          <div className="flex h-full ">
            <h1 className="block p-3 mt-auto mb-auto text-xl font-bold text-white shadow-sm shadow-black">
              DevMotivators
            </h1>
          </div>
          <ul className="flex justify-end gap-10 m-4 text-lg">
            <li className="font-bold text-white">
              <Link href={"/"}>Home</Link>
            </li>
            <li className="font-bold text-white">
              <Link href={"/login"}>Login</Link>
            </li>
            {data && (
              <li className="font-bold text-white">
                <Link href={"/createMotivator"}>Create Motivator</Link>
              </li>
            )}
            <li className="font-bold text-white">
              <Link href={"/signup"}>Sign Up</Link>
            </li>
            <li className="font-bold text-white">
              <h1>Hello {data && data.login}! </h1>
            </li>
          </ul>
        </header>
        <main className="flex items-center justify-center w-full h-full p-4 bg-gradient-to-b from-black to-slate-900">
          {children}
        </main>
      </body>
    </html>
  );
}
