import React, { useEffect, useRef } from "react";
import Select from "react-select";

const Select2 = React.forwardRef(({ autofocus, ...props }, fwRef) => {
    const innerRef = useRef();
    const ref = fwRef || innerRef;

    useEffect(() => {
      if (autofocus) ref.current && ref.current.focus();
    }, [autofocus, ref]);

    function findSelectedOption(value) {
      for (let option of props.options) {
        if (props.getOptionValue(option) === value) {
          return option;
        }
      }

      return null;
    }

    const value = props.isMulti ? props.value.map(findSelectedOption) : findSelectedOption(props.value);

    return <Select {...props} ref={ref} value={value}/>;
  }
);

Select2.defaultProps = {
  isOptionDisabled: option => option.isDisabled,
  getOptionLabel: option => option.label,
  getOptionValue: option => option.value
};

export default Select2;

