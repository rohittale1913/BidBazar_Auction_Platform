import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAuction } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const CreateAuction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    basePrice: "",
    duration: 60, // default 60 minutes
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.basePrice) {
      setError("Please fill in all fields");
      return;
    }

    if (Number(form.basePrice) <= 0) {
      setError("Base price must be greater than 0");
      return;
    }

    if (!user) {
      setError("Please login first");
      return;
    }

    setLoading(true);
    try {
      const endTime = new Date(
        Date.now() + Number(form.duration) * 60 * 1000
      ).toISOString();

      await createAuction({
        title: form.title,
        description: form.description,
        basePrice: Number(form.basePrice),
        endTime,
      });

      addToast("Auction created successfully!", "success");
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to create auction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="create-auction-card">
        <h2>Create New Auction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Vintage Watch"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the item..."
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Base Price (₹)</label>
              <input
                type="number"
                name="basePrice"
                value={form.basePrice}
                onChange={handleChange}
                placeholder="500"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <select
                name="duration"
                value={form.duration}
                onChange={handleChange}
              >
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={1440}>1 day</option>
              </select>
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Auction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;
