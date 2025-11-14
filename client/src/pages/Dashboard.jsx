import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Card from '../components/Card';
import Tag from '../components/Tag';
import ProgressBar from '../components/ProgressBar';
import SkillPill from '../components/SkillPill';
import SkillGapAnalysis from '../components/SkillGapAnalysis';
import RoadmapViewer from '../components/RoadmapViewer';
import CareerBot from '../components/CareerBot';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [recommendations, setRecommendations] = useState({ recommendedJobs: [], recommendedResources: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/dashboard/recommendations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Fetch recommendations error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, {user?.fullName || 'User'}!
      </h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">12</div>
            <div className="text-sm text-gray-600 mt-1">Courses Completed</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">7</div>
            <div className="text-sm text-gray-600 mt-1">Current Streak</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{user?.experienceLevel || 'Fresher'}</div>
            <div className="text-sm text-gray-600 mt-1">Skill Level</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">5</div>
            <div className="text-sm text-gray-600 mt-1">Badges Earned</div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Recommended Jobs */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Recommended Jobs</h2>
          <div className="space-y-4">
            {recommendations.recommendedJobs.length > 0 ? (
              recommendations.recommendedJobs.map((job) => (
                <Card key={job._id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-gray-600">{job.company} • {job.location}</p>
                    </div>
                    <Tag variant="info">{job.jobType}</Tag>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                  {job.matchPercentage !== undefined && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">Match Score</span>
                        <span className="text-sm font-bold text-purple-600">{job.matchPercentage}%</span>
                      </div>
                      <ProgressBar percentage={job.matchPercentage} />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.matchedSkills?.slice(0, 3).map((skill) => (
                      <SkillPill key={skill} skill={skill} />
                    ))}
                  </div>
                  <p className="text-xs text-green-600 font-medium">{job.reason}</p>
                </Card>
              ))
            ) : (
              <Card>
                <p className="text-gray-500">No job recommendations yet. Complete your profile to get personalized matches!</p>
              </Card>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Skill Progress */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Skill Progress</h3>
            <div className="space-y-4">
              <ProgressBar label="JavaScript" percentage={75} />
              <ProgressBar label="React" percentage={60} />
              <ProgressBar label="Node.js" percentage={50} />
              <ProgressBar label="MongoDB" percentage={40} />
            </div>
          </Card>

          {/* Recent Badges */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Badges</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <span className="text-sm">First Job Applied</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <span className="text-sm">Course Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="text-sm">Profile Complete</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-sm">
                Update Profile
              </button>
              <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-sm">
                Browse Jobs
              </button>
              <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition text-sm">
                Explore Resources
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recommended Learning */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recommended Learning</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {recommendations.recommendedResources.slice(0, 3).map((resource) => (
            <Card key={resource._id}>
              <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-3"></div>
              <h3 className="font-semibold mb-1">{resource.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{resource.platform}</p>
              <div className="flex justify-between items-center">
                <Tag variant={resource.costType === 'Free' ? 'success' : 'primary'}>
                  {resource.costType === 'Free' ? 'Free' : `$${resource.price}`}
                </Tag>
                <p className="text-xs text-green-600">{resource.reason}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="mt-8">
        <SkillGapAnalysis />
      </div>

      {/* Career Roadmap */}
      <div className="mt-8">
        <RoadmapViewer />
      </div>

      {/* CareerBot */}
      <div className="mt-8">
        <CareerBot />
      </div>
    </div>
  );
};

export default Dashboard;

