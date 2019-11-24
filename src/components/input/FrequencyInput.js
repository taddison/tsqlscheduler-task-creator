import React from "react";
import { useFormikContext } from "formik";
import TextInput from "./TextInput";

export default () => {
  const { values } = useFormikContext();
  if (values.Frequency === "Day") {
    return <></>;
  } else {
    return <TextInput name="FrequencyInterval" placeholder="0, 1, 2..." />;
  }
};