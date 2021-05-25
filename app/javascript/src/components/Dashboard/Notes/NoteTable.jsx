import React, { useState, useEffect } from "react";
import { Checkbox, Badge, Avatar, Button, Tooltip, PageLoader } from "neetoui";
import DayJS from "react-dayjs";
import notesApi from "apis/notes";
import DeleteAlert from "../../Common/DeleteAlert";

export default function NoteTable({
  selectedNoteIds,
  setSelectedNoteIds,
  setNotes,
  notes = [],
}) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingNote, setDeletingNote] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

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

  const badgeColor = badge => {
    if (badge === "internal") {
      return "blue";
    } else if (badge === "agile_workflow") {
      return "green";
    } else if (badge === "bug") {
      return "red";
    }
  };

  const titleCase = str => {
    return str
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b(\w)/g, s => s.toUpperCase());
  };

  const descTruncate = (string, limit) => {
    return string.length > limit ? `${string.substr(0, limit)}...` : string;
  };

  const setDeletingRecord = noteId => {
    setShowDeleteAlert(true);
    setDeletingNote(noteId);
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
                  selectedNoteIds.length === notes.map(note => note.id).length
                }
                onClick={() => {
                  const noteIds = notes.map(note => note.id);
                  if (selectedNoteIds.length === noteIds.length) {
                    setSelectedNoteIds([]);
                  } else {
                    setSelectedNoteIds(noteIds);
                  }
                }}
              />
            </th>
            <th className="text-left">Title</th>
            <th className="text-left">Description</th>
            <th className="text-center">Tags</th>
            <th className="text-center">Created Date</th>
            <th className="text-center">Due Date</th>
            <th className="text-left">Contact</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {notes.map(note => (
            <tr
              key={note.id}
              className={"cursor-pointer bg-white hover:bg-gray-50"}
            >
              <td>
                <Checkbox
                  checked={selectedNoteIds.includes(note.id)}
                  onClick={event => {
                    event.stopPropagation();
                    const index = selectedNoteIds.indexOf(note.id);

                    if (index > -1) {
                      setSelectedNoteIds([
                        ...selectedNoteIds.slice(0, index),
                        ...selectedNoteIds.slice(index + 1),
                      ]);
                    } else {
                      setSelectedNoteIds([...selectedNoteIds, note.id]);
                    }
                  }}
                />
              </td>
              <td>
                <div className="flex flex-row items-center justify-start text-gray-900">
                  <Button
                    type="link"
                    label={note.title}
                    style="text"
                    href="#"
                  />
                </div>
              </td>
              <td>{descTruncate(note.description, 10)}</td>
              <td className="text-center">
                <Badge color={badgeColor(note.tag)}>
                  {note.tag ? titleCase(note.tag) : ""}
                </Badge>
              </td>
              <td className="text-center">
                <DayJS format="MMM DD, YYYY">{note.created_at}</DayJS>
              </td>
              <td className="text-center">
                {note.due_date ? (
                  <DayJS format="MMM DD, YYYY">{note.due_date}</DayJS>
                ) : (
                  "--"
                )}
              </td>
              <td className="w-40 text-center pl-4">
                {note.contact_initial ? (
                  <Avatar
                    size={36}
                    bgClassName="bg-blue-300"
                    contact={{ name: note.contact_initial }}
                  />
                ) : (
                  ""
                )}
              </td>
              <td className="flex py-6 w-20">
                <Tooltip content="Edit" position="bottom">
                  <Button style="icon" icon="ri-pencil-line" className="mr-3" />
                </Tooltip>

                <Tooltip content="Delete" position="bottom">
                  <Button
                    style="icon"
                    icon="ri-delete-bin-line"
                    onClick={() => setDeletingRecord(note.id)}
                  />
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteAlert && (
        <DeleteAlert
          module={"notes"}
          selectedIds={[deletingNote]}
          onClose={() => setShowDeleteAlert(false)}
          refetch={fetchNotes}
          msg={
            "Are you sure you want to delete the note? All of your data will be permanently removed from our database forever. This action cannot be undone."
          }
        />
      )}
    </div>
  );
}
