// src/components/Button.jsx
export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}) {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-400 hover:bg-yellow-500 text-black",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  return (
    <button
      className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        styles[variant] || ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}