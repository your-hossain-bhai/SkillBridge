import Card from '../components/Card';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <Card>
        <div className="space-y-4">
          <p className="text-gray-700">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div>
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-gray-600">contact@skillbridge.com</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <p className="text-gray-600">support@skillbridge.com</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Contact;

