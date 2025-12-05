import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  image: { type: String },
  role: { type: String, enum: ['admin', 'user', 'expert', 'organisation'], default: 'user' },
  isBanned: { type: Boolean, default: false },
  // For credential sharing/onboarding
  tempPassword: { type: String, select: false }, 
  forcePasswordChange: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);