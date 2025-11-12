const Tag = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-purple-100 text-purple-700',
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700'
  };

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Tag;

