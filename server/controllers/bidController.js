const Auction = require("../models/Auction");
const Bid = require("../models/Bid");

const placeBid = async (req, res) => {
  try {
    const { auctionId, bidAmount } = req.body;
    const bidderId = req.user._id;

    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Cannot bid on your own auction
    if (auction.createdBy.toString() === bidderId.toString()) {
      return res.status(400).json({ message: "You cannot bid on your own auction" });
    }

    if (auction.status !== "ACTIVE") {
      return res.status(400).json({ message: "Auction is closed" });
    }

    if (new Date() > new Date(auction.endTime)) {
      auction.status = "CLOSED";
      await auction.save();
      return res.status(400).json({ message: "Auction has expired" });
    }

    if (bidAmount <= auction.currentHighestBid) {
      return res.status(400).json({
        message: `Bid must be greater than current highest bid (₹${auction.currentHighestBid})`,
      });
    }

    // Save bid record
    const bid = new Bid({ auctionId, bidAmount, bidderId });
    await bid.save();

    // Update auction with new highest bid
    auction.currentHighestBid = bidAmount;
    auction.currentHighestBidder = bidderId;
    await auction.save();

    res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ message: "Error placing bid" });
  }
};

const getBidsForAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const bids = await Bid.find({ auctionId })
      .populate("bidderId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bids" });
  }
};

// Get all bids placed by the logged-in user
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidderId: req.user._id })
      .populate({
        path: "auctionId",
        select: "title status currentHighestBid currentHighestBidder endTime",
        populate: { path: "currentHighestBidder", select: "name" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your bids" });
  }
};

// Leaderboard: top bidders by number of winning auctions + total bids
const getLeaderboard = async (req, res) => {
  try {
    // Get all closed auctions with winners
    const closedAuctions = await Auction.find({
      status: "CLOSED",
      currentHighestBidder: { $ne: null },
    }).populate("currentHighestBidder", "name email");

    // Count wins per user
    const winsMap = {};
    closedAuctions.forEach((auction) => {
      const winnerId = auction.currentHighestBidder?._id?.toString();
      if (winnerId) {
        if (!winsMap[winnerId]) {
          winsMap[winnerId] = {
            user: auction.currentHighestBidder,
            wins: 0,
            totalWinAmount: 0,
            wonItems: [],
          };
        }
        winsMap[winnerId].wins += 1;
        winsMap[winnerId].totalWinAmount += auction.currentHighestBid;
        winsMap[winnerId].wonItems.push({
          title: auction.title,
          amount: auction.currentHighestBid,
        });
      }
    });

    // Get bid counts per user
    const bidCounts = await Bid.aggregate([
      { $group: { _id: "$bidderId", totalBids: { $sum: 1 }, totalSpent: { $sum: "$bidAmount" } } },
    ]);

    const bidMap = {};
    bidCounts.forEach((b) => {
      bidMap[b._id.toString()] = { totalBids: b.totalBids, totalSpent: b.totalSpent };
    });

    // Merge data
    const allUserIds = new Set([...Object.keys(winsMap), ...Object.keys(bidMap)]);
    const User = require("../models/User");
    const users = await User.find({ _id: { $in: [...allUserIds] } }, "name email");
    const userMap = {};
    users.forEach((u) => {
      userMap[u._id.toString()] = u;
    });

    const leaderboard = [...allUserIds].map((id) => ({
      user: userMap[id] || winsMap[id]?.user || { name: "Unknown" },
      wins: winsMap[id]?.wins || 0,
      totalWinAmount: winsMap[id]?.totalWinAmount || 0,
      totalBids: bidMap[id]?.totalBids || 0,
      wonItems: winsMap[id]?.wonItems || [],
    }));

    // Sort by wins desc, then totalBids desc
    leaderboard.sort((a, b) => b.wins - a.wins || b.totalBids - a.totalBids);

    res.status(200).json(leaderboard.slice(0, 20));
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

module.exports = { placeBid, getBidsForAuction, getMyBids, getLeaderboard };