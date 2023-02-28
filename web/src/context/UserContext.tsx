import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext({});

export default function Context(props: any) {
  const [user, setUser] = useState<any>();

  const auth = async () => {
    try {
      const res = await fetch('http://localhost:4000/auth/login/success', {
        method: 'GET',
        // credentials: "include",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          //   "Access-Control-Allow-Credentials": true,
        } as any,
      });

      const result = await res.json();
      if (res.status === 200) {
        setUser(result.user);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // load to check whether user is already present or not
    // auth();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
