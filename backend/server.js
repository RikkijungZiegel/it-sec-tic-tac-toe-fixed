const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

const SECRET_KEY = "topsecret"; // Geheim auf dem Server speichern

// Funktion: Signatur erzeugen
function createSignature(data) {
  return crypto.createHmac("sha256", SECRET_KEY)
               .update(JSON.stringify(data))
               .digest("hex");
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Benutzer-Datenbank (JSON-Datei)
const usersFilePath = path.join(__dirname, "users.json");

const readUsers = () => {
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Registrierung
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();
  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return res.status(400).json({ message: "Benutzername bereits vergeben" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: "Registrierung erfolgreich" });
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(400).json({ message: "Benutzer nicht gefunden" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Falsches Passwort" });
  }

  res.status(200).json({ message: "Login erfolgreich" });
});

// SPIELSTAND SIGNIEREN
app.post("/sign", (req, res) => {
  const gameData = req.body;

  if (!gameData || typeof gameData !== 'object') {
    return res.status(400).json({ message: "Ungültige Daten zum Signieren" });
  }

  const signature = createSignature(gameData);

  res.json({ gameData, signature });
});

// SPIELSTAND VALIDIEREN
app.post("/validate", (req, res) => {
  const { gameData, signature } = req.body;

  if (!gameData || !signature) {
    return res.status(400).json({ valid: false, message: "Ungültige Anfrage" });
  }

  const validSignature = createSignature(gameData);

  if (validSignature === signature) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
