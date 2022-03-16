import React from "react";

/**
 * The create context fn takes the default state of my component as an argument
 * AuthContext is what the function returns, which is an object that container multiple components
 */
const AuthContext = React.createContext({
  isLoggedIn: false,
});

export default AuthContext;

/**
 * You need to do 2 things to use that context
 *    1) provide it: tell react that i am going to use that context in every component that is wrapped by it
 *    2) Consume it: you need to listen to it if you are going to use it
 */
