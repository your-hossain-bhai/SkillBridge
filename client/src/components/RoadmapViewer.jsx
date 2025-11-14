import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Card from './Card';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const RoadmapViewer = ({ roadmap, onGenerate }) => {
  const { token } = useAuth();
  const [currentRoadmap, setCurrentRoadmap] = useState(roadmap);
  const [loading, setLoading] = useState(!roadmap);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    targetRole: '',
    timeframe: '3 months',
    learningHoursPerWeek: 10
  });

  useEffect(() => {
    if (!roadmap) {
      fetchCurrentRoadmap();
    }
  }, []);

  const fetchCurrentRoadmap = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/roadmap/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentRoadmap(response.data.roadmap);
    } catch (error) {
      // No roadmap found, that's okay
      setCurrentRoadmap(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.targetRole) {
      alert('Please enter a target role');
      return;
    }

    setGenerating(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/roadmap/generate`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCurrentRoadmap(response.data.roadmap);
      if (onGenerate) {
        onGenerate(response.data.roadmap);
      }
      setFormData({ targetRole: '', timeframe: '3 months', learningHoursPerWeek: 10 });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <Card><div>Loading roadmap...</div></Card>;
  }

  if (!currentRoadmap) {
    return (
      <Card>
        <h3 className="text-xl font-semibold mb-4">Career Roadmap</h3>
        <p className="text-gray-600 mb-4">Generate a personalized career roadmap to guide your learning journey.</p>
        
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Role
            </label>
            <input
              type="text"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              placeholder="e.g., Full Stack Developer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timeframe
            </label>
            <select
              value={formData.timeframe}
              onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Learning Hours per Week
            </label>
            <input
              type="number"
              value={formData.learningHoursPerWeek}
              onChange={(e) => setFormData({ ...formData, learningHoursPerWeek: parseInt(e.target.value) })}
              min="1"
              max="40"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold disabled:opacity-50"
          >
            {generating ? 'Generating Roadmap...' : 'Generate Roadmap'}
          </button>
        </form>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold">Career Roadmap</h3>
          <p className="text-sm text-gray-600">
            {currentRoadmap.targetRole} • {currentRoadmap.timeframe}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">{currentRoadmap.progress}%</div>
          <div className="text-xs text-gray-600">Progress</div>
        </div>
      </div>

      <div className="space-y-6">
        {currentRoadmap.phases.map((phase, index) => (
          <div
            key={phase.phaseNumber}
            className={`p-4 rounded-lg border-2 ${
              index < currentRoadmap.currentPhase
                ? 'bg-green-50 border-green-200'
                : index === currentRoadmap.currentPhase - 1
                ? 'bg-blue-50 border-blue-300'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-purple-600">Phase {phase.phaseNumber}</span>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm font-medium">{phase.duration}</span>
              {index < currentRoadmap.currentPhase - 1 && (
                <span className="ml-auto text-green-600 text-sm">✓ Completed</span>
              )}
              {index === currentRoadmap.currentPhase - 1 && (
                <span className="ml-auto text-blue-600 text-sm font-medium">Current Phase</span>
              )}
            </div>
            
            <h4 className="font-semibold text-lg mb-3">{phase.title}</h4>

            {phase.topics && phase.topics.length > 0 && (
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Topics:</div>
                <div className="flex flex-wrap gap-2">
                  {phase.topics.map((topic, i) => (
                    <span key={i} className="px-2 py-1 bg-white rounded text-sm border border-gray-200">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {phase.technologies && phase.technologies.length > 0 && (
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Technologies:</div>
                <div className="flex flex-wrap gap-2">
                  {phase.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {phase.projectIdeas && phase.projectIdeas.length > 0 && (
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Project Ideas:</div>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {phase.projectIdeas.map((project, i) => (
                    <li key={i}>{project}</li>
                  ))}
                </ul>
              </div>
            )}

            {phase.learningResources && phase.learningResources.length > 0 && (
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Learning Resources:</div>
                <div className="space-y-1">
                  {phase.learningResources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 hover:underline"
                    >
                      {resource.title} ({resource.type})
                    </a>
                  ))}
                </div>
              </div>
            )}

            {phase.milestones && phase.milestones.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Milestones:</div>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {phase.milestones.map((milestone, i) => (
                    <li key={i}>{milestone}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RoadmapViewer;

