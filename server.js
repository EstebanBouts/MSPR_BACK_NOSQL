const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Pour parser les requêtes JSON

// Connection à MongoDB
mongoose.connect('mongodb://localhost:27017/BACK_MSPR', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

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
