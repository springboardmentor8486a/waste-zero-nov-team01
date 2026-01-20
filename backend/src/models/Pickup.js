const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateTime: { type: Date, required: true },
  address: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
  status: { type: String, enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], default: 'scheduled' },
  materials: {
    totalKg: { type: Number, default: 0 },
    breakdown: { type: Object, default: {} },
  },
  notes: { type: String },
  photos: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

pickupSchema.index({ volunteer: 1 });
pickupSchema.index({ status: 1 });
pickupSchema.index({ dateTime: 1 });

module.exports = mongoose.model('Pickup', pickupSchema);
