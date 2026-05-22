import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineLogout } from 'react-icons/hi';
import { showToast } from '@/helper/showToast';
import { setUser } from '../redux/user/user.slice'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: userData } = useSelector((state) => state.root.user);

  const [activeTab, setActiveTab] = useState('security');
  const [loading, setLoading] = useState(false);

  // Password Form State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Handle Password Changes
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      return showToast("error", "New passwords do not match!");
    }

    // ... upper code state properties stay identical
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/update-password/${userData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword
        })
      });

      // 👇 Robust Defensive Layer: Catch HTML/404/500 errors gracefully before .json() executes
      if (!res.ok) {
        const errorText = await res.text();
        let parsedMessage = "An error occurred updating security settings.";
        try {
          const parsedError = JSON.parse(errorText);
          parsedMessage = parsedError.message;
        } catch (e) {
          // Fallback if response is raw HTML text string layout from server crash
          if (res.status === 404) parsedMessage = "Server route path endpoint not found (404).";
        }
        return showToast("error", parsedMessage);
      }

      const data = await res.json();
      if (data.success) {
        showToast("success", "Password updated successfully!");
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Network connection tracking error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout Event
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out of your console workspace?")) return;

    try {
      // Clear client-side stores
      localStorage.removeItem('token');
      localStorage.removeItem('userToken');
      localStorage.removeItem('adminToken');
      dispatch(setUser(null));

      showToast("success", "Logged out successfully");
      navigate('/login');
    } catch (error) {
      showToast("error", "Failed to log out cleanly.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">

      {/* Title Header Block */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage your system credentials, privacy, and active workspace preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

        {/* Settings Tab Navigation Column */}
        <div className="md:col-span-1 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'security'
                ? 'bg-purple-50 text-purple-600'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
          >
            <HiOutlineLockClosed className="text-lg" /> Security
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 hover:bg-slate-50 text-left"
          >
            <HiOutlineUser className="text-lg" /> Edit Profile
          </button>

          <hr className="border-slate-100 my-2" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 text-left transition-colors"
          >
            <HiOutlineLogout className="text-lg" /> Log Out
          </button>
        </div>

        {/* Dynamic Workspace Container Section */}
        <div className="md:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Update Password</h3>
                <p className="text-xs text-slate-400 mt-0.5">Ensure your account is using a long, random password to stay secure.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-slate-700 text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <hr className="border-slate-100/70 my-2" />

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-slate-700 text-sm"
                    placeholder="Minimum 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-slate-700 text-sm"
                    placeholder="Repeat your new password"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-purple-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-purple-700 shadow-md shadow-purple-100 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  {loading ? 'Saving Layout...' : 'Save New Password'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Settings;