import express from "express";
import { getAllNotesHandler } from "../handlers/notesHandlers.js";

const noteRouter = express.Router();

noteRouter.get("/notes", getAllNotesHandler);

export default noteRouter;
