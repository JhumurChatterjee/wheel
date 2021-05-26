# frozen_string_literal: true

json.array! @notes, :id, :title, :description, :due_date, :tag, :contact_initial, :created_at
