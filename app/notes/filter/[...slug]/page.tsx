import { Suspense } from 'react';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

const PER_PAGE = 12;

type Props = {
  params: Promise<{ slug?: string[] }>;
};

const FilteredNotesContent = async ({ params }: Props) => {
  const { slug } = await params;
  const tag = slug?.[0] === 'all' ? undefined : slug?.[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag ?? 'all'],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: '',
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag ?? 'all'} />
    </HydrationBoundary>
  );
};

export default function NotesPage({ params }: Props) {
  return (
    <Suspense fallback={<p>Loading notes...</p>}>
      <FilteredNotesContent params={params} />
    </Suspense>
  );
}
