import axios, { type AxiosResponse } from "axios";
import type { Note, NoteTag } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (!token) {
    throw new Error("Missing VITE_NOTEHUB_TOKEN environment variable");
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const queryParams: Record<string, string | number> = {
    page: params.page,
    perPage: params.perPage,
  };
  if (params.search) {
    queryParams.search = params.search;
  }

  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params: queryParams,
  });
  return response.data;
};

export const createNote = async (data: CreateNoteParams): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.post("/notes", data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return response.data;
};
