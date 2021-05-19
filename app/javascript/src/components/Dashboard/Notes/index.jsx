import React, { useState, useEffect } from "react";
import notesApi from "apis/notes";
import { Button, PageLoader } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header, SubHeader } from "neetoui/layouts";

import NoteTable from "./NoteTable";
import NewNotePane from "./NewNotePane";
import DeleteAlert from "./DeleteAlert";

const Notes = () => {
  const [loading, setLoading] = useState(true);
  const [showNewNotePane, setShowNewNotePane] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNoteIds, setSelectedNoteIds] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleColumnFilter = () => {
    return true;
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await notesApi.fetch();
      setNotes(response.data);
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
        title="Notes"
        actionBlock={
          <Button
            onClick={() => setShowNewNotePane(true)}
            label="New Note"
            icon="ri-add-line"
          />
        }
      />
      {notes.length ? (
        <>
          <SubHeader
            searchProps={{
              value: searchTerm,
              onChange: e => setSearchTerm(e.target.value),
              clear: () => setSearchTerm(""),
            }}
            deleteButtonProps={{
              onClick: () => setShowDeleteAlert(true),
              disabled: !selectedNoteIds.length,
            }}
            paginationProps={{
              count: notes.length,
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
          <NoteTable
            selectedNoteIds={selectedNoteIds}
            setSelectedNoteIds={setSelectedNoteIds}
            notes={notes}
            setNotes={setNotes}
          />
        </>
      ) : (
        <EmptyState
          image={EmptyNotesListImage}
          title="Your Notes list is empty"
          primaryAction={() => setShowNewNotePane(true)}
          primaryActionLabel="Add Note"
        />
      )}
      <NewNotePane
        showPane={showNewNotePane}
        setShowPane={setShowNewNotePane}
        fetchNotes={fetchNotes}
      />
      {showDeleteAlert && (
        <DeleteAlert
          selectedNoteIds={selectedNoteIds}
          onClose={() => setShowDeleteAlert(false)}
          refetch={fetchNotes}
        />
      )}
    </>
  );
};

export default Notes;
