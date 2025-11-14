import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Card from './Card';
import SkillPill from './SkillPill';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const SkillExtractor = ({ onSkillsExtracted }) => {
  const { token } = useAuth();
  const [cvText, setCvText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a PDF or TXT file');
        setFile(null);
      }
    }
  };

  const handleExtract = async () => {
    if (!cvText.trim() && !file) {
      setError('Please provide CV text or upload a file');
      return;
    }

    setLoading(true);
    setError('');
    setExtractedData(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('cvFile', file);
      }
      if (cvText.trim()) {
        formData.append('cvText', cvText);
      }

      const response = await axios.post(`${API_URL}/api/skills/extract`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setExtractedData(response.data.data);
      
      // Callback to update parent component
      if (onSkillsExtracted) {
        onSkillsExtracted(response.data.data.skills);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to extract skills');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSkills = async () => {
    if (!extractedData?.skills || extractedData.skills.length === 0) {
      setError('No skills to update');
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/skills/update`,
        { skills: extractedData.skills },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('Skills updated successfully!');
      if (onSkillsExtracted) {
        onSkillsExtracted(extractedData.skills);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update skills');
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Extract Skills from CV</h3>
      
      <div className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CV (PDF or TXT)
          </label>
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Or Text Input */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste CV Text
          </label>
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            rows={6}
            placeholder="Paste your CV/resume text here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleExtract}
          disabled={loading}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold disabled:opacity-50"
        >
          {loading ? 'Extracting Skills...' : 'Extract Skills'}
        </button>

        {/* Extracted Results */}
        {extractedData && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Extracted Skills:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {extractedData.skills.map((skill, index) => (
                <SkillPill key={index} skill={skill} />
              ))}
            </div>
            
            {extractedData.experienceLevel && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Experience Level:</strong> {extractedData.experienceLevel}
              </p>
            )}
            
            {extractedData.relevantRoles && extractedData.relevantRoles.length > 0 && (
              <p className="text-sm text-gray-600 mb-4">
                <strong>Relevant Roles:</strong> {extractedData.relevantRoles.join(', ')}
              </p>
            )}

            <button
              onClick={handleUpdateSkills}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              Update My Skills
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SkillExtractor;

