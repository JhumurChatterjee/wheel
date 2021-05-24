import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Input, Textarea, Select } from "neetoui/formik";
import { Button, Switch, PageLoader } from "neetoui";
import notesApi from "apis/notes";
import contactsApi from "apis/contacts";

export default function NewNoteForm({ onClose, refetch }) {
  const [dueDateEnable, setDueDateEnable] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactsApi.fetch();
      setContacts(response.data);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDueDateEnable = () => {
    setDueDateEnable(!dueDateEnable);
  };

  const contactList = contacts.map(contact => {
    return { label: contact.initial, value: contact.id };
  });

  const handleSubmit = async values => {
    values = {
      ...values,
      tag: values.tag.value,
      contact_id: values.contact_id.value,
    };

    try {
      await notesApi.create(values);
      refetch();
      onClose();
    } catch (err) {
      logger.error(err);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

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
            label="Tags"
            name="tag"
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
            label="Assigned Contact"
            name="contact_id"
            options={contactList}
            className="mb-6"
          />

          <div className="due-date-switch">
            <label>Add Due Date to Note</label>

            <Switch
              name="Basecamp"
              value="Y"
              checked={dueDateEnable === true}
              onChange={() => {
                toggleDueDateEnable();
              }}
            />
          </div>

          {dueDateEnable && (
            <Input label="Due Date" name="due_date" className="mt-6" />
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
