import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import 'react-toastify/dist/ReactToastify.css';
import { FiUser, FiPhone, FiMail, FiEdit2, FiCheck } from 'react-icons/fi';
import { useContext } from 'react';
import { StoreContext } from '../Context/StoreContext';

const Profile = () => {
  const { backend_url, token } = useContext(StoreContext);
  const [profile, setProfile] = useState({
    businessName: '',
    phoneNumber: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(backend_url + '/api/profile', {
          headers: {
            Authorization: token
          }
        });

        console.log('bac',response.data.user);
        setCurrentUser(response.data.user);
        setProfile({
          businessName: response.data.user.name || '',
          phoneNumber: response.data.user.phoneNumber || '',
          email: response.data.user.email || ''
        });
      } catch (error) {
        handleError(error.response?.data?.message || 'Error fetching profile');
      }
    };
    
    fetchProfile();
  }, [backend_url, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profile.phoneNumber.match(/^[0-9]{10}$/)) {
      return handleError('Please enter a valid 10-digit phone number');
    }

    setLoading(true);
    try {
      const response = await axios.post(
        backend_url + '/api/manage-profile',
        {
          businessName: profile.businessName,
          phoneNumber: profile.phoneNumber
          // Don't send email as it shouldn't be changed
        },
        { headers: { Authorization: token } }
      );
      handleSuccess('Profile updated successfully!');
      setCurrentUser(response.data.user);
      setEditMode(false);
    } catch (error) {
      handleError(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark-gradient py-12 px-4 sm:px-6 lg:px-8 flex items-start justify-center">
      <div className="w-full max-w-[600px] mx-auto">
        <div className="bg-[#0F1927] border border-[rgba(14,165,233,0.1)] rounded-[20px] overflow-hidden p-10">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-24 w-24 rounded-full bg-[rgba(14,165,233,0.1)] border-2 border-[rgba(14,165,233,0.3)] flex items-center justify-center mb-4">
              <span className="text-[#0EA5E9] text-[2rem] font-bold">
                {currentUser?.name?.charAt(0)?.toUpperCase() || currentUser?.businessName?.charAt(0)?.toUpperCase() || <FiUser className="text-[#0EA5E9] text-3xl" />}
              </span>
            </div>
            <h1 className="text-[1.5rem] font-bold text-[#E2E8F0]">
              {currentUser?.businessName || currentUser?.name || 'Your Business'}
            </h1>
            <p className="text-[#94A3B8] mt-1">
              {currentUser?.email || 'user@example.com'}
            </p>
          </div>

          {/* Profile Content */}
          <div>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[rgba(14,165,233,0.1)]">
              <h2 className="text-lg font-bold text-[#E2E8F0]">Profile Information</h2>
              {!editMode && (
                <button 
                  onClick={() => setEditMode(true)}
                  className="flex items-center text-[#0EA5E9] hover:text-[#38BDF8] transition-colors font-medium text-sm"
                >
                  <FiEdit2 className="mr-1" /> Edit Profile
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">
                      Business Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiUser className="text-[#94A3B8]" />
                      </div>
                      <input
                        name="businessName"
                        value={profile.businessName}
                        onChange={handleChange}
                        className="pl-11 w-full px-4 py-3 rounded-lg input-glow"
                        placeholder="Your business name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiMail className="text-[#475569]" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        readOnly
                        className="pl-11 w-full px-4 py-3 rounded-lg bg-[#111C2D] border border-[rgba(14,165,233,0.08)] text-[#475569] cursor-not-allowed"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiPhone className="text-[#94A3B8]" />
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={handleChange}
                        className="pl-11 w-full px-4 py-3 rounded-lg input-glow"
                        placeholder="9876543210"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-[rgba(14,165,233,0.1)]">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-5 py-2.5 border border-[rgba(14,165,233,0.2)] rounded-lg text-[#94A3B8] hover:text-[#E2E8F0] font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2.5 bg-[#0EA5E9] hover:bg-[#38BDF8] text-[#080C14] rounded-lg font-bold transition-colors shadow-[0_0_20px_rgba(14,165,233,0.3)] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      'Processing...'
                    ) : (
                      <>
                        <FiCheck className="inline mr-1" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="bg-[#111C2D] rounded-lg p-4 border border-[rgba(14,165,233,0.06)]">
                    <p className="text-[0.75rem] text-[#94A3B8] uppercase tracking-[0.1em] mb-1">Business Name</p>
                    <p className="text-[#E2E8F0] font-medium">
                      {currentUser?.name || 'Not provided'}
                    </p>
                  </div>
                  <div className="bg-[#111C2D] rounded-lg p-4 border border-[rgba(14,165,233,0.06)]">
                    <p className="text-[0.75rem] text-[#94A3B8] uppercase tracking-[0.1em] mb-1">Email</p>
                    <p className="text-[#E2E8F0] font-medium">
                      {currentUser?.email || 'Not provided'}
                    </p>
                  </div>
                  <div className="bg-[#111C2D] rounded-lg p-4 border border-[rgba(14,165,233,0.06)]">
                    <p className="text-[0.75rem] text-[#94A3B8] uppercase tracking-[0.1em] mb-1">Phone Number</p>
                    <p className="text-[#E2E8F0] font-medium">
                      {currentUser?.phoneNumber || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default Profile;