import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

const NoteList = ({ notes, onDelete }: NoteListProps) => {
  if (notes.length === 0) {
    return null;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => onDelete(note.id)}
              type="button"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
