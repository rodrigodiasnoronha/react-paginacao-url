import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const getProdutos = async (filtros = { _page: 1, _limit: 10 }) =>
  api.get("/produtos", { params: filtros });
