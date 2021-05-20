import React, { useState, useEffect } from "react";
import contactsApi from "apis/contacts";
import { Button, PageLoader } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header, SubHeader } from "neetoui/layouts";

import ContactTable from "./ContactTable";
import DeleteAlert from "../../Common/DeleteAlert";

const Contacts = () => {
  const [loading, setLoading] = useState(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleColumnFilter = () => {
    return true;
  };

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

  if (loading) {
    return <PageLoader />;
  }
  return (
    <>
      <Header
        title="Contacts"
        actionBlock={<Button label="New Contact" icon="ri-add-line" />}
      />
      {contacts.length ? (
        <>
          <SubHeader
            searchProps={{
              value: searchTerm,
              onChange: e => setSearchTerm(e.target.value),
              clear: () => setSearchTerm(""),
            }}
            deleteButtonProps={{
              onClick: () => setShowDeleteAlert(true),
              disabled: !selectedContactIds.length,
            }}
            paginationProps={{
              count: contacts.length,
              pageSize: 10,
              pageNo: currentPage,
              navigate: pageNo => setCurrentPage(pageNo),
            }}
            sortProps={{
              options: [
                {
                  label: "Description",
                  value: "description",
                  direction: "asc",
                },
                {
                  label: "Name",
                  value: "name",
                  direction: "asc",
                },
              ],
            }}
            toggleFilter={val => handleColumnFilter(val)}
          />
          <ContactTable
            selectedContactIds={selectedContactIds}
            setSelectedContactIds={setSelectedContactIds}
            contacts={contacts}
            setContacts={setContacts}
          />
        </>
      ) : (
        <EmptyState
          image={EmptyNotesListImage}
          title="Your Contacts list is empty"
          primaryActionLabel="Add Contact"
        />
      )}

      {showDeleteAlert && (
        <DeleteAlert
          module={"contacts"}
          selectedIds={selectedContactIds}
          onClose={() => setShowDeleteAlert(false)}
          refetch={fetchContacts}
        />
      )}
    </>
  );
};

export default Contacts;
