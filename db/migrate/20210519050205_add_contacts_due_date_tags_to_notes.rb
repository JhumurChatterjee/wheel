class AddContactsDueDateTagsToNotes < ActiveRecord::Migration[6.0]
  def change
    add_reference :notes, :contact,  foreign_key: true, type: :uuid
    add_column    :notes, :due_date, :date
    add_column    :notes, :tag,      :string
  end
end
