const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin SDK init
const serviceAccount = require("./serviceAccountKey.json"); // Replace this later
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Example protected route
app.get("/api/protected", async (req, res) => {
  const authHeader = req.headers.authorization;
  const idToken = authHeader?.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    res.send({ message: "You are authenticated!", uid });
  } catch (err) {
    res.status(401).send({ message: "Unauthorized", error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
