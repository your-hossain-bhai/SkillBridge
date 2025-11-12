import Card from '../components/Card';

const AILab = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Lab</h1>
      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-gray-600">
            This section is reserved for Part 2 of the SkillBridge project.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            AI-powered features including resume parsing, advanced job matching, and personalized recommendations will be available here.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AILab;

