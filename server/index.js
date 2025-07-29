require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { sequelize } = require("./src/models/index");
const history = require("connect-history-api-fallback");
const status = require("./src/helpers/Response");

const app = express();

// Middleware to parse incoming JSON data ==================================
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/uploads", express.static(__dirname + "/uploads"));

// Configuration for CORS Origin ------------------------------------------------------
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://192.168.14.121:3000"],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true,
//   })
// );
app.use(cookieParser());
app.use(cors("*")); // To allow all orgins =============================

// simple route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Backend is running well",
  });
});

// app.use("/auth", require("./src/routes/auth"));

app.use("/api", require("./src/routes/auth"), require("./src/routes/user"));

app.all("/api/*", (req, res) => {
  return status.ResponseStatus(res, 404, "Endpoint Not Found");
});

// // Handle client-side routing with history fallback
// app.use(history());

// // Serve static files from the 'client/out' directory **after** history middleware
// app.use(express.static(path.join(__dirname, "../client/out")));

// // Catch-all route to serve the frontend's index.html
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/out", "index.html"));
// });

// set port, listen for requests
const PORT = process.env.APP_PORT || 3001;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
