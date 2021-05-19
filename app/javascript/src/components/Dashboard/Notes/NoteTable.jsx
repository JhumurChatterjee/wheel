import React, { useState, useEffect } from "react";
import { Checkbox, Badge, Avatar, Button, Tooltip, PageLoader } from "neetoui";
import moment from "moment";
import notesApi from "apis/notes";
import DeleteAlert from "./DeleteAlert";

export default function NoteTable({
  selectedNoteIds,
  setSelectedNoteIds,
  setNotes,
  notes = [],
}) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="w-full px-4">
      <table className="nui-table nui-table--checkbox">
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
                  <a href="#">{note.title}</a>
                </div>
              </td>
              <td>{descTruncate(note.description, 3)}</td>
              <td className="text-center">
                <Badge color={badgeColor(note.tag)}>
                  {note.tag ? titleCase(note.tag) : ""}
                </Badge>
              </td>
              <td className="text-center">
                {moment(note.created_at).format("MMMM DD, YYYY")}
              </td>
              <td className="text-center">
                {note.due_date
                  ? moment(note.due_date).format("MMMM DD, YYYY")
                  : "--"}
              </td>
              <td>
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
              <td>
                <Tooltip content="Edit" position="bottom">
                  <Button style="icon" icon="ri-pencil-line" />
                </Tooltip>
              </td>
              <td>
                <Tooltip content="Delete" position="bottom">
                  <Button
                    style="icon"
                    icon="ri-delete-bin-line"
                    onClick={() => setShowDeleteAlert(true)}
                  />
                </Tooltip>
              </td>

              <td>
                {showDeleteAlert && (
                  <DeleteAlert
                    selectedNoteIds={[note.id]}
                    onClose={() => setShowDeleteAlert(false)}
                    refetch={fetchNotes}
                    msg={
                      "Are you sure you want to delete the note? All of your data will be permanently removed from our database forever. This action cannot be undone."
                    }
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
