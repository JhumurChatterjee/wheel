import React, { useState } from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Input } from "neetoui/formik";
import { Button, Switch } from "neetoui";
import contactsApi from "apis/contacts";

export default function NewContactForm({ onClose, refetch }) {
  const [basecampEnable, setBasecampEnable] = useState(false);

  const handleSubmit = async values => {
    values = { ...values, add_to_basecamp: basecampEnable };

    try {
      await contactsApi.create(values);
      refetch();
      onClose();
    } catch (err) {
      logger.error(err);
    }
  };

  const toggleBasecampaAllowance = () => {
    setBasecampEnable(!basecampEnable);
  };

  return (
    <Formik
      initialValues={{
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        contact_number: "",
        add_to_basecamp: false,
      }}
      onSubmit={handleSubmit}
      validationSchema={yup.object({
        first_name: yup.string().required("First Name is required"),
        last_name: yup.string().required("Last Name is required"),
        email: yup.string().required("Email is required"),
        department: yup.string().required("Department is required"),
        contact_number: yup.string().required("Contact Number is required"),
      })}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <Input label="First Name" name="first_name" />
          <Input label="Last Name" name="last_name" />
          <Input label="Email" name="email" type="email" />
          <Input label="Contact Number" name="contact_number" />
          <Input label="Department" name="department" />

          <div className="flex justify-between">
            <label>Add to Basecamp</label>

            <Switch
              name="add_to_basecamp"
              checked={basecampEnable === true}
              onChange={() => {
                toggleBasecampaAllowance();
              }}
            />
          </div>

          <div className="nui-pane__footer nui-pane__footer--absolute">
            <Button
              onClick={onClose}
              label="Cancel"
              size="large"
              style="secondary"
            />

            <Button
              type="submit"
              label="Save Changes"
              size="large"
              style="primary"
              className="ml-2"
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
