import React from "react";

const CountdownTimer = ({ endTime, status }) => {
  const [timeLeft, setTimeLeft] = React.useState("");
  const [isExpired, setIsExpired] = React.useState(false);

  React.useEffect(() => {
    if (status === "CLOSED") {
      setTimeLeft("Auction Ended");
      setIsExpired(true);
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Auction Ended");
        setIsExpired(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let display = "";
      if (days > 0) display += `${days}d `;
      if (hours > 0 || days > 0) display += `${hours}h `;
      display += `${minutes}m ${seconds}s`;

      setTimeLeft(display);
      setIsExpired(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime, status]);

  return (
    <div className={`countdown ${isExpired ? "expired" : "active"}`}>
      <span className="countdown-icon">{isExpired ? "🔴" : "🟢"}</span>
      <span className="countdown-text">{timeLeft}</span>
    </div>
  );
};

export default CountdownTimer;
