import { pool } from "../config/db.js";

// Mendapatkan semua catatan
export const getAllNotesHandler = async (req, res) => {
  const [notes] = await pool.query("SELECT * FROM notes");

  res.status(200).json({
    status: "success",
    data: notes,
  });
};

// Mambuat catatan baru
export const addNoteHandler = async (req, res) => {
  const { title, content } = req.body;

  // Menyimpan catatan ke database
  const [insertresult] = await pool.query(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content]
  );

  res.status(201).json({
    status: "success",
    message: "Note created",
  });
};

// Mendapatkan catatan berdasarkan ID
export const getNoteByIdHandler = async (req, res) => {
  const { id } = req.params;

  const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);

  res.status(200).json({
    status: "success",
    data: notes[0],
  });
};
