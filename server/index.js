require('dotenv').config(); //loads variables from .env file into process.env
// this keeps sensitive data out of code.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const bidRoutes = require("./routes/bidRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

//app.use()->registers middleware
app.use(cors()); //allow cross origin requests(frontend->backend)
app.use(express.json()); //parses incoming JSON request bodies.

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("DB Connected");
  })
  .catch(err => console.log(err));

  //Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/users", userRoutes);

// port 5000 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



