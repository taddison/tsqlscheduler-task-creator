import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext, useField } from "formik";
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

const TextInput = ({
  name,
  placeholder,
  generateNewValue,
  autocomplete = "off"
}) => {
  const { setFieldValue } = useFormikContext();
  return (
    <label className="block mb-2">
      <span className="text-gray-700 font-semibold">{name}</span>
      <Field
        className="form-input mt-1 block w-full"
        name={name}
        placeholder={placeholder}
        autoComplete={autocomplete}
      />
      {generateNewValue && (
        <button
          className="mt-2 bg-gray-200 text-gray-800 hover:bg-gray-400 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={e => {
            e.preventDefault();
            setFieldValue(name, generateNewValue());
          }}
        >
          Generate TaskUid
        </button>
      )}
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
  const [field, ] = useField(name);
  console.log(field)
  return (
    <div>
      <span className="text-gray-700 font-semibold">{name}</span>
      <label className="mt-1">
        <Field name={name} as="select" className="form-select block w-full">
          {values.map(value => {
            return <option key={value} value={value}>{value}</option>;
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
  if(values.Frequency === "Day") {
    return <></>
  } else {
    return <TextInput name="FrequencyInterval" placeholder="0, 1, 2..." />
  }
}

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
            if(values.Frequency !== "Day" && values.FrequencyInterval === 0) {
              errors.FrequencyInterval = 'Interval must be greater than 0';
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
              <FrequencyInput/>
              <TextInput
                name="NotifyOnFailureOperator"
                placeholder="Task name"
                autoComplete="on"
              />
              <DropdownInput name="NotifyLevelEventLog"
                values={["Always", "OnSuccess", "OnFailure", "Never"]}/>
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
