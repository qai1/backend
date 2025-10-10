import { useEffect, useState } from "react";

function App() {
  const [notes, setNotes] = useState([]);

  const baseUrl = "https://qai-notes-app-api.vercel.app";

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${baseUrl}/notes`);

      const result = await res.json();

      setNotes(result.data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (newTitle, newContent) => {
    try {
      const res = await fetch(`${baseUrl}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });

      const result = await res.json();

      if (res.ok) {
        setNotes((prevNotes) => [...prevNotes, result.data]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateNote = async (id, updateTitle, updateContent) => {
    try {
      const res = await fetch(`${baseUrl}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updateTitle, content: updateContent }),
      });

      const result = await res.json();

      setNotes((prevNotes) => {
        return prevNotes.map((note) => (note.id === id ? result.data : note));
      });

      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/notes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotes((notes) => notes.filter((note) => note.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getNoteById = (id) => {
    console.log(id);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100 flex flex-col pt-24 items-center">
        <div className="bg-white w-[600px] mt-20 flex flex-col items-center shadow-md rounded-2xl">
          <h1 className="py-10 text-6xl font-semibold">QaiNotes</h1>
          <NoteForm onAddNote={addNote} />
        </div>
        <NoteList
          notes={notes}
          onDelete={handleDelete}
          onUpdate={handleUpdateNote}
          onGetById={getNoteById}
        />
      </main>
    </>
  );
}

export default App;

// ================== Komponen ==================

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 flex justify-center bg-white shadow">
      <div className="flex justify-between px-5 py-5 container">
        <img src="/qailogo2.svg" alt="Logo" className="h-10" />
      </div>
    </nav>
  );
};

const NoteForm = ({ onAddNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddNote(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <section className="container max-w-xl px-5 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          className="rounded-sm outline outline-gray-400 p-3"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          className="resize-y min-h-14 rounded-sm outline outline-gray-400 p-3"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold rounded-lg py-3"
        >
          Add note
        </button>
      </form>
    </section>
  );
};

const NoteItem = ({ note, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg shadow-md bg-white w-[300px] p-5">
      {isEditing ? (
        <>
          <input
            value={editTitle}
            type="text"
            placeholder="Title"
            className="w-full rounded-sm outline outline-gray-400 p-2"
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            value={editContent}
            placeholder="Content"
            className="w-full rounded-sm outline outline-gray-400 p-2 mt-2"
            onChange={(e) => setEditContent(e.target.value)}
          />

          <div className="my-4 flex gap-2">
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => {
                onUpdate(note.id, editTitle, editContent);
                setIsEditing(false);
              }}
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="font-medium text-xl">{note.title}</p>
          <p className="text-sm text-gray-500">
            ~{showFormattedDate(note.created_at)}
          </p>
          <p className="mt-2">{note.content}</p>

          <div className="mt-4 flex gap-2">
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>

            {!confirmDelete ? (
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => onDelete(note.id)}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const NoteList = ({ notes, onUpdate, onDelete }) => {
  return (
    <section className="container py-8">
      <h2 className="inline-flex items-center gap-2 text-2xl font-medium mb-6">
        <img src="/note.svg" alt="note icon" className="w-8 h-8" />
        Notes
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        ) : (
          <h1>Data Kosong</h1>
        )}
      </div>
    </section>
  );
};

// helper
const showFormattedDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    weekday: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("id-ID", options);
};
