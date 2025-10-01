import { useState } from "react";
import "./BookFilters.css";

export default function BookFilters({ onFilterChange }) {
  const [year, setYear] = useState("");
  const [availability, setAvailability] = useState("");

  const handleFilterChange = () => {
    onFilterChange({ year, availability });
  };

  return (
    <div className="book-filters">
      {/* First Published Year Range */}
      <div className="filter-section">
        <label className="filter-label">Published Year</label>
        <input
          type="range"
          min="1800"
          max="2025"
          step="1"
          className="year-range"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <span className="year-text">Year: {year}</span>
      </div>

      {/* Availability */}
      <div className="filter-section">
        <label className="filter-label">Availability</label>
        <select
          className="availability-select"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="">All</option>
          <option value="public">Public</option>
          <option value="private">Not Public</option>
        </select>
      </div>

      {/* Apply */}
      <div className="filter-apply">
        <button onClick={handleFilterChange} className="apply-btn">
          Apply
        </button>
      </div>
    </div>
  );
}
