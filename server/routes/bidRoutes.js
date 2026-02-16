const express = require("express");
const { placeBid, getBidsForAuction, getMyBids, getLeaderboard } = require("../controllers/bidController");
const auth = require("../middleware/auth");

const router = express.Router();

// Protected routes (specific paths before parameterized)
router.get("/user/my-bids", auth, getMyBids);
router.post("/", auth, placeBid);

// Public routes
router.get("/leaderboard", getLeaderboard);
router.get("/:auctionId", getBidsForAuction);

module.exports = router;