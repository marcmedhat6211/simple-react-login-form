import React, { useState, useEffect, useReducer, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

/**
 * useReducer hook:
 *  a replacement for the state hook
 *  manages more complex states
 *  SYNTAX:
 *    const [state, dispachFn] = useReducer(reducerFn, initialState, initFn)
 *      state: the new state snapshot
 *      dispachFn: A function that can be used to dispatch a new action (trigger an update of the state)
 *      reducerFn(prevState, action) => new state: A function that is triggered automatically once an action is dispatched (via the dispatch fn, it receives the latest state snapshot and should return the new, updated state)
 *      initialState: setting an initial state
 *      initFn: to set the initial state programatically (if the initial state is somehow complex)
 */

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }

  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }

  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }

  return { value: "", isValid: false };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const authCtx = useContext(AuthContext);

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

  // here we are using object destructuring to extract the isValid values from the emailState and the passwordState
  // and the emailIsValid and passwordIsValid are just ALIASES when you use that syntax
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  /**
   * What we did here is that we've set a timer and then we're clearing that timer on every keystroke
   * so that this function only runs once when the user is done writing
   */
  useEffect(() => {
    const identifier = setTimeout(() => {
      // console.log("checking for validity");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      // console.log("CLEANUP METHOD");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    // setFormIsValid(
    //   event.target.value.includes("@") && enteredPassword.trim().length > 6
    // );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });

    // setFormIsValid(
    //   event.target.value.trim().length > 6 && enteredEmail.includes("@")
    // );
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.value.includes("@"));
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id="email"
          label="E-Mail"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          id="password"
          label="Password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
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
