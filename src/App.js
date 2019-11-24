import React, { useState, useRef } from "react";
import { Formik, Form } from "formik";
import {
  FrequencyInput,
  TextInput,
  CheckboxInput,
  DropdownInput
} from "./components/input";
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
  FrequencyInterval: yup.number().required(),
  NotifyOnFailureOperator: yup.string().required(),
  NotifyLevelEventLog: yup.string().required(),
  IsNotifyOnFailure: yup.boolean().required(),
  IsDeleted: yup.boolean().required(),
  IsEnabled: yup.boolean().required()
});

function App() {
  const [jsonTask, setJsonTask] = useState(null);
  const jsonTextArea = useRef(null);

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
            FrequencyInterval: 0,
            NotifyOnFailureOperator: "",
            IsNotifyOnFailure: true,
            IsDeleted: false,
            IsEnabled: true,
            NotifyLevelEventLog: "OnFailure"
          }}
          validationSchema={schema}
          validate={values => {
            const errors = {};
            if (values.Frequency !== "Day" && values.FrequencyInterval === 0) {
              errors.FrequencyInterval = "Interval must be greater than 0";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setJsonTask(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextInput
                name="TaskUid"
                placeholder="00000000-0000-0000-0000-000000000000"
                generateNewValue={() => uuidv4()}
              />
              <TextInput name="Identifier" placeholder="Task name" />
              <TextInput
                name="TSQLCommand"
                placeholder="exec db.schema.proc;"
              />
              <TextInput name="StartTime" placeholder="00:00:00" />
              <DropdownInput
                name="Frequency"
                values={["Day", "Hour", "Minute", "Second"]}
              />
              <FrequencyInput />
              <TextInput
                name="NotifyOnFailureOperator"
                placeholder="Operator Name"
                autoComplete="on"
              />
              <DropdownInput
                name="NotifyLevelEventLog"
                values={["Always", "OnSuccess", "OnFailure", "Never"]}
              />
              <CheckboxInput
                name="IsNotifyOnFailure"
                label="Notify on failure?"
              />
              <CheckboxInput name="IsDeleted" label="Deleted?" />
              <CheckboxInput name="IsEnabled" label="Enabled?" />
              <div className="flex">
                <button
                  type="submit"
                  className="my-2 bg-blue-400 text-white hover:bg-blue-600 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isSubmitting}
                >
                  Create JSON
                </button>
                {jsonTask && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      jsonTextArea.current.select();
                      document.execCommand("copy");
                    }}
                    className="ml-3 my-2 bg-blue-400 text-white hover:bg-blue-600 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Copy to clipboard
                  </button>
                )}
              </div>
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
              ref={jsonTextArea}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
