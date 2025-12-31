// src/components/Badge.jsx
export default function Badge({ status, children, className = "" }) {
  const colors = {
    Open: "bg-green-100 text-green-800 border-green-200",
    Closed: "bg-red-100 text-red-800 border-red-200"
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'} ${className}`}>
      {children || status}
    </span>
  );
}