import mongoose from 'mongoose';

const fundSchema = mongoose.Schema(
  {
    name: { type: String, min: 2, max: 50, required: true },
    role: {
      type: 'String',
      default: 'Member',
      enum: ['Member', 'Guest'],
    },
    phoneNumber: { type: String,  default: '(000)000-00000' },
    email: {
      type: String,
      min: 0,
      max: 50,
      default: '',
      trim: true,
    },
    inDate:{type: Date},
    amount: { type: Number, min: 0, max: 100000, default: 0 },
    description: {
      type: String,
      required: true,
      minLength: 0,
      maxLength: 1000,
    },
    uid: { type: String, required: true },
    uName: { type: String, required: true },
    uPhoto: { type: String, default: "" },
  },
  { timestamps: true }
);

const Fund = mongoose.model('funds', fundSchema);
export default Fund;
