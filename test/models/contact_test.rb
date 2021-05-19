# frozen_string_literal: true

require 'test_helper'

class ContactTest < ActiveSupport::TestCase
  def setup
    @admin = build(:user, :admin)
  end

  def test_valid_contact
    valid_contact = { first_name: "AA",
                      last_name: "BA",
                      email: "aa@gmail.com",
                      department: "Engineering",
                      contact_number: "1234567890",
                      user: @admin
                    }

    contact = Contact.new(valid_contact)
    assert contact.valid?
  end

  def test_invalid_contact
    invalid_contact = { first_name: "",
                        last_name: "",
                        user: @admin
                       }

    contact = Contact.new(invalid_contact)

    assert_not contact.valid?
    assert_includes contact.errors.full_messages, "First name can't be blank"
    assert_includes contact.errors.full_messages, "Last name can't be blank"
  end
end
