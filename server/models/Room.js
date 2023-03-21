import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    price: { type: Number, min: 0, max: 5000, default: 0 },
    inDate:{type: Date},
    title: { type: String, required: true, minLength: 5, maxLength: 150 },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 1000,
    },
    images: {
      type: [String],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    uid: { type: String, required: true },
    uName: { type: String, required: true },
    uPhoto: { type: String, default: "" },
  },
  { timestamps: true }
);

const Room = mongoose.model("rooms", roomSchema);

export default Room;
