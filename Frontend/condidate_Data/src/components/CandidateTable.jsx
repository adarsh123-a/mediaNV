import { useState, useEffect } from 'react';
;

function CandidateTable() {
  const [candidates, setCandidates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    applied_position: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch('/api/candidates');
      const data = await response.json();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setCandidates(sortedData);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCandidate) {
        const response = await fetch(`/api/candidates/${editingCandidate.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          const updatedCandidate = await response.json();
          setCandidates(prev => {
            const updatedList = prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c);
            return updatedList.sort((a, b) => a.id - b.id);
          });
          setEditingCandidate(null);
          setShowForm(false);
          setFormData({
            name: '',
            age: '',
            email: '',
            phone: '',
            skills: '',
            experience: '',
            applied_position: '',
            status: 'pending'
          });
        }
      } else {
        const response = await fetch('/api/candidates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          const newCandidate = await response.json();
          setCandidates(prev => {
            const updatedList = [newCandidate, ...prev];
            return updatedList.sort((a, b) => a.id - b.id);
          });
          setShowForm(false);
          setFormData({
            name: '',
            age: '',
            email: '',
            phone: '',
            skills: '',
            experience: '',
            applied_position: '',
            status: 'pending'
          });
        }
      }
    } catch (error) {
      console.error('Error saving candidate:', error);
    }
  };

  const handleEdit = (candidate) => {
    setFormData({
      name: candidate.name,
      age: candidate.age,
      email: candidate.email,
      phone: candidate.phone,
      skills: candidate.skills,
      experience: candidate.experience,
      applied_position: candidate.applied_position,
      status: candidate.status
    });
    setEditingCandidate(candidate);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        const response = await fetch(`/api/candidates/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setCandidates(prev => prev.filter(c => c.id !== id));
        }
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCandidate(null);
    setFormData({
      name: '',
      age: '',
      email: '',
      phone: '',
      skills: '',
      experience: '',
      applied_position: '',
      status: 'pending'
    });
  };

  return (
    <div className="app">
      <h1>Candidate Management System</h1>
      
      <button className="add-btn" onClick={() => setShowForm(true)}>
        Add New Candidate
      </button>
      
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="age">Age:</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="skills">Skills:</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="experience">Experience (Years):</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="applied_position">Applied Position:</label>
                <input
                  type="text"
                  id="applied_position"
                  name="applied_position"
                  value={formData.applied_position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="pending">Pending</option>
                  <option value="interview">Interview</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit">{editingCandidate ? 'Update' : 'Add'}</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="table-container">
        <table className="candidate-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Skills</th>
              <th>Experience</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.id}</td>
                <td>{candidate.name}</td>
                <td>{candidate.age}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.skills}</td>
                <td>{candidate.experience}</td>
                <td>{candidate.applied_position}</td>
                <td>
                  <span className={`status ${candidate.status}`}>
                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                  </span>
                </td>
                <td>
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEdit(candidate)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(candidate.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {candidates.length === 0 && (
          <p className="no-data">No candidates found</p>
        )}
      </div>
    </div>
  );
}

export default CandidateTable;