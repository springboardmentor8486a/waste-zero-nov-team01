// src/components/Badge.jsx
export default function Badge({ status, children, className = "" }) {
  const colors = {
    Open: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
    Closed: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800'} ${className}`}>
      {children || status}
    </span>
  );
}