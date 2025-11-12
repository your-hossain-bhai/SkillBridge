const SkillPill = ({ skill, onRemove, removable = false }) => {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
      {skill}
      {removable && onRemove && (
        <button
          onClick={() => onRemove(skill)}
          className="ml-1 text-blue-600 hover:text-blue-800"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillPill;

