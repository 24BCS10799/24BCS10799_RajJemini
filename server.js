require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const RegistrationRoutes = require("./routes/registrations");

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Campus Event Registration API",
    endpoints: {
      registrations: "/api/registrations"
    }
  });
});

app.use("/api/registrations", RegistrationRoutes);

app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body"
    });
  }
  return next(err);
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI. Copy .env.example to .env and configure it.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;
