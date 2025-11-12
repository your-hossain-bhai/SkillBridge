import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import Tag from '../components/Tag';
import SkillPill from '../components/SkillPill';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [id]);

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
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold">
            Apply Now
          </button>
        </div>
      </Card>
    </div>
  );
};

export default JobDetails;

