# frozen_string_literal: true

json.array! @contacts, :id, :first_name, :last_name, :email, :department, :contact_number, :add_to_basecamp, :initial
