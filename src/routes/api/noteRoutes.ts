import { Router, Response } from "express";
import { Note } from "../../models";
import { authMiddleware, AuthRequest } from "../../utils/auth";

const router = Router();

router.use(authMiddleware);

// GET /api/notes
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ user: req.user?._id });
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST /api/notes
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.create({
      ...req.body,
      user: req.user?._id,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(400).json(err);
  }
});

// GET /api/notes/:id
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "No note found with this id!" });
    }

    if (note.user.toString() !== req.user?._id) {
      return res
        .status(403)
        .json({ message: "User is not authorized to view this note." });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT /api/notes/:id
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "No note found with this id!" });
    }

    if (note.user.toString() !== req.user?._id) {
      return res
        .status(403)
        .json({ message: "User is not authorized to update this note." });
    }

    note.title = req.body.title ?? note.title;
    note.content = req.body.content ?? note.content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE /api/notes/:id
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "No note found with this id!" });
    }

    if (note.user.toString() !== req.user?._id) {
      return res
        .status(403)
        .json({ message: "User is not authorized to delete this note." });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;