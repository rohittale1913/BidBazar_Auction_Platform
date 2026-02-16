import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../services/api";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaderboard();
        setLeaders(data);
      } catch (err) {
        console.error("Leaderboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="page-container">
        <p>Loading leaderboard...</p>
      </div>
    );

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>🏆 Leaderboard</h2>
        <span className="text-muted">Top Bidders</span>
      </div>

      {leaders.length === 0 ? (
        <div className="empty-state">
          <p>No leaderboard data yet. Start bidding!</p>
        </div>
      ) : (
        <div className="leaderboard-table-wrap">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Bidder</th>
                <th>Auctions Won</th>
                <th>Items Won</th>
                <th>Total Bids</th>
                <th>Win Amount</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((entry, idx) => (
                <tr key={entry.user?._id || idx} className={idx < 3 ? "top-row" : ""}>
                  <td className="rank-cell">
                    <span className={`rank ${idx < 3 ? "top" : ""}`}>
                      {getMedal(idx)}
                    </span>
                  </td>
                  <td>
                    <div className="leader-info">
                      <span className="leader-name">{entry.user?.name || "Unknown"}</span>
                      <span className="leader-email">{entry.user?.email || ""}</span>
                    </div>
                  </td>
                  <td className="center-cell">
                    <span className="wins-badge">{entry.wins}</span>
                  </td>
                  <td className="won-items-cell">
                    {entry.wonItems && entry.wonItems.length > 0 ? (
                      <ul className="won-items-list">
                        {entry.wonItems.map((item, i) => (
                          <li key={i}>
                            <span className="won-item-title">{item.title}</span>
                            <span className="won-item-amount"> (₹{item.amount.toLocaleString()})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="center-cell">{entry.totalBids}</td>
                  <td className="amount-cell">₹{entry.totalWinAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
