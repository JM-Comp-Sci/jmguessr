// models/MapPlays.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define the schema
const MapPlaysSchema = new mongoose.Schema({
  mapId: { type: Number, required: true },
  plays: { type: Number, default: 0 },
});

// Export the model if not already created
export default mongoose.models.MapPlays || mongoose.model('MapPlays', MapPlaysSchema);

