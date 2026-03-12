// src/pages/Users.jsx
export default function Users() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Add New User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium text-gray-600">Name / Email</th>
              <th className="p-4 font-medium text-gray-600">Role</th>
              <th className="p-4 font-medium text-gray-600">Location</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {/* Sample Row */}
            <tr className="hover:bg-gray-50">
              <td className="p-4">
                <p className="font-medium text-gray-900">Dr. Sarah Jenkins</p>
                <p className="text-gray-500">sarah@clinic.com</p>
              </td>
              <td className="p-4">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                  Clinic
                </span>
              </td>
              <td className="p-4">Downtown Branch</td>
              <td className="p-4">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  Active
                </span>
              </td>
              <td className="p-4 space-x-3">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">
                  Suspend
                </button>
              </td>
            </tr>
            {/* Add more rows... */}
          </tbody>
        </table>
      </div>
    </div>
  );
}   
