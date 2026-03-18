// src/pages/Users.jsx
import { useState } from 'react';

export default function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Jenkins",
      email: "sarah@clinic.com",
      role: "Clinic",
      location: "Downtown Branch",
      status: "Active",
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialFormState = { name: '', email: '', role: 'Clinic', location: '', status: 'Active' };
  const [formData, setFormData] = useState(initialFormState);
  
  // NEW: Track if we are editing an existing user
  const [editingUserId, setEditingUserId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open modal for a NEW user
  const handleOpenAdd = () => {
    setFormData(initialFormState); // Clear form
    setEditingUserId(null);        // Ensure we aren't in "edit" mode
    setIsModalOpen(true);
  };

  // NEW: Open modal and pre-fill data for an EXISTING user
  const handleOpenEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      status: user.status
    });
    setEditingUserId(user.id); // Tell the app which user we are editing
    setIsModalOpen(true);
  };

  // COMBINED: Handle saving (both Add and Edit)
  const handleSaveUser = (e) => {
    e.preventDefault();
    
    if (editingUserId) {
      // If we have an ID, update that specific user in the array
      setUsers(users.map(user => 
        user.id === editingUserId ? { ...user, ...formData } : user
      ));
    } else {
      // If no ID, create a brand new user
      const newUser = { id: Date.now(), ...formData };
      setUsers([...users, newUser]);
    }
    
    setIsModalOpen(false);
    setFormData(initialFormState);
    setEditingUserId(null); // Reset back to default
  };

  // NEW: Toggle a user's status directly
  const handleToggleSuspend = (id) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        // Flip between Suspended and Active
        const newStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  return (
    <div className="select-none cursor-default space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button 
          onClick={handleOpenAdd}
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
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
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-gray-500">{user.email}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'Clinic' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">{user.location}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 
                    user.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 space-x-3">
                  {/* EDIT BUTTON */}
                  <button 
                    onClick={() => handleOpenEdit(user)}
                    className="cursor-pointer text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  {/* SUSPEND BUTTON */}
                  <button 
                    onClick={() => handleToggleSuspend(user.id)}
                    className={`cursor-pointer hover:underline ${
                      user.status === 'Suspended' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {user.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ADD / EDIT USER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            {/* Dynamic Title */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingUserId ? 'Edit User' : 'Add New User'}
            </h3>
            
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" required name="name"
                  value={formData.name} onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" required name="email"
                  value={formData.email} onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select 
                    name="role" value={formData.role} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Clinic">Clinic</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    name="status" value={formData.status} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" required name="location"
                  value={formData.location} onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); setEditingUserId(null); }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  {editingUserId ? 'Save Changes' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}