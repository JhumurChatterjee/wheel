import axios from "axios";

const fetch = () => axios.get("api/v1/contacts");

const create = payload => axios.post("api/v1/contacts", payload);

const destroy = payload => axios.post("api/v1/contacts/bulk_delete", payload);

const notesApi = {
  fetch,
  create,
  destroy,
};

export default notesApi;
