import { useEffect, useState } from "react";
import { getAllAuctions } from "../services/api";
import { Link } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL, ACTIVE, CLOSED
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await getAllAuctions();
        setAuctions(data);
      } catch (err) {
        console.error("Error fetching auctions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const filtered =
    filter === "ALL"
      ? auctions
      : auctions.filter((a) => a.status === filter);

  if (loading) return <div className="page-container"><p>Loading auctions...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Listed Auctions</h2>

        <div className="filter-tabs">
          {["ALL", "ACTIVE", "CLOSED"].map((f) => (
            <button
              key={f}
              className={`tab-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>No auctions found</p>
          <Link to="/create" className="btn btn-primary">
            Create one now
          </Link>
        </div>
      )}

      <div className="auction-grid">
        {filtered.map((auction) => (
          <Link
            to={`/auction/${auction._id}`}
            key={auction._id}
            className="auction-card"
          >
            <div className="auction-card-header">
              <h3>{auction.title}</h3>
              <span className={`status-badge ${auction.status.toLowerCase()}`}>
                {auction.status}
              </span>
            </div>
            <p className="auction-desc">{auction.description}</p>
            <div className="auction-card-info">
              <div className="info-item">
                <span className="label">Base Price</span>
                <span className="value">₹{auction.basePrice}</span>
              </div>
              <div className="info-item">
                <span className="label">Highest Bid</span>
                <span className="value highlight">
                  ₹{auction.currentHighestBid}
                </span>
              </div>
            </div>
            <CountdownTimer endTime={auction.endTime} status={auction.status} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AuctionList;