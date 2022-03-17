import React, { useState, useEffect } from "react";

/**
 * IMPORTANT:
 *    a better code practice is to create all the auth logic in the auth context so you can make your code more cleaner
 */

/**
 * The create context fn takes the default state of my component as an argument
 * AuthContext is what the function returns, which is an object that container multiple components
 * small hint:
 *  specifying default values for all ur context object properties will make your ide autocomplete it when you try to use it outside
 */
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (email, password) => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = () => {
    localStorage.setItem("isLoggedIn", "1");
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

/**
 * You need to do 2 things to use that context
 *    1) provide it: tell react that i am going to use that context in every component that is wrapped by it
 *    2) Consume it: you need to listen to it if you are going to use it
 */
