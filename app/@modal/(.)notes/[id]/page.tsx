import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { isAxiosError } from 'axios';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api';
import NotePreviewClient from './NotePreview.client';

type Props = {
  params: Promise<{ id: string }>;
};

const NotePreviewContent = async ({ params }: Props) => {
  const { id } = await params;

  const queryClient = new QueryClient();
  const queryKey = ['note', id];

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => fetchNoteById(id),
  });

  const queryState = queryClient.getQueryState(queryKey);

  if (queryState?.status === 'error') {
    const error = queryState.error;

    if (isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
};

export default function NotePreview({ params }: Props) {
  return (
    <Suspense fallback={<p>Loading note...</p>}>
      <NotePreviewContent params={params} />
    </Suspense>
  );
}
