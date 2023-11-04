import { createContext, useState } from "react";


//learn about context api 
export const UserContext=createContext({});

export function UserContextProvider({children}){

  const [userInfo,setUserInfo]=useState({});

  return(
    <UserContext.Provider value={{userInfo,setUserInfo}}>
      {children}
    </UserContext.Provider >
  );
}