# frozen_string_literal: true

class Contact < ApplicationRecord
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

  has_many :notes, dependent: :delete_all
  belongs_to :user

  validates :first_name, :last_name, :department, :contact_number, presence: true, length: { maximum: 255 }
  validates :add_to_basecamp, inclusion: { in: [ true, false ] }
  validates :email, presence: true, uniqueness: { case_sensitivity: false }, length: { maximum: 255 }, format: { with: VALID_EMAIL_REGEX }

  def initial
    "#{first_name} #{last_name}"
  end
end
