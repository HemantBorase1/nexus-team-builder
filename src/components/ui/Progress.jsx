export default function Progress({ value = 0, className = "", color = "bg-blue-600" }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full h-3 rounded-full bg-gray-100 overflow-hidden ${className}`}>
      <div className={`h-full ${color}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}


