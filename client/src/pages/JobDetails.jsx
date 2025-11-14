import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Card from '../components/Card';
import Tag from '../components/Tag';
import SkillPill from '../components/SkillPill';
import ProgressBar from '../components/ProgressBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const JobDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [job, setJob] = useState(null);
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMatch, setLoadingMatch] = useState(false);

  useEffect(() => {
    fetchJob();
    if (token) {
      fetchMatchDetails();
    }
  }, [id, token]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Fetch job error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchDetails = async () => {
    if (!token) return;
    setLoadingMatch(true);
    try {
      const response = await axios.get(`${API_URL}/api/jobs/${id}/match`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatchDetails(response.data);
    } catch (error) {
      console.error('Fetch match details error:', error);
    } finally {
      setLoadingMatch(false);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <p className="text-gray-500">Job not found.</p>
          <Link to="/jobs" className="text-purple-600 hover:underline mt-4 inline-block">
            Back to Jobs
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/jobs" className="text-purple-600 hover:underline mb-4 inline-block">
        ← Back to Jobs
      </Link>

      <Card>
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
            </div>
            <Tag variant="info">{job.jobType}</Tag>
          </div>

          {/* Match Information */}
          {matchDetails && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Your Match</h2>
                <div className="text-2xl font-bold text-purple-600">
                  {matchDetails.match.matchPercentage}%
                </div>
              </div>
              <ProgressBar 
                label="Match Score" 
                percentage={matchDetails.match.matchPercentage} 
              />
              <p className="text-sm text-gray-700 mt-2">{matchDetails.match.reason}</p>
              
              {matchDetails.match.matchedSkills && matchDetails.match.matchedSkills.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Matched Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {matchDetails.match.matchedSkills.map((skill) => (
                      <SkillPill key={skill} skill={skill} />
                    ))}
                  </div>
                </div>
              )}

              {matchDetails.match.missingSkills && matchDetails.match.missingSkills.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-orange-700 mb-1">Missing Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {matchDetails.match.missingSkills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => (
                <SkillPill key={skill} skill={skill} />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Recommended Experience</h2>
            <p className="text-gray-700">{job.recommendedExperience}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>

        <div className="pt-6 border-t">
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold">
              Apply Now
            </button>
            {job.externalLinks?.linkedin && (
              <a
                href={job.externalLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                View on LinkedIn
              </a>
            )}
            {job.externalLinks?.bdjobs && (
              <a
                href={job.externalLinks.bdjobs}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                View on BDJobs
              </a>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobDetails;

