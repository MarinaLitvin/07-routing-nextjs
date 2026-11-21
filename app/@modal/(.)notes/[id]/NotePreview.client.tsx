'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';

type NotePreviewClientProps = {
  id: string;
};

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading note...</p>}

      {isError && <p>Failed to load note details.</p>}

      {!isLoading && !isError && note && (
        <div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          {note.tag && <span>{note.tag}</span>}
          {note.createdAt && <p>Created: {note.createdAt}</p>}
          <button type="button" onClick={handleClose}>
            Close
          </button>
        </div>
      )}
    </Modal>
  );
}
