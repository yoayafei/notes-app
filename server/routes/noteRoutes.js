import express from "express";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  moveToTrash,
  getTrashNotes,
  restoreNote,
  deleteNote,
  getNotesByCategory,
  searchNotesByTags,
  toggleImportant,
  getImportantNotes,
} from "../controllers/noteController.js";

const router = express.Router();

router.post("/", createNote);
router.get("/user/:userId", getNotes);
router.get("/:id", getNote);
router.get("/categories/:userId/:categoryId", getNotesByCategory);
router.get("/search/:userId", searchNotesByTags);
router.get("/trash/:userId", getTrashNotes);
router.put("/:id", updateNote);
router.put("/:id/trash", moveToTrash);
router.put("/:id/restore", restoreNote);
router.put("/:id/important", toggleImportant);
router.get("/important/:userId", getImportantNotes);
router.delete("/:id", deleteNote);

export default router;
