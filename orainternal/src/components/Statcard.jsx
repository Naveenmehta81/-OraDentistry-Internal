export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendUp,
  icon,
  colorClass = "bg-indigo-50 text-indigo-600",
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
        <div className="h-8 bg-gray-100 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value ?? "—"}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}
          >
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={`text-xs font-medium ${
              trendUp ? "text-green-600" : "text-red-500"
            }`}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
          <span className="text-xs text-gray-400">vs last 30 days</span>
        </div>
      )}
    </div>
  );
}
