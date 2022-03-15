import React, { useState, useEffect } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const Login = (props) => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  /**
   * Here we used effect because it is a side effect to use the code twice in 2 places
   *  we were validating the form on every keystroke
   *  now what we're doing is that we call the function setFormIsValid() ONLY when the dependencies (enteredEmail or enteredPassword) changes
   *  so that's handling another side effect
   */

  /**
   * Now we have a problem here
   *  if this function sends an HTTP Request on every keystroke, now that's a problem and a lot of traffic on the network
   *  The solution is to use a CLEANUP FUNCTION
   *    the cleanup function is a return statement from the effect function
   *    the cleanup function is a function that runs before the effect function runs, BUT NOT the fisrt time
   */
  // useEffect(() => {
  //   setFormIsValid(
  //     enteredEmail.includes("@") && enteredPassword.trim().length > 6
  //   );
  // }, [enteredEmail, enteredPassword]);

  /**
   * What we did here is that we've set a timer and then we're clearing that timer on every keystroke
   * so that this function only runs once when the user is done writing
   */
  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("checking for validity");
      setFormIsValid(
        enteredEmail.includes("@") && enteredPassword.trim().length > 6
      );
    }, 500);

    return () => {
      console.log("CLEANUP METHOD");
      clearTimeout(identifier);
    };
  }, [enteredEmail, enteredPassword]);

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);

    // setFormIsValid(
    //   event.target.value.includes("@") && enteredPassword.trim().length > 6
    // );
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);

    // setFormIsValid(
    //   event.target.value.trim().length > 6 && enteredEmail.includes("@")
    // );
  };

  const validateEmailHandler = () => {
    setEmailIsValid(enteredEmail.includes("@"));
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(enteredEmail, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
