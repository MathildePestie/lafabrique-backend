const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    token: String,
    nom: { type: String, required: true },
    prénom: { type: String, required: true },
    rue: { type: String, required: true },
    codePostal: { type: Number, required: true },
    ville: { type: String, required: true },
    mail: { type: String, unique: true, required: true },
    téléphone: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('users', userSchema);

module.exports = User;