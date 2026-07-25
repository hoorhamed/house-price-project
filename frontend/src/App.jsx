import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    location: '',
    carpet_area_sqft: '',
    floor_num: '',
    bathroom: '',
    balcony: '',
    furnishing: 'Furnished',
    transaction: 'Resale',
    ownership: 'Freehold',
    facing: 'East'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/predict`,
        {
          ...formData,
          carpet_area_sqft: parseFloat(formData.carpet_area_sqft),
          floor_num: parseInt(formData.floor_num),
          bathroom: parseInt(formData.bathroom),
          balcony: parseInt(formData.balcony)
        }
      );
      setPrediction(response.data.predicted_price);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🏠 House Price Predictor</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
              required
            />
          </div>

          <div className="form-group">
            <label>Carpet Area (sqft)</label>
            <input
              type="number"
              name="carpet_area_sqft"
              value={formData.carpet_area_sqft}
              onChange={handleChange}
              placeholder="e.g. 1200"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Floor Number</label>
            <input
              type="number"
              name="floor_num"
              value={formData.floor_num}
              onChange={handleChange}
              placeholder="e.g. 3"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Bathrooms</label>
            <input
              type="number"
              name="bathroom"
              value={formData.bathroom}
              onChange={handleChange}
              placeholder="e.g. 2"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Balconies</label>
            <input
              type="number"
              name="balcony"
              value={formData.balcony}
              onChange={handleChange}
              placeholder="e.g. 1"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Furnishing</label>
            <select
              name="furnishing"
              value={formData.furnishing}
              onChange={handleChange}
            >
              <option value="Furnished">Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          <div className="form-group">
            <label>Transaction</label>
            <select
              name="transaction"
              value={formData.transaction}
              onChange={handleChange}
            >
              <option value="New Property">New Property</option>
              <option value="Resale">Resale</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ownership</label>
            <input
              type="text"
              name="ownership"
              value={formData.ownership}
              onChange={handleChange}
              placeholder="e.g. Freehold"
              required
            />
          </div>

          <div className="form-group">
            <label>Facing</label>
            <input
              type="text"
              name="facing"
              value={formData.facing}
              onChange={handleChange}
              placeholder="e.g. East"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Price'}
        </button>
      </form>

      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}

      {prediction && (
        <div className="result">
          <h2>💰 Predicted Price</h2>
          <p className="price">
            ₹ {prediction.toLocaleString('en-IN')}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;