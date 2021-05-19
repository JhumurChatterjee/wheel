import React from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Input, Textarea, Select } from "neetoui/formik";
import { Button } from "neetoui";
import notesApi from "apis/notes";

export default function NewNoteForm({ onClose, refetch }) {
  const handleSubmit = async values => {
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
      }}
      onSubmit={handleSubmit}
      validationSchema={yup.object({
        title: yup.string().required("Title is required"),
        description: yup.string().required("Description is required"),
        tag: yup.string().required("Tag is required"),
        contact_id: yup.string().required("Contact is required"),
      })}
    >
      {({ isSubmitting }) => (
        <Form>
          <Input label="Note Title" name="title" className="mb-6" />
          <Select
            label="Tag"
            defaultValue={{ value: "internal", label: "Internal" }}
            placeholder="Select an Option"
            isSearchable={true}
            name="tag"
            className="mb-6"
            options={[
              { value: "internal", label: "Internal" },
              { value: "agile_workflow", label: "Agile Workflow" },
              { value: "bug", label: "Bug" },
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
            placeholder="Select an Option"
            isSearchable={true}
            name="contact_id"
            className="mb-6"
            options={[{ value: "111", label: "ABC" }]}
          />
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
