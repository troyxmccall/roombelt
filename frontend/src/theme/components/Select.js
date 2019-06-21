import React, { useEffect, useRef } from "react";
import Select from "react-select";

const Select2 = React.forwardRef(({ autofocus, ...props }, fwRef) => {
    const innerRef = useRef();
    const ref = fwRef || innerRef;

    useEffect(() => {
      if (autofocus) ref.current && ref.current.focus();
    }, [autofocus, ref]);

    function findSelectedOption(options) {
      for (let option of options) {
        if (props.getOptionValue(option) === props.value) {
          return option;
        }

        if (option.options) {
          const subOption = findSelectedOption(option.options);
          if (subOption) return subOption;
        }
      }

      return null;
    }

    return <Select {...props} ref={ref || innerRef} value={findSelectedOption(props.options)}/>;
  }
);

Select2.defaultProps = {
  isOptionDisabled: option => option.isDisabled,
  getOptionLabel: option => option.label,
  getOptionValue: option => option.value
};

export default Select2;

