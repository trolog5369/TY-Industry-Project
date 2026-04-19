import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiPrinter, FiBox, FiCheckCircle } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';
import { StoreContext } from '../Context/StoreContext';

function InventoryManager() {
    const { backend_url, token, categories, fetchCategories } = useContext(StoreContext);
    const [products, setProducts] = useState([]);
    
    // Updated Manufacturing State
    const [newProduct, setNewProduct] = useState({
        name: '', category: '', productCode: '', materialType: '',
        dimensions: '', drawingNumber: '', tolerance: '', batchNumber: '',
        heatNumber: '', manufacturingDate: '', status: 'Ready', quantity: '', minStockLevel: ''
    });

    const [quantityUpdate, setQuantityUpdate] = useState({
        id: '', quantity: '', minStockLevel: '', status: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [productToUpdate, setProductToUpdate] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    
    // Category Management
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [newCategoryText, setNewCategoryText] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        const url = backend_url + '/api/inventory/list';
        axios.get(url, { headers: { "Authorization": token } })
            .then(response => setProducts(response.data))
            .catch(error => handleError('Error fetching products'));
    };
    
    const handleAddCategory = async () => {
        if(!newCategoryText) return;
        try {
            await axios.post(backend_url + '/api/inventory/categories', { name: newCategoryText }, { headers: { "Authorization": token } });
            fetchCategories();
            setNewProduct({...newProduct, category: newCategoryText});
            setIsAddingNewCategory(false);
            setNewCategoryText('');
            handleSuccess('Category Added');
        } catch(e) {
            handleError('Failed to add category');
        }
    };

    const addProduct = () => {
        const url = backend_url + '/api/inventory/add';
        axios.post(url, newProduct, { headers: { "Authorization": token } })
            .then(response => {
                setProducts([...products, response.data]);
                setNewProduct({
                    name: '', category: '', productCode: '', materialType: '',
                    dimensions: '', drawingNumber: '', tolerance: '', batchNumber: '',
                    heatNumber: '', manufacturingDate: '', status: 'Ready', quantity: '', minStockLevel: ''
                });
                setShowAddForm(false);
                handleSuccess("Component Added Successfully");
                setSelectedProduct(response.data);
                setShowQRModal(true);
            })
            .catch(error => {
                handleError(error.response?.data?.message || "Error adding product");
            });
    };

    const updateQuantity = () => {
        const { id, quantity, minStockLevel, status } = quantityUpdate;
        const updatedProduct = {
            quantity: parseInt(quantity),
            minStockLevel: parseInt(minStockLevel),
            status: status
        };
        const url = backend_url + `/api/inventory/update-product/${id}`;
        axios.put(url, updatedProduct, { headers: { "Authorization": token } })
            .then(response => {
                setProducts(products.map(product =>
                    product._id === response.data._id ? response.data : product
                ));
                setShowUpdateModal(false);
                handleSuccess("Component Updated Successfully");
            })
            .catch(error => handleError("Error updating product"));
    };

    const deleteProduct = (id) => {
        const url = backend_url + `/api/inventory/delete/${id}`;
        axios.delete(url, { headers: { "Authorization": token } })
            .then(response => {
                setProducts(products.filter(product => product._id !== id));
                handleSuccess("Component deleted Successfully");
            })
            .catch(error => handleError("Error deleting product"));
    };

    const getQRCodeData = (product) => encodeURIComponent(JSON.stringify({ id: product._id, drawing: product.drawingNumber, batch: product.batchNumber }));
    const getQRCodeUrl = (product) => `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${getQRCodeData(product)}`;

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.drawingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen dark-gradient p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col justify-between gap-6 mb-8 sm:flex-row sm:items-center">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-[1.75rem] font-bold text-[#E2E8F0]">Component Inventory</h1>
                        <p className="text-[#94A3B8] mt-1 text-sm">Manage high-precision active stock, drawings, and heat batches</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-[#0EA5E9]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search drawing or batch..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[#0F1927] border border-[rgba(14,165,233,0.15)] rounded-lg focus:border-[#0EA5E9] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.1)] text-[#E2E8F0] placeholder-[#475569] outline-none transition-all"
                            />
                        </div>

                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="btn-primary px-6 py-2 flex items-center justify-center min-w-[200px] font-bold"
                        >
                            <FiPlus className="mr-2" size={20} />
                            <span>Add Component</span>
                        </button>
                    </div>
                </div>

                {/* Add Component Form */}
                {showAddForm && (
                    <div className="bg-[#0F1927] rounded-[16px] p-6 mb-8 border border-[rgba(14,165,233,0.1)] border-l-4 border-l-[#0EA5E9] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(14,165,233,0.06)] rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[rgba(14,165,233,0.1)] relative z-10">
                            <h2 className="text-2xl font-bold text-[#E2E8F0] flex items-center gap-2">
                                <FiBox className="text-[#0EA5E9]" /> New Component
                            </h2>
                            <button onClick={() => setShowAddForm(false)} className="p-2 rounded-full hover:bg-[rgba(14,165,233,0.1)] text-[#94A3B8] hover:text-[#E2E8F0] transition-colors">
                                <FiX size={20} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            <div>
                                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-1 tracking-[0.1em] uppercase">Product Code</label>
                                <input type="text" value={newProduct.productCode} onChange={(e) => setNewProduct({ ...newProduct, productCode: e.target.value })} className="w-full px-4 py-2 rounded-lg input-glow" />
                            </div>
                            <div>
                                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-1 tracking-[0.1em] uppercase">Component Name</label>
                                <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-4 py-2 rounded-lg input-glow" />
                            </div>
                            <div>
                                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-1 tracking-[0.1em] uppercase">Category</label>
                                {isAddingNewCategory ? (
                                    <div className="flex">
                                        <input type="text" placeholder="New Category" value={newCategoryText} onChange={(e) => setNewCategoryText(e.target.value)} className="w-full px-4 py-2 rounded-l-lg input-glow" />
                                        <button onClick={handleAddCategory} className="bg-[#0EA5E9] text-[#080C14] px-4 font-bold rounded-r-lg hover:bg-[#38BDF8] transition-colors">Add</button>
                                    </div>
                                ) : (
                                    <div className="flex">
                                        <select value={newProduct.category} onChange={(e) => {
                                            if(e.target.value === 'ADD_NEW') setIsAddingNewCategory(true);
                                            else setNewProduct({...newProduct, category: e.target.value})
                                        }} className="w-full px-4 py-2 rounded-lg input-glow" style={{ backgroundColor: '#111C2D', color: '#E2E8F0', border: '1px solid rgba(14,165,233,0.15)' }}>
                                            <option value="" style={{ backgroundColor: '#111C2D', color: '#94A3B8' }}>Select Category...</option>
                                            {categories.map(c => <option key={c._id} value={c.name} style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>{c.name}</option>)}
                                            <option value="ADD_NEW" style={{ backgroundColor: '#111C2D', color: '#0EA5E9' }}>+ Add New Category</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-1 tracking-[0.1em] uppercase">Material Type</label>
                                <input type="text" placeholder="e.g. MS, EN8" value={newProduct.materialType} onChange={(e) => setNewProduct({ ...newProduct, materialType: e.target.value })} className="w-full px-4 py-2 rounded-lg input-glow" />
                            </div>
                            <div>
                                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-1 tracking-[0.1em] uppercase">Stock Quantity</label>
                                <input type="number" placeholder="Qty" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} className="w-full px-4 py-2 rounded-lg input-glow" />
                            </div>
                            <div>
                                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-1 tracking-[0.1em] uppercase">Manufacturing Date</label>
                                <input type="date" value={newProduct.manufacturingDate} onChange={(e) => setNewProduct({ ...newProduct, manufacturingDate: e.target.value })} className="w-full px-4 py-2 rounded-lg input-glow" style={{ colorScheme: 'dark' }} />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3 relative z-10 w-full pt-4 border-t border-[rgba(14,165,233,0.1)]">
                            <button onClick={() => setShowAddForm(false)} className="px-6 py-2 rounded-lg font-bold text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[rgba(14,165,233,0.05)] transition-colors">Cancel</button>
                            <button onClick={addProduct} className="btn-primary px-8 py-2 flex items-center font-bold"><FiCheckCircle className="mr-2" /> Confirm Insertion</button>
                        </div>
                    </div>
                )}

                {/* Products Table */}
                <div className="bg-[#0F1927] rounded-[16px] overflow-hidden border border-[rgba(14,165,233,0.1)]">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-[#111C2D]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Product Code</th>
                                    <th className="px-6 py-4 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Component Name</th>
                                    <th className="px-6 py-4 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Category</th>
                                    <th className="px-6 py-4 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Material Type</th>
                                    <th className="px-6 py-4 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Stock Quantity</th>
                                    <th className="px-6 py-4 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Manufacturing Date</th>
                                    <th className="px-6 py-4 text-right text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id} className="border-b border-[rgba(14,165,233,0.06)] hover:bg-[rgba(14,165,233,0.04)] transition-all duration-300 group">
                                            <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-[#94A3B8]">{product.productCode}</td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-[#E2E8F0]">{product.name}</td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-[#94A3B8]">{product.category}</td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-[#94A3B8]">{product.materialType}</td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`px-3 py-1.5 inline-flex text-sm font-bold rounded-md ${
                                                    product.quantity === 0 
                                                    ? 'bg-[rgba(239,68,68,0.1)] text-[#EF4444]' 
                                                    : product.quantity <= 10 
                                                    ? 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B]' 
                                                    : 'bg-[rgba(14,165,233,0.1)] text-[#0EA5E9]'
                                                }`}>{product.quantity}</span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-[#94A3B8]">
                                                {product.manufacturingDate ? new Date(product.manufacturingDate).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                                                <div className="flex justify-end gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => {
                                                        setProductToUpdate(product);
                                                        setQuantityUpdate({ id: product._id, quantity: product.quantity, minStockLevel: product.minStockLevel, status: product.status || 'Ready' });
                                                        setShowUpdateModal(true);
                                                    }} className="p-2 rounded-lg bg-[rgba(14,165,233,0.1)] text-[#0EA5E9] hover:bg-[rgba(14,165,233,0.2)] hover:scale-110 transition-all border border-transparent hover:border-[rgba(14,165,233,0.3)]" title="Manage Stock"><FiEdit2 size={16} /></button>
                                                    <button onClick={() => {setSelectedProduct(product); setShowQRModal(true);}} className="p-2 rounded-lg bg-[rgba(148,163,184,0.1)] text-[#94A3B8] hover:bg-[rgba(148,163,184,0.2)] hover:scale-110 transition-all border border-transparent hover:border-[rgba(148,163,184,0.3)]" title="Print Tag"><FiPrinter size={16} /></button>
                                                    <button onClick={() => deleteProduct(product._id)} className="p-2 rounded-lg bg-[rgba(239,68,68,0.1)] text-[#EF4444] hover:bg-[rgba(239,68,68,0.2)] hover:scale-110 transition-all border border-transparent hover:border-[rgba(239,68,68,0.3)]" title="Delete"><FiTrash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-[#475569]">
                                            <FiBox size={48} className="mb-4 opacity-20" />
                                            <p className="text-lg">No components found in the system.</p>
                                        </div>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Manage Stock Modal */}
                {showUpdateModal && productToUpdate && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[#0F1927] border border-[rgba(14,165,233,0.15)] rounded-[16px] p-8 w-full max-w-sm shadow-[0_0_50px_rgba(14,165,233,0.1)]">
                            <h2 className="text-2xl font-bold text-[#E2E8F0] border-b border-[rgba(14,165,233,0.1)] pb-4 mb-6">Update <span className="text-[#0EA5E9]">{productToUpdate.name}</span></h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Status</label>
                                    <select value={quantityUpdate.status} onChange={(e) => setQuantityUpdate({...quantityUpdate, status: e.target.value})} className="w-full px-4 py-3 rounded-lg input-glow" style={{ backgroundColor: '#111C2D', color: '#E2E8F0', border: '1px solid rgba(14,165,233,0.15)' }}>
                                        <option value="In Production" style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>In Production</option>
                                        <option value="Ready" style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>Ready</option>
                                        <option value="Dispatched" style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>Dispatched</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Stock Qty</label>
                                        <input type="number" value={quantityUpdate.quantity ?? ''} onChange={(e) => setQuantityUpdate({ ...quantityUpdate, quantity: e.target.value })} className="w-full px-4 py-3 rounded-lg input-glow font-mono text-lg text-center" />
                                    </div>
                                    <div>
                                        <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Min Level</label>
                                        <input type="number" value={quantityUpdate.minStockLevel ?? ''} onChange={(e) => setQuantityUpdate({ ...quantityUpdate, minStockLevel: e.target.value })} className="w-full px-4 py-3 rounded-lg input-glow font-mono text-lg text-center" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end space-x-3 w-full">
                                <button onClick={() => setShowUpdateModal(false)} className="px-5 py-2 rounded-lg font-bold text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[rgba(14,165,233,0.05)] transition-colors">Cancel</button>
                                <button onClick={updateQuantity} className="btn-primary w-full py-3 flex-1 flex justify-center items-center font-bold"><FiCheckCircle className="mr-2"/> Save Updates</button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Print Tag Modal */}
                {showQRModal && selectedProduct && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 print:shadow-none print:w-full print:h-full print:m-0">
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center border-b pb-4"><span className="text-gray-500 text-sm block font-normal uppercase tracking-widest">Routing Tag</span>{selectedProduct.drawingNumber}</h2>
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-white border-4 border-gray-900 rounded-xl shadow-lg mb-6 transform -rotate-1">
                                    <img src={getQRCodeUrl(selectedProduct)} alt="QR" className="w-48 h-48" />
                                </div>
                                <table className="w-full text-sm mb-6 border-2 border-gray-900 rounded-lg overflow-hidden">
                                    <tbody>
                                        <tr className="border-b border-gray-300 bg-gray-50"><td className="font-bold p-3 text-gray-600 uppercase text-xs border-r border-gray-300 w-1/3">Component</td><td className="p-3 font-bold text-gray-900 text-base">{selectedProduct.name}</td></tr>
                                        <tr className="border-b border-gray-300"><td className="font-bold p-3 text-gray-600 uppercase text-xs border-r border-gray-300">Run Batch</td><td className="p-3 font-mono font-bold text-lg text-gray-900 bg-yellow-100">{selectedProduct.batchNumber}</td></tr>
                                        <tr><td className="font-bold p-3 text-gray-600 uppercase text-xs border-r border-gray-300">Material Gr</td><td className="p-3 font-bold text-gray-800">{selectedProduct.materialType}</td></tr>
                                    </tbody>
                                </table>
                                <div className="flex space-x-3 w-full print:hidden">
                                    <button onClick={() => setShowQRModal(false)} className="w-1/3 py-3 border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors">Close</button>
                                    <button onClick={() => window.print()} className="w-2/3 py-3 bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:bg-blue-700 font-bold rounded-xl flex justify-center items-center transition-all"><FiPrinter className="mr-2"/> Print Tag</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
}

export default InventoryManager;