const mongoose = require("mongoose");

const AuctionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    currentHighestBid: { type: Number, default: 0 },
    currentHighestBidder: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      default: null,
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["ACTIVE", "CLOSED"], default: "ACTIVE" },
    image: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Auction = mongoose.model("Auction", AuctionSchema);

module.exports = Auction;