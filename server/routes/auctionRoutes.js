const express = require("express");
const { createAuction, getAllAuctions, getActiveAuctions, getAuctionById, closeAuction, getMyAuctions } = require("../controllers/auctionController");
const auth = require("../middleware/auth");

const router = express.Router();

// Protected routes (specific paths before parameterized)
router.get("/user/my-auctions", auth, getMyAuctions);
router.post("/", auth, createAuction);

// Public routes
router.get("/", getAllAuctions);
router.get("/active", getActiveAuctions);
router.get("/:id", getAuctionById);

// Protected parameterized routes
router.post("/:id/close", auth, closeAuction);

module.exports = router;