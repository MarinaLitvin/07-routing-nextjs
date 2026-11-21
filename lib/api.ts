import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Parameters for fetching notes
export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

// Response from GET /notes
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Data for creating a note
export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

// Fetch notes
export async function fetchNotes({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const { data } = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search,
    },
  });

  return data;
}

// Fetch a single note by ID
export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await axiosInstance.get<Note>(`/notes/${id}`);

  return data;
}

// Create a note
export async function createNote(noteData: CreateNoteData): Promise<Note> {
  const { data } = await axiosInstance.post<Note>("/notes", noteData);

  return data;
}

// Delete a note
export async function deleteNote(id: string): Promise<Note> {
  const { data } = await axiosInstance.delete<Note>(`/notes/${id}`);

  return data;
}
