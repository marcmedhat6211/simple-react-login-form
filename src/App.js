import React, { useState, useEffect } from "react";

import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import MainHeader from "./components/MainHeader/MainHeader";
import AuthContext from "./store/auth-context";

/**
 * Effect, or Side Effect:
 *
 */

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * this approach will cause an infinite loop, why ?
   *  because we everytime we run this method, we check if the user is logged in, and if he is, we change the state WHICH RE RUNS THE COMPONENT CODE AGAIN
   *  that's where the useEffect() hook comes in
   */
  // const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
  // if (storedUserLoggedInInformation === "1") {
  //   setIsLoggedIn(true);
  // }

  /**
   * The useEffect method takes 2 arguments:
   *   1) the first one is a function where you specify the action you want to do
   *   2) the second one is an array of dependencies, which tells WHEN you want that function to tun
   * IMPORTANT TO NOTE:
   *   the function runs AFTER every component EEVALUATION, then it checks, if the dependencies changed, then it will run the function, otherwise, nothing happens
   *   the function below will run only once because the dependencies hasn't change from the first time it ran
   */
  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = (email, password) => {
    // We should of course check email and password
    // But it's just a dummy/ demo anyways
    localStorage.setItem("isLoggedIn", "1");
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider>
      <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
    </AuthContext.Provider>
  );
}

export default App;
