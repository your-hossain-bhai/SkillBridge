import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Card from './Card';
import Tag from './Tag';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const SkillGapAnalysis = () => {
  const { token } = useAuth();
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGapAnalysis();
  }, []);

  const fetchGapAnalysis = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/learning/recommendations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGapAnalysis(response.data.gapAnalysis);
    } catch (error) {
      console.error('Fetch gap analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Card><div>Loading skill gap analysis...</div></Card>;
  }

  if (!gapAnalysis || !gapAnalysis.missingSkills || gapAnalysis.missingSkills.length === 0) {
    return (
      <Card>
        <h3 className="text-xl font-semibold mb-2">Skill Gap Analysis</h3>
        <p className="text-gray-600">Great! You have all the skills needed for recommended jobs. Keep learning!</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Skill Gap Analysis</h3>
      
      <div className="space-y-4">
        {/* Missing Skills */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            Missing Skills ({gapAnalysis.gapCount})
          </h4>
          <div className="flex flex-wrap gap-2">
            {gapAnalysis.missingSkills.map((skill, index) => (
              <Tag key={index} variant="warning">{skill}</Tag>
            ))}
          </div>
        </div>

        {/* Priority Skills */}
        {gapAnalysis.prioritySkills && gapAnalysis.prioritySkills.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Priority Skills to Learn</h4>
            <div className="flex flex-wrap gap-2">
              {gapAnalysis.prioritySkills.map((skill, index) => (
                <Tag key={index} variant="primary">{skill}</Tag>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Resources */}
        {gapAnalysis.recommendations && gapAnalysis.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Recommended Learning Resources</h4>
            <div className="space-y-3">
              {gapAnalysis.recommendations.slice(0, 5).map((resource, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-semibold">{resource.title}</h5>
                      <p className="text-sm text-gray-600">{resource.platform}</p>
                    </div>
                    <Tag variant={resource.costType === 'Free' ? 'success' : 'primary'}>
                      {resource.costType === 'Free' ? 'Free' : `$${resource.price}`}
                    </Tag>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{resource.description}</p>
                  {resource.matchedSkills && resource.matchedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {resource.matchedSkills.map((skill, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Visit Resource →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SkillGapAnalysis;

