import React, { useRef, useEffect } from "react";
import styled from "styled-components/macro";

const InnerInput = styled.input`
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid ${props => (props.error ? "red" : "rgba(0, 40, 100, 0.12)")};
  border-radius: 3px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  overflow: visible;
  margin: 0;
  box-sizing: border-box;
`;

export const Input = React.forwardRef(({ autofocus, ...props }, fwRef) => {
  const innerRef = useRef();
  const ref = fwRef || innerRef;

  useEffect(() => {
    if (autofocus) {
      ref.current && ref.current.focus();
    }
  }, [autofocus, ref]);

  return <InnerInput {...props} ref={ref}/>;
});