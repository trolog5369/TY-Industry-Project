import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../Context/StoreContext';
import { FiSearch, FiTruck, FiPaperclip, FiCheckSquare, FiAlertCircle } from 'react-icons/fi';

const SupplierForm = () => {
  const {backend_url, token} = useContext(StoreContext);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Manufacturing Raw Material Supplier State
  const [formData, setFormData] = useState({
    supplierName: '',
    contactPerson: '',
    phoneNumber: '',
    gstin: '',
    materialSupplied: '',
    lastPurchaseDate: '',
    ratePerKg: '',
    image: null
  });

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(backend_url+'/api/supplier/suppliers', {
        headers: { Authorization: token }
      });
      setSuppliers(response.data.suppliers);
      setFilteredSuppliers(response.data.suppliers);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredSuppliers(suppliers);
    } else {
      const filtered = suppliers.filter(supplier =>
        supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.materialSupplied?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchTerm, suppliers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      data.append('supplierName', formData.supplierName);
      data.append('contactPerson', formData.contactPerson);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('gstin', formData.gstin);
      data.append('materialSupplied', formData.materialSupplied);
      data.append('lastPurchaseDate', formData.lastPurchaseDate);
      data.append('ratePerKg', formData.ratePerKg);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      await axios.post(backend_url+'/api/supplier/supplier-data', data, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Raw Material Supplier added successfully!');
      setFormData({
        supplierName: '', contactPerson: '', phoneNumber: '', gstin: '', 
        materialSupplied: '', lastPurchaseDate: '', ratePerKg: '', image: null
      });
      if(document.getElementById('fileInput')) document.getElementById('fileInput').value = '';
      fetchSuppliers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add supplier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark-gradient p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 lg:items-center">
            <div>
                <h1 className="text-[1.75rem] font-bold text-[#E2E8F0] flex items-center gap-3">
                    <FiTruck className="text-[#0EA5E9]" /> Vendor Procurement
                </h1>
                <p className="text-[#94A3B8] mt-2 text-sm">Manage raw material suppliers, rates, and procurement history.</p>
            </div>
        </div>

        <div className="bg-[#0F1927] p-8 mb-10 rounded-[16px] border border-[rgba(14,165,233,0.1)] border-l-4 border-l-[#0EA5E9] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(14,165,233,0.06)] rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[rgba(14,165,233,0.1)] relative z-10">
              <h2 className="text-2xl font-bold text-[#E2E8F0] flex items-center gap-2"><FiTruck className="text-[#0EA5E9]" /> Register Raw Material Vendor</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Supplier Name *</label>
                <input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow" required />
              </div>
              <div>
                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Contact Person</label>
                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow" />
              </div>
              <div>
                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Phone Number *</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow" required />
              </div>
              <div>
                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">GSTIN *</label>
                <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow font-mono" required />
              </div>
              <div>
                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Material Supplied *</label>
                <input type="text" name="materialSupplied" placeholder="e.g. EN8 Round Bars" value={formData.materialSupplied} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow" required />
              </div>
              <div>
                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Last Purchase Date</label>
                <input type="date" name="lastPurchaseDate" value={formData.lastPurchaseDate} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow" style={{ colorScheme: 'dark' }} />
              </div>
              <div>
                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Rate per Kg (₹)</label>
                <input type="number" name="ratePerKg" value={formData.ratePerKg} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow font-mono" />
              </div>
              {/* Optional File Upload styled nicely */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Material Invoice Scan (Optional)</label>
                <div className="relative">
                    <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-[#94A3B8] file:mr-4 file:py-3 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-[#111C2D] file:text-[#0EA5E9] hover:file:bg-[rgba(14,165,233,0.15)] bg-[#111C2D] border border-[rgba(14,165,233,0.2)] rounded-lg cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-[rgba(14,165,233,0.1)]">
                <button type="submit" disabled={loading} className="btn-primary px-8 py-3 flex items-center justify-center min-w-[200px] font-bold">
                    {loading ? <><span className="animate-spin mr-2 border-2 border-[#080C14] border-t-transparent rounded-full w-5 h-5"></span> Registering...</> : <><FiCheckSquare className="mr-2" /> Register Vendor</>}
                </button>
            </div>
          </form>
        </div>

        <div className="bg-[#0F1927] rounded-[16px] overflow-hidden border border-[rgba(14,165,233,0.1)] p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 border-b border-[rgba(14,165,233,0.1)] pb-4">
            <h2 className="text-xl font-bold text-[#E2E8F0] flex items-center gap-2">Raw Material Suppliers</h2>
            <div className="relative w-full md:w-72 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="text-[#0EA5E9]" />
                </div>
              <input type="text" placeholder="Search by name or material..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-11 pr-4 py-2 border border-[rgba(14,165,233,0.15)] bg-[#0F1927] rounded-lg focus:border-[#0EA5E9] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.1)] text-[#E2E8F0] placeholder-[#475569] outline-none transition-all" />
            </div>
          </div>

          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center">
                <FiAlertCircle size={48} className="text-[#475569] opacity-50 mb-4" />
                <p className="text-[#475569]">No raw material suppliers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#111C2D]">
                  <tr>
                    <th className="px-6 py-4 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Vendor Entity</th>
                    <th className="px-6 py-4 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">GSTIN</th>
                    <th className="px-6 py-4 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Contracted Material</th>
                    <th className="px-6 py-4 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Negotiated Rate/Kg</th>
                    <th className="px-6 py-4 text-right text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Contact Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier._id} className="border-b border-[rgba(14,165,233,0.06)] hover:bg-[rgba(14,165,233,0.04)] transition-all duration-300 group">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          {supplier.imageUrl ? (
                            <img className="h-12 w-12 border border-[rgba(14,165,233,0.2)] rounded-lg object-cover mr-4 cursor-pointer transform group-hover:scale-110 transition-transform" src={`${supplier.imageUrl}`} alt="Scan" onClick={() => window.open(supplier.imageUrl, '_blank')} title="View Scan" />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-[rgba(14,165,233,0.1)] mr-4 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                              <FiPaperclip className="text-[#94A3B8]" />
                            </div>
                          )}
                          <div>
                            <div className="text-base font-bold text-[#E2E8F0]">{supplier.supplierName}</div>
                            <div className="text-[0.75rem] text-[#475569] font-mono mt-1">Since: {supplier.lastPurchaseDate ? new Date(supplier.lastPurchaseDate).toLocaleDateString() : 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-[0.75rem] font-mono text-[#94A3B8] border border-[rgba(14,165,233,0.1)] bg-[#111C2D] px-3 py-1.5 rounded-lg inline-block">{supplier.gstin}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-[#0EA5E9]">
                        {supplier.materialSupplied}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm">
                        <span className="bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border border-[rgba(245,158,11,0.2)] px-3 py-1 rounded font-mono">
                            ₹{supplier.ratePerKg || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                        <div className="text-[#94A3B8] font-medium">{supplier.contactPerson}</div>
                        <div className="text-[#475569] mt-1">{supplier.phoneNumber}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;