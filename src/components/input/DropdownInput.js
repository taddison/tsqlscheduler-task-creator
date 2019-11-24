import React from "react";
import { Field, ErrorMessage } from "formik";

export default ({ name, values }) => {
  return (
    <div>
      <span className="text-gray-700 font-semibold">{name}</span>
      <label className="mt-1">
        <Field name={name} as="select" className="form-select block w-full">
          {values.map(value => {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </Field>
        <ErrorMessage
          name={name}
          component="div"
          className="text-red-800 italic"
        />
      </label>
    </div>
  );
};