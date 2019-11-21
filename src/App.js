import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./App.css";

const TextInput = ({ name, placeholder }) => {
  return (
    <label className="block mt-2">
      <span className="text-gray-700">{name}</span>
      <Field
        className="form-input mt-1 block w-full"
        name={name}
        placeholder={placeholder}
      />
      <ErrorMessage name={name} component="div" />
    </label>
  );
};

function App() {
  return (
    <div>
      <header className="text-center text-4xl font-bold">tsqlScheduler Task Creator</header>
      <div className="max-w-xl mx-auto mt-3 px-4 py-2 bg-gray-100 shadow-xl">
        <Formik
          initialValues={{
            TaskUid: "",
            Identifier: ""
          }}
          validate={values => {
            const errors = {};
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextInput
                name="TaskUid"
                placeholder="00000000-0000-0000-0000-000000000000"
              />
              <button
                className="mt-2 bg-gray-200 text-gray-800 hover:bg-gray-400 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={e => e.preventDefault()}
              >
                Generate TaskUid
              </button>

              <TextInput name="Identifier" placeholder="Task name" />

              <button type="submit" className="mt-6 bg-blue-400 text-white hover:bg-blue-600 py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default App;
