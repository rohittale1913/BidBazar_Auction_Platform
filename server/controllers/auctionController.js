const Auction = require("../models/Auction");

// Auto-close expired auctions helper
const autoCloseExpired = async (auction) => {
  if (auction && auction.status === "ACTIVE" && new Date() > new Date(auction.endTime)) {
    auction.status = "CLOSED";
    await auction.save();
  }
  return auction;
};

const createAuction = async (req, res) => {
  try {
    const { title, description, basePrice, endTime } = req.body;

    const auction = new Auction({
      title,
      description,
      basePrice,
      currentHighestBid: basePrice,
      startTime: new Date(),
      endTime,
      status: "ACTIVE",
      createdBy: req.user._id,
    });

    const savedAuction = await auction.save();
    res.status(201).json(savedAuction);
  } catch (error) {
    res.status(500).json({ message: "Error creating auction" });
  }
};

const getAllAuctions = async (req, res) => {
  try {
    await Auction.updateMany(
      { status: "ACTIVE", endTime: { $lt: new Date() } },
      { $set: { status: "CLOSED" } }
    );
    const auctions = await Auction.find()
      .populate("createdBy", "name email")
      .populate("currentHighestBidder", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching auctions" });
  }
};

const getActiveAuctions = async (req, res) => {
  try {
    await Auction.updateMany(
      { status: "ACTIVE", endTime: { $lt: new Date() } },
      { $set: { status: "CLOSED" } }
    );
    const auctions = await Auction.find({ status: "ACTIVE" })
      .populate("createdBy", "name email")
      .populate("currentHighestBidder", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching auctions" });
  }
};

const getAuctionById = async (req, res) => {
  try {
    const { id } = req.params;
    let auction = await Auction.findById(id)
      .populate("createdBy", "name email")
      .populate("currentHighestBidder", "name email");

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    auction = await autoCloseExpired(auction);
    res.status(200).json(auction);
  } catch (error) {
    res.status(500).json({ message: "Error fetching auction" });
  }
};

const closeAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await Auction.findById(id);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Only the creator can close an auction
    if (auction.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the auction creator can close it" });
    }

    if (auction.status === "CLOSED") {
      return res.status(400).json({ message: "Auction already closed" });
    }

    auction.status = "CLOSED";
    await auction.save();

    res.status(200).json({
      message: "Auction closed",
      winningBid: auction.currentHighestBid,
      winner: auction.currentHighestBidder,
    });
  } catch (error) {
    res.status(500).json({ message: "Error closing auction" });
  }
};

// Get auctions created by the logged-in user
const getMyAuctions = async (req, res) => {
  try {
    await Auction.updateMany(
      { status: "ACTIVE", endTime: { $lt: new Date() } },
      { $set: { status: "CLOSED" } }
    );
    const auctions = await Auction.find({ createdBy: req.user._id })
      .populate("currentHighestBidder", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your auctions" });
  }
};

module.exports = { createAuction, getAllAuctions, getActiveAuctions, getAuctionById, closeAuction, getMyAuctions };