import React from "react";
import { Field, ErrorMessage } from "formik";

export default ({ name, label }) => {
  return (
    <label className="flex items-center mt-1">
      <Field type="checkbox" name={name} className="form-checkbox" />
      <span className="text-gray-700 font-semibold ml-2 ">{label}</span>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-800 italic"
      />
    </label>
  );
};