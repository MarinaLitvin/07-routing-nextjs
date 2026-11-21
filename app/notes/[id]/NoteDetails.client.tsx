"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { fetchNoteById } from "@/lib/api";
import NoteDetails from "@/components/NoteDetails/NoteDetails";

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>Loading note...</p>;
  }

  if (isError || !note) {
    return <p>Something went wrong. Please try again.</p>;
  }

  return <NoteDetails note={note} />;
}
