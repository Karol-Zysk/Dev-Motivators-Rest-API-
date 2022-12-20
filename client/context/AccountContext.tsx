"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, ReactNode } from "react";

interface AccountProps {
  children: ReactNode;
}

interface IAccountContext {
  user: { loggedIn: boolean };
  setUser: React.Dispatch<React.SetStateAction<{ loggedIn: boolean }>>;
}

export const AccountContext = React.createContext<IAccountContext>({
  user: { loggedIn: false },
  setUser() {},
});

const UserContext = ({ children }: AccountProps) => {
  const [user, setUser] = useState({ loggedIn: false });
  console.log(user);

  return (
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
