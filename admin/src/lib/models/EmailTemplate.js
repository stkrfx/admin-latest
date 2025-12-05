import mongoose from 'mongoose';

const emailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'otp_verification'
  subject: { type: String, required: true },
  htmlContent: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.EmailTemplate || mongoose.model('EmailTemplate', emailTemplateSchema);