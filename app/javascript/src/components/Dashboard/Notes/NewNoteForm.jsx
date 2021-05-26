import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Input, Textarea, Select } from "neetoui/formik";
import { Button, Switch, PageLoader, DateInput } from "neetoui";
import notesApi from "apis/notes";
import contactsApi from "apis/contacts";
import { TAGS } from "../../../constants";

export default function NewNoteForm({ onClose, refetch }) {
  const [dueDateEnable, setDueDateEnable] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dueDate, setDueDate] = useState("");
  const DEFAULT_DATE_FORMAT = "MM-DD-YYYY";

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
      due_date: dueDate + 1,
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
        <Form className="space-y-6">
          <Input label="Note Title" name="title" />
          <Select label="Tags" name="tag" options={TAGS} />

          <Textarea label="Note Description" name="description" rows={8} />

          <Select
            label="Assigned Contact"
            name="contact_id"
            options={contactList}
          />

          <div className="flex justify-between">
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
            <DateInput
              className="mt-6"
              label="Due Date"
              onChange={setDueDate}
              format={DEFAULT_DATE_FORMAT}
            />
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
