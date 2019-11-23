import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as yup from "yup";
import "./styles/App.out.css";

// https://stackoverflow.com/a/2117523
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const schema = yup.object().shape({
  TaskUid: yup.string().required(),
  Identifier: yup.string().required(),
  TSQLCommand: yup.string().required(),
  StartTime: yup.string().required(),
  Frequency: yup.string().required(),
  FrequencyInterval: yup.string().required(),
  NotifyOnFailureOperator: yup.string().required(),
  IsNotifyOnFailure: yup.string().required(),
  IsDeleted: yup.string().required(),
  IsEnabled: yup.string().required(),
  NotifyLevelEventLog: yup.string().required()
});

const TextInput = ({ name, placeholder, button }) => {
  return (
    <label className="block mb-2">
      <span className="text-gray-700 font-semibold">{name}</span>
      <Field
        className="form-input mt-1 block w-full"
        name={name}
        placeholder={placeholder}
      />
      {button}
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-800 italic"
      />
    </label>
  );
};

const GuidInput = props => {
  const { setFieldValue } = useFormikContext();
  const button = (
    <button
      className="mt-2 bg-gray-200 text-gray-800 hover:bg-gray-400 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      onClick={e => {
        e.preventDefault();
        setFieldValue("TaskUid", uuidv4());
      }}
    >
      Generate TaskUid
    </button>
  );

  return <TextInput {...props} button={button} />;
};

function App() {
  const [jsonTask, setJsonTask] = useState(null);

  return (
    <div>
      <header className="text-center text-4xl font-bold">
        tsqlScheduler Task Creator
      </header>
      <div className="max-w-xl mx-auto mt-2 px-4 py-2 bg-gray-100 shadow-xl">
        <Formik
          initialValues={{
            TaskUid: uuidv4(),
            Identifier: "",
            TSQLCommand: "",
            StartTime: "00:00:00",
            Frequency: "Day",
            FrequencyInterval: "0",
            NotifyOnFailureOperator: "",
            IsNotifyOnFailure: "true",
            IsDeleted: "false",
            IsEnabled: "false",
            NotifyLevelEventLog: "OnFailure"
          }}
          validationSchema={schema}
          onSubmit={(values, { setSubmitting }) => {
            setJsonTask(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <GuidInput
                name="TaskUid"
                placeholder="00000000-0000-0000-0000-000000000000"
              />

              <TextInput name="Identifier" placeholder="Task name" />
              <TextInput
                name="TSQLCommand"
                placeholder="exec db.schema.proc;"
              />
              <TextInput name="StartTime" placeholder="Task name" />
              <TextInput name="Frequency" placeholder="Task name" />
              <TextInput name="FrequencyInterval" placeholder="Task name" />
              <TextInput
                name="NotifyOnFailureOperator"
                placeholder="Task name"
              />
              <TextInput name="IsNotifyOnFailure" placeholder="Task name" />
              <TextInput name="IsDeleted" placeholder="Task name" />
              <TextInput name="IsEnabled" placeholder="Task name" />
              <TextInput name="NotifyLevelEventLog" placeholder="Task name" />

              <button
                type="submit"
                className="my-2 bg-blue-400 text-white hover:bg-blue-600 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isSubmitting}
              >
                Create JSON
              </button>
            </Form>
          )}
        </Formik>
        {jsonTask && (
          <div className="mt-4">
            <textarea
              className="form-textarea block w-full mb-2"
              rows={13}
              value={jsonTask}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
