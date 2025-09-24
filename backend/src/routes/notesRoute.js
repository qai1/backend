import express from "express";
import { getAllNotesHandler } from "../handlers/notesHandlers.js";
import { addNoteHandler } from "../handlers/notesHandlers.js";
import { getNoteByIdHandler } from "../handlers/notesHandlers.js";

const noteRouter = express.Router();

noteRouter.get("/notes", getAllNotesHandler);
noteRouter.post("/notes", addNoteHandler);
noteRouter.get("/notes/:id", getNoteByIdHandler);

export default noteRouter;
