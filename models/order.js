const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  couleur: [String],
  quantité: Number,
  prixTotal: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("orders", orderSchema);