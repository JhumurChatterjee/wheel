# frozen_string_literal: true

FactoryBot.define do
  factory :contact do
    name { "MyString" }
    email { "MyString" }
    department { "MyString" }
    contact_number { "MyString" }
    add_to_basecamp { false }
    user
  end
end
