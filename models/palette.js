const mongoose = require('mongoose');

const paletteSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  couleurs: [String],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('palettes', paletteSchema);