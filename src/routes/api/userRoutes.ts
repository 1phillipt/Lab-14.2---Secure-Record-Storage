import { Router, Request, Response } from "express";
import { User } from "../../models";
import { signToken } from "../../utils/auth";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);

    const token = signToken({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(req.body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    const token = signToken({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;