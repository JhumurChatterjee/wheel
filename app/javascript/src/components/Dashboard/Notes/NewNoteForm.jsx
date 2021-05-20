import React, { useState } from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Input, Textarea, Select } from "neetoui/formik";
import { Button, Switch } from "neetoui";
import notesApi from "apis/notes";

export default function NewNoteForm({ onClose, refetch }) {
  const [dueDateEnable, setDueDateEnable] = useState(false);

  const toggleDueDateEnable = () => {
    setDueDateEnable(!dueDateEnable);
  };

  const numbers = ["65", "65"];

  const newarray = numbers.map(() => {
    return { label: "65", value: "65" };
  });

  const handleSubmit = async values => {
    values = { ...values, tag: values.tag.value };

    try {
      await notesApi.create(values);
      refetch();
      onClose();
    } catch (err) {
      logger.error(err);
    }
  };
  return (
    <Formik
      initialValues={{
        title: "",
        description: "",
        tag: "",
        contact_id: "",
        due_date: "",
      }}
      onSubmit={handleSubmit}
      validationSchema={yup.object({
        title: yup.string().required("Title is required"),
        description: yup.string().required("Description is required"),
        tag: yup.object().required("Tag is required"),
      })}
    >
      {({ isSubmitting }) => (
        <Form>
          <Input label="Note Title" name="title" className="mb-6" />

          <Select
            label="Tag"
            name="tag"
            defaultValue={{ value: "internal", label: "Internal" }}
            className="mb-6"
            options={[
              { label: "Internal", value: "internal" },
              { label: "Agile Workflow", value: "agile_workflow" },
              { label: "Bug", value: "bug" },
            ]}
          />

          <Textarea
            label="Note Description"
            name="description"
            rows={8}
            className="mb-6"
          />

          <Select
            label="Contact"
            name="contact_id"
            options={newarray}
            className="mb-6"
          />

          <div className="due-date-switch">
            <label>Add Due Date to Note</label>

            <Switch
              name="sell"
              value="Y"
              checked={dueDateEnable === true}
              onChange={() => {
                toggleDueDateEnable();
              }}
            />
          </div>

          {dueDateEnable && (
            <Input label="Note Due Date" name="due_date" className="mt-6" />
          )}

          <div className="nui-pane__footer nui-pane__footer--absolute">
            <Button
              onClick={onClose}
              label="Cancel"
              size="large"
              style="secondary"
            />

            <Button
              type="submit"
              label="Submit"
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
