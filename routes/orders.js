var express = require("express");
var router = express.Router();
const Order = require("../models/order");
const User = require("../models/users");
const Palette = require("../models/palette");

router.post("/checkout", async (req, res) => {
  const { token, couleur, quantité, prixTotal } = req.body;

  const user = await User.findOne({ token });

  if (!user)
    return res
      .status(404)
      .json({ result: false, error: "Utilisateur introuvable" });

  const newOrder = new Order({
    user: user._id,
    couleur,
    quantité,
    prixTotal,
  });

  await newOrder.save();
  console.log("Nouvelle commande reçue :");
  console.log("Couleurs :", couleur);
  console.log("Quantité :", quantité);
  console.log("Prix Total :", prixTotal);
  res.json({ result: true, message: "Commande enregistrée !" });
});

router.post("/", async (req, res) => {
  const { token } = req.body;

  const user = await User.findOne({ token });

  if (!user)
    return res
      .status(404)
      .json({ result: false, error: "Utilisateur introuvable" });

  const orders = await Order.find({ user: user._id })
    .sort({ date: -1 })

  res.json({ result: true, orders });
});

router.post("/save-palette", async (req, res) => {
  const { token, couleurs } = req.body;

  const user = await User.findOne({ token });

  if (!user) return res.status(404).json({ result: false, error: "Utilisateur introuvable" });

  const newPalette = new Palette({
    user: user._id,
    couleurs,
  });

  await newPalette.save();

  res.json({ result: true, message: "Palette enregistrée !" });
});

module.exports = router;
