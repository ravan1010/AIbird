import mongoose from 'mongoose';    

const scoreSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 20 },
  value: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Score', scoreSchema);
