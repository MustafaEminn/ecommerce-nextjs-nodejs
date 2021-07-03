import { useEffect, useRef, useState } from "react";

function Form({
  children,
  action,
  id,
  method,
  onChange = () => {},
  onSubmit = () => {},
  style,
}) {
  const [values, setValues] = useState({});
  const formRef = useRef();
  Form.getFields = () => {
    return values;
  };

  useEffect(() => {
    let elements = formRef.current.querySelectorAll("[name]");
    for (var i = 0; elements.length - 1 >= i; i++) {
      let newValues = values;
      if (!newValues[elements[i]?.name]) {
        newValues[elements[i]?.name] = { value: "", verified: false };
        setValues(newValues);
      }
    }
  }, []);

  return (
    <form
      style={style}
      onSubmit={onSubmit}
      ref={formRef}
      onChange={(e) => {
        let newValue = values;
        let regex = new RegExp(e.target.pattern);
        e.target.pattern
          ? (newValue[e.target.name] = {
              value: e.target.value,
              verified: regex.test(e.target.value),
            })
          : (newValue[e.target.name] = {
              value: e.target.value,
              verified: true,
            });
        setValues(newValue);
        onChange();
      }}
      method={method}
      action={action}
      id={id}
    >
      {children}
    </form>
  );
}

export default Form;
