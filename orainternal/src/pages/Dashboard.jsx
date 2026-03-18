export default function Dashboard() {
  return (
    <div className="select-none cursor-default space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Analytics & Reporting
        </h2>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700">
          Download Report (PDF/CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Open Cases</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">142</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">TAT Compliance</p>
          <p className="text-3xl font-bold text-green-600 mt-2">94%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Revision Rate</p>
          <p className="text-3xl font-bold text-orange-500 mt-2">8.5%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          F<p className="text-sm text-gray-500">Active Users</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">56</p>
        </div>
      </div>

      {/* Placeholder for Charts */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center">
        <p className="text-gray-400">
          Chart Area (Case Volume by Clinic over Time)
        </p>
      </div>
    </div>
  );
}
