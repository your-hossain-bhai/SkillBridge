import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Card from '../components/Card';
import SkillPill from '../components/SkillPill';
import SkillExtractor from '../components/SkillExtractor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Profile = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    education: '',
    department: '',
    experienceLevel: 'Fresher',
    preferredTrack: '',
    skills: [],
    cvText: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        education: response.data.education || '',
        department: response.data.department || '',
        experienceLevel: response.data.experienceLevel || 'Fresher',
        preferredTrack: response.data.preferredTrack || '',
        skills: response.data.skills || [],
        cvText: response.data.cvText || ''
      });
    } catch (error) {
      console.error('Fetch profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await axios.put(`${API_URL}/api/users/me`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile saved successfully!');
    } catch (error) {
      setMessage('Error saving profile: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      {/* Skill Extractor Section */}
      <div className="mb-6">
        <SkillExtractor onSkillsExtracted={(skills) => {
          setFormData(prev => ({ ...prev, skills }));
        }} />
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Education Level
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="e.g., Bachelor's in Computer Science"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Engineering"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="Fresher">Fresher</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Career Track
            </label>
            <select
              name="preferredTrack"
              value={formData.preferredTrack}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a track...</option>
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Backend Development">Backend Development</option>
              <option value="Data Science">Data Science</option>
              <option value="DevOps">DevOps</option>
              <option value="UI/UX Design">UI/UX Design</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Add skill"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <SkillPill
                  key={skill}
                  skill={skill}
                  removable
                  onRemove={handleRemoveSkill}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CV / Notes for AI Analysis (Part-2)
            </label>
            <textarea
              name="cvText"
              value={formData.cvText}
              onChange={handleChange}
              rows={6}
              placeholder="Paste your CV text or notes here. This will be used for AI-powered career recommendations in the next phase."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be used for AI-powered career recommendations in the next phase.
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;

