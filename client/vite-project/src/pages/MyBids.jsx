import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBids } from "../services/api";
import { useAuth } from "../context/AuthContext";

const MyBids = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const data = await getMyBids();
        setBids(data);
      } catch (err) {
        console.error("Error fetching bids:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBids();
  }, [user]);

  if (loading)
    return (
      <div className="page-container">
        <p>Loading your bids...</p>
      </div>
    );

  const getStatus = (bid) => {
    const auction = bid.auctionId;
    if (!auction) return { label: "Deleted", className: "closed" };

    if (auction.status === "CLOSED") {
      const isWinner =
        auction.currentHighestBidder?._id === user._id ||
        auction.currentHighestBidder === user._id;
      return isWinner
        ? { label: "WON 🏆", className: "won" }
        : { label: "LOST", className: "closed" };
    }
    return { label: "ACTIVE", className: "active" };
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>My Bids</h2>
        <span className="text-muted">{bids.length} total bids</span>
      </div>

      {bids.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any bids yet.</p>
          <Link to="/" className="btn btn-primary">
            Browse Auctions
          </Link>
        </div>
      ) : (
        <div className="my-bids-list">
          {bids.map((bid) => {
            const status = getStatus(bid);
            return (
              <Link
                to={bid.auctionId ? `/auction/${bid.auctionId._id}` : "#"}
                key={bid._id}
                className="my-bid-card"
              >
                <div className="my-bid-info">
                  <h4>{bid.auctionId?.title || "Auction Deleted"}</h4>
                  <span className="bid-time-small">
                    {new Date(bid.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="my-bid-right">
                  <span className="bid-amount-lg">₹{bid.bidAmount}</span>
                  <span className={`status-badge ${status.className}`}>
                    {status.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBids;
