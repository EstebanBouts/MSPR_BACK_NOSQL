const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Utilisation de CORS
app.use(cors());

app.use(express.json()); // Pour parser les requêtes JSON

// Connection à MongoDB
(async () => {
  try {
    await mongoose.connect('mongodb+srv://estebanboutsbonhomme:AoSbIfL7YCqqSxW2@cluster0.hrothke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');

    // Vérifiez les documents dans la collection après la connexion
    const messages = await Message.find({});
    console.log('Documents dans la collection après connexion:', messages);

  } catch (err) {
    console.log('Erreur de connexion à MongoDB:', err);
  }
})();

const messageSchema = new mongoose.Schema({
  idMessage: Number,
  texte: { type: String, required: true },
  envoyePar: { type: String, required: true }, // Normalement, cela serait un ObjectId lié à un modèle d'utilisateur
  dateEnvoi: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Routes de base
app.get('/', (req, res) => {
  res.send('Le serveur fonctionne !');
});

app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find({}); // Utilise .find() sans filtre pour récupérer tous les documents
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de la récupération des messages", error: error });
  }
});

// Exemple de route pour envoyer un message
app.post('/messages', async (req, res) => {
  try {
    const newMessage = new Message({
      idMessage: req.body.idMessage,
      texte: req.body.texte,
      envoyePar: req.body.envoyePar,
      dateEnvoi: req.body.dateEnvoi
    });
    await newMessage.save();
    res.status(201).send(newMessage);
  } catch (error) {
    res.status(400).send(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
