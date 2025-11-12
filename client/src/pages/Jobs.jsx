import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import Tag from '../components/Tag';
import SkillPill from '../components/SkillPill';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    skill: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [search, filters]);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filters.location) params.append('location', filters.location);
      if (filters.jobType) params.append('jobType', filters.jobType);
      if (filters.skill) params.append('skill', filters.skill);

      const response = await axios.get(`${API_URL}/api/jobs?${params}`);
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Fetch jobs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Job Opportunities</h1>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search jobs..." />
        <div className="grid md:grid-cols-3 gap-4">
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="San Francisco">San Francisco</option>
            <option value="New York">New York</option>
            <option value="Austin">Austin</option>
          </select>
          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Job Types</option>
            <option value="Internship">Internship</option>
            <option value="Part-time">Part-time</option>
            <option value="Full-time">Full-time</option>
            <option value="Freelance">Freelance</option>
            <option value="Apprenticeship">Apprenticeship</option>
            <option value="Contract">Contract</option>
          </select>
          <input
            type="text"
            value={filters.skill}
            onChange={(e) => handleFilterChange('skill', e.target.value)}
            placeholder="Filter by skill..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job._id}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.company} • {job.location}</p>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.requiredSkills.slice(0, 5).map((skill) => (
                      <SkillPill key={skill} skill={skill} />
                    ))}
                  </div>
                </div>
                <div className="ml-4">
                  <Tag variant="info">{job.jobType}</Tag>
                </div>
              </div>
              <Link
                to={`/jobs/${job._id}`}
                className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
              >
                View Details
              </Link>
            </Card>
          ))
        ) : (
          <Card>
            <p className="text-gray-500 text-center py-8">No jobs found. Try adjusting your filters.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Jobs;

