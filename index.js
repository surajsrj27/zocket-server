const express = require("express");
const sequelize = require('./util/database');
const cors = require("cors");

const app = express();

// routes
const authRoutes = require("./routes/auth");

// middlewares
app.use(express.json());
app.use(cors());

// actual routes
app.use("/api", authRoutes);

//PORT
const port = process.env.PORT || 5000;

sequelize
    .sync()
    .then(() => {
    app.listen(port, () => {
      console.log("SERVER RUNNING ON PORT 5000");
    });
});

