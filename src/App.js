import React, { useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useFormikContext,
  useField
} from "formik";
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

const TextInput = ({
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

const CheckboxInput = ({ name, label }) => {
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

const DropdownInput = ({ name, values }) => {
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

const FrequencyInput = () => {
  const { values } = useFormikContext();
  if (values.Frequency === "Day") {
    return <></>;
  } else {
    return <TextInput name="FrequencyInterval" placeholder="0, 1, 2..." />;
  }
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
