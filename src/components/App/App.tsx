import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
import SearchBox from '../SearchBox/SearchBox'
import Pagination from '../Pagination/Pagination'
import Modal from '../Modal/Modal'
import NoteForm from '../NoteForm/NoteForm'
import NoteList from '../NoteList/NoteList'
import { fetchNotes, createNote, deleteNote } from '../../services/noteService'
import type { CreateNoteParams } from '../../services/noteService'
import css from './App.module.css'

const PER_PAGE = 12

const App = () => {
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const queryClient = useQueryClient()

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value)
    setPage(0)
  }, 500)

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)
      debouncedSetSearch(value)
    },
    [debouncedSetSearch]
  )

  const {
    data: notesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page: page + 1,
        perPage: PER_PAGE,
        search: debouncedSearch || undefined,
      }),
  })

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      setIsModalOpen(false)
    },
  })

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const handleCreateNote = async (values: CreateNoteParams) => {
    await createNoteMutation.mutateAsync(values)
  }

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id)
  }

  const notes = notesData?.data ?? []
  const pageCount = notesData?.totalPages ?? 0

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />
        <Pagination
          pageCount={pageCount}
          onPageChange={handlePageChange}
          forcePage={page}
        />
        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Failed to load notes.</p>}

      <NoteList notes={notes} onDelete={handleDeleteNote} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={handleCreateNote}
          onCancel={() => setIsModalOpen(false)}
          isCreating={createNoteMutation.isPending}
        />
      </Modal>
    </div>
  )
}

export default App

