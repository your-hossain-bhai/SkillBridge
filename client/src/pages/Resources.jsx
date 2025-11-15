import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import Tag from '../components/Tag';
import SkillPill from '../components/SkillPill';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    platform: '',
    costType: '',
    skill: ''
  });

  useEffect(() => {
    fetchResources();
  }, [search, filters]);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.costType) params.append('costType', filters.costType);
      if (filters.skill) params.append('skill', filters.skill);

      const response = await axios.get(`${API_URL}/api/resources?${params}`);
      setResources(response.data.resources || []);
    } catch (error) {
      console.error('Fetch resources error:', error);
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
      <h1 className="text-3xl font-bold mb-6">Learning Resources</h1>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search resources..." />
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            value={filters.platform}
            onChange={(e) => handleFilterChange('platform', e.target.value)}
            placeholder="Filter by platform..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={filters.costType}
            onChange={(e) => handleFilterChange('costType', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Costs</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
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

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <Card key={resource._id}>
              <div className="h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={resource.imageUrl || 'https://via.placeholder.com/300x200?text=Learning+Resource'} 
                  alt={resource.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Learning+Resource';
                  }}
                />
              </div>
              <div className="mb-2">
                <Tag variant="default">{resource.platform}</Tag>
              </div>
              <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {resource.relatedSkills.slice(0, 3).map((skill) => (
                  <SkillPill key={skill} skill={skill} />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <Tag variant={resource.costType === 'Free' ? 'success' : 'primary'}>
                  {resource.costType === 'Free' ? 'Free' : `$${resource.price}`}
                </Tag>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline text-sm"
                >
                  Visit →
                </a>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <p className="text-gray-500 text-center py-8">No resources found. Try adjusting your filters.</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;

