import React, { useRef, useImperativeHandle } from "react";

import classes from "./Input.module.css";

/**
 * 99.9% of the times you won't need a scecond argument to the component, you will only need props
 * but since we're accessing the input ref from outside the component, we need to pass it as an argument here
 *
 * forwardRef method:
 *  this is a method coming from react which you have to use if you are using the ref of a component from outside the component like in this case
 *  it takes the component as an argument
 */
const Input = React.forwardRef((props, ref) => {
  const inputRef = useRef();

  const activate = () => {
    inputRef.current.focus();
  };

  /**
   * focus: is the externally available name which i'll use anywhere else
   * activate: is a pointer to the function activate which by its turn accesses the input ref and focuses the input
   */
  useImperativeHandle(ref, () => {
    return {
      focus: activate,
    };
  });

  return (
    <div
      className={`${classes.control} ${
        props.isValid === false ? classes.invalid : ""
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
});

export default Input;
