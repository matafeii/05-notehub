import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import type { NoteTag } from '../../types/note'
import css from './NoteForm.module.css'

interface NoteFormValues {
  title: string
  content: string
  tag: NoteTag
}

export interface NoteFormProps {
  onSubmit: (values: NoteFormValues) => Promise<void>
  onCancel: () => void
  isCreating: boolean
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content must be at most 500 characters'),
  tag: Yup.mixed<NoteTag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
})

const NoteForm = ({ onSubmit, onCancel, isCreating }: NoteFormProps) => {
  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' as NoteTag }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        await onSubmit(values)
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              type="text"
              name="title"
              className={css.input}
            />
            <ErrorMessage
              name="title"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || isCreating}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default NoteForm

