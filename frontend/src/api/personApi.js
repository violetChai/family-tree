import axios from "axios";

const API = "http://localhost:5000/api";

export const updatePerson = async (id, data) => {
    return axios.put(`${API}/person/${id}`, data);
};

export const createPerson = async (name) => {
    return axios.post(`${API}/person`, { name });
};

export const deletePerson = async (id) => {
    return axios.delete(`${API}/person/${id}`);
};

export const createRelationship = async (from, to, type) => {
    return axios.post(`${API}/relationship`, { from, to, type });
};

export const getData = async () => {
    return axios.get(`${API}/data`);
};