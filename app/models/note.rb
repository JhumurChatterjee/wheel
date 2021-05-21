# frozen_string_literal: true

class Note < ApplicationRecord
  belongs_to :user
  belongs_to :contact, optional: true

  validates :title, :description, presence: true
  validates :title, uniqueness: true

  delegate :initial, to: :contact, allow_nil: true, prefix: true
end
