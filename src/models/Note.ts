import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  user: Types.ObjectId;
  createdAt: Date;
}

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note: Model<INote> = mongoose.model<INote>("Note", noteSchema);

export default Note;