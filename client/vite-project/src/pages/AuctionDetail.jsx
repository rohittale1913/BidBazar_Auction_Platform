import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAuctionById,
  placeBid,
  getBidsForAuction,
  closeAuction,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import CountdownTimer from "../components/CountdownTimer";

const AuctionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [auctionData, bidsData] = await Promise.all([
        getAuctionById(id),
        getBidsForAuction(id),
      ]);
      setAuction(auctionData);
      setBids(bidsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleBid = async () => {
    if (!user) {
      addToast("Please login to place a bid", "warning");
      navigate("/login");
      return;
    }

    if (!bidAmount || Number(bidAmount) <= 0) {
      setError("Please enter a valid bid amount");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await placeBid(id, Number(bidAmount));
      setSuccess("Bid placed successfully!");
      addToast("Bid placed successfully!", "success");
      setBidAmount("");
      await fetchData();
    } catch (err) {
      setError(err.message || "Bid failed");
      addToast(err.message || "Bid failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    try {
      await closeAuction(id);
      addToast("Auction closed successfully", "success");
      await fetchData();
    } catch (err) {
      setError(err.message);
      addToast(err.message, "error");
    }
  };

  if (!auction) {
    return (
      <div className="page-container">
        <p>Loading auction...</p>
      </div>
    );
  }

  const isClosed =
    auction.status === "CLOSED" ||
    new Date() > new Date(auction.endTime);

  const winnerName =
    auction.currentHighestBidder?.name || "No bids were placed";

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        ← Back to Auctions
      </Link>

      <div className="detail-layout">
        <div className="detail-card">
          <div className="detail-header">
            <h2>{auction.title}</h2>
            <span className={`status-badge ${auction.status.toLowerCase()}`}>
              {auction.status}
            </span>
          </div>

          <p className="detail-desc">{auction.description}</p>

          {auction.createdBy && (
            <p className="created-by">
              Created by <strong>{auction.createdBy.name}</strong>
            </p>
          )}

          <CountdownTimer endTime={auction.endTime} status={auction.status} />

          <div className="detail-stats">
            <div className="stat">
              <span className="stat-label">Base Price</span>
              <span className="stat-value">₹{auction.basePrice}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Current Highest Bid</span>
              <span className="stat-value highlight">
                ₹{auction.currentHighestBid}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Bids</span>
              <span className="stat-value">{bids.length}</span>
            </div>
          </div>

          {isClosed && (
            <div className="winner-banner">
              <h3>🏆 Auction Ended</h3>
              {bids.length > 0 ? (
                <p>
                  Winner: <strong>{winnerName}</strong> with ₹
                  {auction.currentHighestBid}
                </p>
              ) : (
                <p>No bids were placed on this auction.</p>
              )}
            </div>
          )}

          {!isClosed && (
            <div className="bid-form">
              <h3>Place Your Bid</h3>
              {!user && (
                <p className="bid-hint">
                  <Link to="/login" className="auth-link">Login</Link> to place a bid
                </p>
              )}
              {user && (
                <>
                  <p className="bid-hint">
                    Must be greater than ₹{auction.currentHighestBid}
                  </p>
                  <div className="bid-input-row">
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`₹${auction.currentHighestBid + 1} or more`}
                      min={auction.currentHighestBid + 1}
                    />
                    <button
                      onClick={handleBid}
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Placing..." : "Place Bid"}
                    </button>
                  </div>
                </>
              )}
              {error && <p className="error-text">{error}</p>}
              {success && <p className="success-text">{success}</p>}
            </div>
          )}

          {!isClosed &&
            user &&
            auction.createdBy?._id === user._id && (
              <button
                onClick={handleClose}
                className="btn btn-danger"
                style={{ marginTop: "1rem" }}
              >
                Close Auction Early
              </button>
            )}
        </div>

        <div className="bid-history-card">
          <h3>Bid History</h3>
          {bids.length === 0 ? (
            <p className="no-bids">No bids yet. Be the first!</p>
          ) : (
            <ul className="bid-list">
              {bids.map((bid, idx) => (
                <li key={bid._id} className={`bid-item ${idx === 0 ? "top-bid" : ""}`}>
                  <div className="bid-info">
                    <span className="bidder-name">
                      {idx === 0 && "👑 "}
                      {bid.bidderId?.name || "Anonymous"}
                    </span>
                    <span className="bid-time">
                      {new Date(bid.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className="bid-amount">₹{bid.bidAmount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;

