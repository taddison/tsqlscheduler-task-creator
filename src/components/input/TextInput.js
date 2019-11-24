import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik"

const refreshSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="20"
      height="20"
      viewBox="0 0 26 26"
    >
      <path d="M 13.8125 0 C 7.878906 0 4.082031 4.292969 4 10 L 0.5 10 C 0.300781 10 0.09375 10.113281 0.09375 10.3125 C -0.0078125 10.511719 -0.0078125 10.710938 0.09375 10.8125 L 6.09375 18.5 C 6.195313 18.601563 6.300781 18.6875 6.5 18.6875 C 6.699219 18.6875 6.804688 18.601563 6.90625 18.5 L 12.90625 10.8125 C 13.007813 10.710938 13.007813 10.511719 12.90625 10.3125 C 12.804688 10.113281 12.601563 10 12.5 10 L 9 10 C 9.066406 2.464844 12.921875 0.789063 13.8125 0.09375 C 14.011719 -0.0078125 14.011719 0 13.8125 0 Z M 19.5 7.34375 C 19.351563 7.34375 19.195313 7.398438 19.09375 7.5 L 13.09375 15.1875 C 12.992188 15.386719 13 15.585938 13 15.6875 C 13.101563 15.886719 13.304688 16 13.40625 16 L 17 16 C 16.933594 23.535156 13.078125 25.210938 12.1875 25.90625 C 11.988281 26.007813 11.988281 26 12.1875 26 C 18.121094 26 21.917969 21.707031 22 16 L 25.40625 16 C 25.605469 16 25.8125 15.886719 25.8125 15.6875 C 26.011719 15.488281 26.007813 15.289063 25.90625 15.1875 L 19.90625 7.5 C 19.804688 7.398438 19.648438 7.34375 19.5 7.34375 Z"></path>
    </svg>
  );
};

export default ({
  name,
  placeholder,
  generateNewValue,
  autocomplete = "off"
}) => {
  const { setFieldValue } = useFormikContext();
  return (
    <label className="block mb-2">
      <span className="text-gray-700 font-semibold flex">{name}</span>
      <div className="w-full flex mt-1">
        <Field
          className="form-input w-full"
          name={name}
          placeholder={placeholder}
          autoComplete={autocomplete}
        />
        {generateNewValue && (
          <button
            className="ml-2 bg-gray-200 text-gray-800 hover:bg-gray-400 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={e => {
              e.preventDefault();
              setFieldValue(name, generateNewValue());
            }}
          >
            {refreshSvg()}
          </button>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-800 italic"
      />
    </label>
  );
};