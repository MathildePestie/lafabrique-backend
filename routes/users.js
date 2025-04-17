var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const User = require("../models/users");
const { upload, cloudinary } = require("../cloudinaryConfig");

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^((\+33|0)[67])(\d{8})$/;

// Route GET avec le token pour récupérer un seul utilisateur depuis la base de donnée en le ciblant avec son token

router.get("/:token", (req, res) => {
  const userToken = req.params.token;

  User.findOne({ token: userToken })
    .then((user) => {
      if (!user) {
        return res.json({ result: false, error: "Utilisateur non trouvé" });
      }
      res.json({ result: true, user });
    })
    .catch(() => {
      res.json({
        result: false,
        error: "Erreur lors de la récupération de l'utilisateur",
      });
    });
});

// Route SignUp - Inscription Nouveaux utilisateurs

router.post("/signup", (req, res) => {
  const { nom, prénom, rue, codePostal, ville, mail, téléphone, password } =
    req.body;
  console.log(req.body);
  if (
    !nom ||
    !prénom ||
    !rue ||
    !codePostal ||
    !ville ||
    !téléphone ||
    !mail ||
    !password
  ) {
    return res.json({ result: false, error: "Tous les champs sont requis" });
  }

  if (!emailRegex.test(mail)) {
    return res.json({ result: false, error: "Format d'email invalide" });
  }

  if (!phoneRegex.test(téléphone)) {
    return res.json({ result: false, error: "Format de téléphone invalide" });
  }

  User.findOne({ mail })
    .then((existingUser) => {
      if (existingUser) {
        return res.json({ result: false, error: "Utilisateur déjà existant" });
      }

      const hash = bcrypt.hashSync(password, 10);

      const newUser = new User({
        token: uid2(32),
        nom: capitalize(nom),
        prénom: capitalize(prénom),
        rue: rue.trim(),
        codePostal: codePostal.trim(),
        ville: capitalize(ville),
        téléphone: téléphone.trim(),
        mail: mail.trim(),
        password: hash,
        commandes: [],
      });

      newUser
        .save()
        .then((newDoc) =>
          res.json({
            result: true,
            newDoc: {
              token: newDoc.token,
              userId: newDoc._id,
              userNom: newDoc.nom,
              userPrénom: newDoc.prénom,
              userRue: newDoc.rue,
              userCodePostal: newDoc.codePostal,
              userVille: newDoc.ville,
              userMail: newDoc.mail,
              userTéléphone: newDoc.téléphone,
              userCommandes: newDoc.commandes,
            },
          })
        )

        .catch((error) => res.json({ result: false, error }));
    })
    .catch((error) => res.json({ result: false, error }));
});

function capitalize(str) {
  return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
}

// Route POST - Connexion (Signin)

router.post("/signin", (req, res) => {
  const { mail, password } = req.body;

  if (!mail || !password) {
    return res.json({ result: false, error: "Champs manquants" });
  }

  User.findOne({ mail })
    .then((user) => {
      if (!user) {
        return res.json({ result: false, error: "Uyilisateur introuvable" });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ result: false, error: "Mot de passe non valide" });
      }

      res.json({ result: true, newDoc: user });
    })
    .catch((err) =>
      res.json({ result: false, error: "Erreur interne du serveur" })
    );
});

// Route pour updater le profil utilisateur depuis la page "Mon compte"

router.post("/update-profile", async (req, res) => {
  const {
    token,
    nom,
    prénom,
    rue,
    codePostal,
    ville,
    mail,
    téléphone,
  } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.json({ result: false, error: "Utilisateur introuvable" });
    }

    user.nom = nom;
    user.prénom = prénom;
    user.rue = rue;
    user.codePostal = codePostal;
    user.ville = ville;
    user.téléphone = téléphone;
    user.mail = mail;

    await user.save();

    res.json({ result: true, user });
  } catch (error) {
    console.error("Erreur du serveur :", error);
    res.json({
      result: false,
      error: "Erreur lors de la mise à jour du profil",
    });
  }
});

router.post('/update-password', async (req, res) => {
  const { token, currentPassword, newPassword } = req.body;

  if (!token || !currentPassword || !newPassword) {
    return res.json({ result: false, error: "Champs manquants" });
  }

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ result: false, error: "Utilisateur introuvable" });
    }

    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.json({ result: false, error: "Mot de passe actuel incorrect" });
    }

    const hash = bcrypt.hashSync(newPassword, 10);

    user.password = hash;
    await user.save();

    res.json({ result: true });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.json({ result: false, error: "Erreur interne du serveur" });
  }
});

router.post('/save-palette', async (req, res) => {
  const { token, palette } = req.body;
  
  if (!Array.isArray(palette) || palette.length === 0) {
    return res.json({ result: false, error: 'Palette invalide' });
  }

  const user = await User.findOne({ token });
  if (!user) return res.json({ result: false, error: 'Utilisateur introuvable' });

  user.palettes.push(palette);
  await user.save();
  res.json({ result: true });
});

router.post('/get-palettes', async (req, res) => {
  const user = await User.findOne({ token: req.body.token });
  if (!user) return res.json({ result: false });

  res.json({ result: true, palettes: user.palettes });
});


module.exports = router;
