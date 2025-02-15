import React, { useState, useEffect } from "react";
import { Checkbox, Button, Tooltip, PageLoader, Avatar } from "neetoui";
import contactsApi from "apis/contacts";
import DeleteAlert from "../../Common/DeleteAlert";

export default function ContactTable({
  selectedContactIds,
  setSelectedContactIds,
  setContacts,
  contacts = [],
}) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingContact, setDeletingContact] = useState("");

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

  const setDeletingRecord = noteId => {
    setShowDeleteAlert(true);
    setDeletingContact(noteId);
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="w-full px-4">
      <table className="nui-table nui-table--checkbox nui-table--hover nui-table--actions">
        <thead>
          <tr>
            <th>
              <Checkbox
                checked={
                  selectedContactIds.length ===
                  contacts.map(contact => contact.id).length
                }
                onClick={() => {
                  const contactIds = contacts.map(contact => contact.id);
                  if (selectedContactIds.length === contactIds.length) {
                    setSelectedContactIds([]);
                  } else {
                    setSelectedContactIds(contactIds);
                  }
                }}
              />
            </th>
            <th className="text-left">Name</th>
            <th className="text-left">Email</th>
            <th className="text-center">Department</th>
            <th className="text-center">Contact Number</th>
            <th className="text-center pr-0">Add to Basecamp</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr
              key={contact.id}
              className={"cursor-pointer bg-white hover:bg-gray-50"}
            >
              <td>
                <Checkbox
                  checked={selectedContactIds.includes(contact.id)}
                  onClick={event => {
                    event.stopPropagation();
                    const index = selectedContactIds.indexOf(contact.id);

                    if (index > -1) {
                      setSelectedContactIds([
                        ...selectedContactIds.slice(0, index),
                        ...selectedContactIds.slice(index + 1),
                      ]);
                    } else {
                      setSelectedContactIds([
                        ...selectedContactIds,
                        contact.id,
                      ]);
                    }
                  }}
                />
              </td>
              <td>
                <div className="flex flex-row items-center justify-start text-gray-900">
                  <Avatar
                    size={36}
                    bgClassName="bg-blue-300 mr-3"
                    contact={{ name: contact.initial }}
                  />
                  {contact.initial}
                </div>
              </td>
              <td>{contact.email}</td>
              <td className="text-center">{contact.department}</td>
              <td className="text-center">{contact.contact_number}</td>
              <td className="basecamp-checkbox">
                {contact.add_to_basecamp && (
                  <Checkbox name="Basecamp" checked />
                )}

                {!contact.add_to_basecamp && <Checkbox name="Basecamp" />}
              </td>
              <td className="flex py-6">
                <Tooltip content="Edit" position="bottom">
                  <Button style="icon" icon="ri-pencil-line" className="mr-3" />
                </Tooltip>

                <Tooltip content="Delete" position="bottom">
                  <Button
                    style="icon"
                    icon="ri-delete-bin-line"
                    onClick={() => setDeletingRecord(contact.id)}
                  />
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteAlert && (
        <DeleteAlert
          module={"contacts"}
          selectedIds={[deletingContact]}
          onClose={() => setShowDeleteAlert(false)}
          refetch={fetchContacts}
          msg={
            "Are you sure you want to delete the contact? All of your data will be permanently removed from our database forever. This action cannot be undone."
          }
        />
      )}
    </div>
  );
}
