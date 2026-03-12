// src/pages/Cases.jsx
export default function Cases() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Case Oversight</h2>

      {/* Filters */}
      <div className="flex space-x-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
          <option>All Statuses</option>
          <option>In Design</option>
          <option>Pending Review</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
          <option>All Designers</option>
          <option>Mike Ross</option>
        </select>
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* Cases List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Single Case Card */}
        <div className="border border-gray-100 rounded-lg p-4 flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Case #INV-8892</h3>
            <p className="text-sm text-gray-500 mt-1">
              Clinic: Uptown Dental • Designer: Mike Ross
            </p>
            <p className="text-xs text-orange-500 mt-2">
              Deadline: Today, 5:00 PM
            </p>
          </div>
          <div className="flex flex-col space-y-2 items-end">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
              In Design
            </span>
            <div className="space-x-2">
              <button className="text-xs text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50">
                View Timeline & Files
              </button>
              <button className="text-xs text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
                Reassign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
