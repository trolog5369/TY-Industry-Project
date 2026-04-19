import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../utils';
import { ToastContainer } from 'react-toastify';
import { StoreContext } from '../Context/StoreContext';
import { useContext } from 'react';
import { FiSearch, FiPlus, FiX, FiUsers, FiBriefcase, FiEye, FiUser } from 'react-icons/fi';

const CustomerAccount = () => {
    const { fetchCustomers, customerData, backend_url, token } = useContext(StoreContext);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        companyName: '',
        contactPersonName: '',
        phoneNumber: '',
        email: '',
        address: '',
        gstin: '',
        industryType: 'Automotive'
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredCustomers(customerData);
        } else {
            const filtered = customerData.filter(customer =>
                customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                customer.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCustomers(filtered);
        }
    }, [searchTerm, customerData]);

    const handleViewHistory = (customerId) => {
        navigate(`/customer/${encodeURIComponent(customerId)}`);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!newCustomer.companyName.trim() || !newCustomer.contactPersonName.trim() || !newCustomer.gstin.trim()) {
            handleError('Company Name, Contact Person, and GSTIN are required');
            setLoading(false);
            return;
        }

        try {
            await axios.post(
                backend_url+'/api/customer/add',
                newCustomer,
                { headers: { Authorization: token } }
            );

            handleSuccess('Customer added successfully');
            await fetchCustomers();

            setShowAddForm(false);
            setNewCustomer({ companyName: '', contactPersonName: '', phoneNumber: '', email: '', address: '', gstin: '', industryType: 'Automotive' });
        } catch (error) {
            handleError(error.response?.data?.message || 'Failed to add customer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen dark-gradient p-4 md:p-8">
            <ToastContainer theme="dark" />
            
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 lg:items-center">
                    <div>
                        <h1 className="text-[1.75rem] font-bold text-[#E2E8F0] flex items-center gap-3">
                            <FiBriefcase className="text-[#0EA5E9]" /> B2B Client Directory
                        </h1>
                        <p className="text-[#94A3B8] mt-2 text-sm">Manage OEM partners, vendors, and industrial clients</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiSearch className="text-[#0EA5E9]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by company or GSTIN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-[#0F1927] border border-[rgba(14,165,233,0.15)] rounded-lg focus:border-[#0EA5E9] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.1)] text-[#E2E8F0] placeholder-[#475569] outline-none transition-all"
                            />
                        </div>
                        
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="btn-primary flex items-center justify-center px-6 py-3 min-w-[200px] font-bold"
                        >
                            <FiPlus className="mr-2" size={20} />
                            {showAddForm ? 'Cancel Entry' : 'Add New Client'}
                        </button>
                    </div>
                </div>

                {/* Add Customer Form */}
                {showAddForm && (
                    <div className="bg-[#0F1927] p-8 mb-10 rounded-[16px] border border-[rgba(14,165,233,0.1)] border-l-4 border-l-[#0EA5E9] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(14,165,233,0.06)] rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[rgba(14,165,233,0.1)]">
                            <h2 className="text-2xl font-bold text-[#E2E8F0] flex items-center gap-2"><FiUsers className="text-[#0EA5E9]" /> Register Client</h2>
                            <button onClick={() => setShowAddForm(false)} className="text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"><FiX size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleAddCustomer} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Company Name *</label>
                                    <input type="text" name="companyName" value={newCustomer.companyName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg input-glow" required />
                                </div>
                                <div>
                                    <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">GSTIN *</label>
                                    <input type="text" name="gstin" value={newCustomer.gstin} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg input-glow font-mono" required />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Contact Person *</label>
                                    <input type="text" name="contactPersonName" value={newCustomer.contactPersonName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg input-glow" required />
                                </div>
                                <div>
                                    <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Phone Number *</label>
                                    <input type="tel" name="phoneNumber" value={newCustomer.phoneNumber} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg input-glow" required />
                                </div>
                                <div>
                                    <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Industry Type</label>
                                    <select name="industryType" value={newCustomer.industryType} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg input-glow" style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>
                                        <option value="Automotive" style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>Automotive</option>
                                        <option value="Construction" style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>Construction</option>
                                        <option value="OEM" style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>OEM</option>
                                        <option value="Vendor" style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>Vendor</option>
                                        <option value="Other" style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-[rgba(14,165,233,0.1)] space-x-4">
                                <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 rounded-lg font-bold text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[rgba(14,165,233,0.05)] transition-colors">Cancel</button>
                                <button type="submit" className="btn-primary px-8 py-3 flex items-center font-bold" disabled={loading}>
                                    {loading ? (
                                        <><span className="animate-spin mr-2 border-2 border-[#080C14] border-t-transparent rounded-full w-5 h-5"></span> Registering...</>
                                    ) : 'Complete Registration'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Customers Table */}
                <div className="bg-[#0F1927] rounded-[16px] overflow-hidden border border-[rgba(14,165,233,0.1)]">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-[#111C2D]">
                                <tr>
                                    <th className="px-6 py-5 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Partner Entity</th>
                                    <th className="px-6 py-5 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Tax ID (GSTIN)</th>
                                    <th className="px-6 py-5 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Operations Contact</th>
                                    <th className="px-6 py-5 text-right text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer._id} className="border-b border-[rgba(14,165,233,0.06)] hover:bg-[rgba(14,165,233,0.04)] transition-all duration-300 group">
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12 bg-[rgba(14,165,233,0.15)] rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                                        <span className="text-[#0EA5E9] font-bold text-lg">
                                                            {customer.companyName?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-5">
                                                        <div className="text-base font-bold text-[#E2E8F0] tracking-wide">{customer.companyName}</div>
                                                        <div className={`text-xs mt-1 uppercase tracking-widest font-semibold ${customer.industryType === 'Automotive' ? 'text-[#0EA5E9]' : customer.industryType === 'Construction' ? 'text-[#F59E0B]' : 'text-[#94A3B8]'}`}>{customer.industryType}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="text-[0.75rem] font-mono text-[#94A3B8] border border-[rgba(14,165,233,0.1)] bg-[#111C2D] px-3 py-1.5 rounded-lg inline-block">
                                                    {customer.gstin}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="text-sm text-[#E2E8F0] font-medium flex items-center gap-2"><FiUser className="text-[#94A3B8]" /> {customer.contactPersonName}</div>
                                                <div className="text-xs text-[#475569] mt-1">{customer.phoneNumber}</div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => handleViewHistory(customer._id)}
                                                    className="inline-flex items-center px-4 py-2 border border-[rgba(14,165,233,0.2)] text-sm font-bold rounded-lg text-[#0EA5E9] bg-[rgba(14,165,233,0.1)] hover:bg-[rgba(14,165,233,0.2)] transition-all duration-300"
                                                >
                                                    <FiEye className="mr-2" size={16} /> Ledger
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-20 h-20 bg-[rgba(14,165,233,0.1)] rounded-full flex items-center justify-center mb-4">
                                                    <FiUsers className="h-10 w-10 text-[#475569] opacity-50" />
                                                </div>
                                                <h3 className="text-lg font-bold text-[#94A3B8]">
                                                    {searchTerm ? 'No matching partners found' : 'No clients registered'}
                                                </h3>
                                                <p className="mt-2 text-sm text-[#475569] max-w-sm">
                                                    {searchTerm ? 'Adjust your search queries.' : 'Begin your B2B journey by onboarding your first industrial client.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerAccount;