# frozen_string_literal: true

class Api::V1::ContactsController < Api::V1::BaseController
  before_action :load_contact, only: [:show, :delete]

  def index
    @contacts = current_user.contacts
  end

  def create
    @contact = Contact.new(contact_params.merge(user: current_user))
    if @contact.save
      render json: { contact: @contact, notice: "#{@contact.title.humanize} has been added to your contacts!" }
    else
      render json: { error: @contact.errors.full_messages.to_sentence }, status: 422
    end
  end

  def bulk_delete
    contacts = Contact.where(id: params[:ids], user: current_user)
    if contacts.empty?
      render json: { error: "No contacts found with those IDs" }, status: 422
    else
      contacts_count = contacts.size
      contacts.destroy_all
      render json: { notice: "#{contacts_count} contacts deleted successfully." }
    end
  end

  private

    def contact_params
      params.require(:contact).permit([:first_name, :last_name, :email, :department, :contact_number, :add_to_basecamp]).to_h
    end

    def load_contact
      @contact = Contact.find(params[:id])
    end
end
