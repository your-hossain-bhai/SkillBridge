import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky-500 to-teal-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Your Path
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-sky-50">
            Connect your skills with opportunities and unlock your career potential
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-teal-600 rounded-lg font-semibold transition"
            >
              Explore Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                AI-powered job and resource recommendations based on your skills
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Learning Resources</h3>
              <p className="text-gray-600">
                Curated courses and resources to help you grow your skills
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
              <p className="text-gray-600">
                Track your progress and discover new opportunities
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

