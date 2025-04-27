// src/components/PatientProfile.jsx
import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'patientProfile';

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
  });

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (err) {
      console.error('PatientProfile: error reading storage', err);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setProfile(form);
    } catch (err) {
      console.error('PatientProfile: error saving', err);
    }
  };

  // ENTRY FORM
  if (!profile) {
    return (
      <div className="card mb-4 radius-8 border-0 shadow-sm">
        <div className="card-header bg-base py-3 px-4">
          <h5 className="mb-0 fw-bold">Enter Patient Details</h5>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="form-control radius-8"
              />
            </div>
            <div className="row g-3">
              <div className="col">
                <label htmlFor="age" className="form-label fw-semibold">
                  Age (yrs)
                </label>
                <input
                  id="age"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  type="number"
                  required
                  className="form-control radius-8"
                />
              </div>
              <div className="col">
                <label htmlFor="weight" className="form-label fw-semibold">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  type="number"
                  required
                  className="form-control radius-8"
                />
              </div>
              <div className="col">
                <label htmlFor="height" className="form-label fw-semibold">
                  Height (cm)
                </label>
                <input
                  id="height"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  type="number"
                  required
                  className="form-control radius-8"
                />
              </div>
            </div>
            <div className="mt-4 text-end">
              <button type="submit" className="btn btn-primary radius-8 px-4">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // PROFILE DISPLAY
  return (
    <div className="card mb-4 radius-8 border-0 shadow-sm">
      <div className="card-header bg-base py-3 px-4 d-flex align-items-center justify-content-between">
        <h5 className="mb-0 fw-bold">Current Patient</h5>
      </div>
      <div className="card-body p-4">
        <div className="row text-secondary-light">
          <div className="col-6 mb-3">
            <span className="d-block text-sm">Name</span>
            <strong className="text-md">{profile.name}</strong>
          </div>
          <div className="col-3 mb-3">
            <span className="d-block text-sm">Age</span>
            <strong className="text-md">{profile.age} yrs</strong>
          </div>
          <div className="col-3 mb-3">
            <span className="d-block text-sm">Height</span>
            <strong className="text-md">{profile.height} cm</strong>
          </div>
          <div className="col-6">
            <span className="d-block text-sm">Weight</span>
            <strong className="text-md">{profile.weight} kg</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;