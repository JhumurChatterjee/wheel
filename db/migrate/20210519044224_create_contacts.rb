class CreateContacts < ActiveRecord::Migration[6.0]
  def change
    create_table :contacts, id: :uuid do |t|
      t.string     :first_name,      null: false
      t.string     :last_name,       null: false
      t.string     :email,           null: false
      t.string     :department,      null: false
      t.string     :contact_number,  null: false
      t.boolean    :add_to_basecamp, null: false, default: false
      t.references :user,            type: :uuid

      t.timestamps
    end
  end
end
