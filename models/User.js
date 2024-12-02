// models/User.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define the User schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  studentId: { type: String, unique: true, required: true },
  secret: { type: String, default: uuidv4 }, // Generate a unique secret
  points: { type: Number, default: 0 },
  history: { type: Array, default: [] }, // Array for future use
  paid: { type: Boolean, default: false }
});

// Export the model if not already created
export default mongoose.models.User || mongoose.model('User', UserSchema);
