import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiShoppingCart, FiStar, FiAlertTriangle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { StoreContext } from '../Context/StoreContext';


const ProductList = () => {
  const {backend_url,token} = useContext(StoreContext);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterOption, setFilterOption] = useState('all');
  const loggedInUser = localStorage.getItem("loggedInUser");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = backend_url+'/api/products';
        const headers = {
          headers: {
            Authorization: token,
          },
        };
        
        const response = await axios.get(url, headers);
        setProducts(response.data);
      } catch (error) {
        toast.error('Error fetching products');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterOption === 'lowStock') {
      return matchesSearch && product.quantity <= product.reorderLevel;
    } else if (filterOption === 'expiring') {
      const today = new Date();
      const expDate = new Date(product.expirationDate);
      return matchesSearch && expDate < new Date(today.setDate(today.getDate() + 30));
    }
    
    return matchesSearch;
  });

  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity <= reorderLevel) return 'low-stock';
    return 'in-stock';
  };

  const getExpirationStatus = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const thirtyDaysFromNow = new Date(today.setDate(today.getDate() + 30));
    
    if (expDate < new Date()) return 'expired';
    if (expDate < thirtyDaysFromNow) return 'expiring-soon';
    return 'fresh';
  };

  /* ── inline style helpers ── */
  const pageBg = {
    minHeight: '100vh',
    background: '#080C14',
    padding: '2rem',
  };

  const cardBg = {
    background: '#0F1927',
    border: '1px solid rgba(14,165,233,0.1)',
    borderRadius: '0.75rem',
  };

  const searchBarStyle = {
    width: '100%',
    paddingLeft: '2.5rem',
    paddingRight: '1rem',
    paddingTop: '0.625rem',
    paddingBottom: '0.625rem',
    background: '#080C14',
    border: '1px solid rgba(14,165,233,0.15)',
    borderRadius: '0.5rem',
    color: '#E2E8F0',
    outline: 'none',
    fontSize: '0.875rem',
  };

  const selectStyle = {
    backgroundColor: '#111C2D',
    border: '1px solid rgba(14,165,233,0.15)',
    borderRadius: '0.5rem',
    padding: '0.625rem 1rem',
    color: '#E2E8F0',
    outline: 'none',
    fontSize: '0.875rem',
    cursor: 'pointer',
  };

  const statCardStyle = {
    ...cardBg,
    padding: '1.5rem',
  };

  const productCardStyle = (status) => ({
    ...cardBg,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    borderLeft: status === 'out-of-stock'
      ? '4px solid #EF4444'
      : status === 'low-stock'
        ? '4px solid #F59E0B'
        : '1px solid rgba(14,165,233,0.1)',
  });

  return (
    <div style={pageBg}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#F1F5F9',
            marginBottom: '0.5rem',
            letterSpacing: '-0.025em',
          }}>
            {loggedInUser}'s Product Inventory
          </h1>
          <p style={{ color: '#94A3B8', maxWidth: '42rem', margin: '0 auto', fontSize: '0.95rem' }}>
            Manage and track all your products in one place
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ ...cardBg, padding: '1.5rem', marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <FiSearch style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748B',
                fontSize: '1rem',
              }} />
              <input
                type="text"
                placeholder="Search products by name..."
                style={searchBarStyle}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              style={selectStyle}
            >
              <option value="all" style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>All Products</option>
              <option value="lowStock" style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>Low Stock</option>
              <option value="expiring" style={{ backgroundColor: '#111C2D', color: '#E2E8F0' }}>Expiring Soon</option>
            </select>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div style={statCardStyle}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748B', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Products</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#0EA5E9' }}>{products.length}</p>
          </div>
          
          <div style={statCardStyle}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748B', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Low Stock Items</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#F59E0B' }}>
              {products.filter(p => p.quantity <= p.reorderLevel).length}
            </p>
          </div>
          
          <div style={statCardStyle}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748B', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expiring Soon</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#EF4444' }}>
              {products.filter(p => {
                const today = new Date();
                const expDate = new Date(p.expirationDate);
                return expDate < new Date(today.setDate(today.getDate() + 30));
              }).length}
            </p>
          </div>
        </motion.div>

        {/* Product Grid */}
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              border: '3px solid rgba(14,165,233,0.15)',
              borderTop: '3px solid #0EA5E9',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredProducts.map((product, index) => {
              const stockStatus = getStockStatus(product.quantity, product.reorderLevel);
              const expStatus = getExpirationStatus(product.expirationDate);

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(14,165,233,0.08)' }}
                  style={productCardStyle(stockStatus)}
                >
                  <div style={{ padding: '1.5rem' }}>
                    {/* Product Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <h2 style={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: '#F1F5F9',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '70%',
                      }}>{product.name}</h2>
                      {stockStatus === 'low-stock' && (
                        <span style={{
                          background: 'rgba(245,158,11,0.15)',
                          color: '#F59E0B',
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontWeight: 600,
                        }}>
                          <FiAlertTriangle style={{ fontSize: '0.65rem' }} /> Low Stock
                        </span>
                      )}
                      {stockStatus === 'out-of-stock' && (
                        <span style={{
                          background: 'rgba(239,68,68,0.15)',
                          color: '#EF4444',
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '9999px',
                          fontWeight: 600,
                        }}>Out of Stock</span>
                      )}
                    </div>

                    {/* Price Information */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0EA5E9', marginRight: '0.5rem' }}>
                        ₹{product.sellingPrice}
                      </span>
                      {product.actualPrice && (
                        <span style={{ fontSize: '0.85rem', color: '#475569', textDecoration: 'line-through' }}>
                          ₹{product.actualPrice}
                        </span>
                      )}
                    </div>

                    {/* Stock Information */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.35rem' }}>
                        <span>Quantity:</span>
                        <span style={{ fontWeight: 500 }}>{product.quantity} units</span>
                      </div>
                      <div style={{ width: '100%', background: 'rgba(14,165,233,0.08)', borderRadius: '9999px', height: '0.4rem' }}>
                        <div
                          style={{
                            height: '0.4rem',
                            borderRadius: '9999px',
                            background: stockStatus === 'out-of-stock' ? '#EF4444'
                              : stockStatus === 'low-stock' ? '#F59E0B' : '#22C55E',
                            width: `${Math.min(100, (product.quantity / (product.reorderLevel * 3)) * 100)}%`,
                            transition: 'width 0.5s ease',
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Expiration Status */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
                        <span>Expires:</span>
                        <span style={{
                          fontWeight: 500,
                          color: expStatus === 'expired' ? '#EF4444'
                            : expStatus === 'expiring-soon' ? '#F59E0B' : '#22C55E',
                        }}>
                          {new Date(product.expirationDate).toLocaleDateString()}
                          {expStatus === 'expired' && ' (Expired)'}
                          {expStatus === 'expiring-soon' && ' (Soon)'}
                        </span>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: '#94A3B8' }}>
                      {product.reorderLevel && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Reorder Level:</span>
                          <span style={{ color: '#CBD5E1' }}>{product.reorderLevel}</span>
                        </div>
                      )}
                      {product.category && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Category:</span>
                          <span style={{ color: '#0EA5E9' }}>{product.category}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                      <button
                        style={{
                          flex: 1,
                          background: '#0EA5E9',
                          color: '#080C14',
                          padding: '0.6rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#38BDF8'; e.currentTarget.style.boxShadow = '0 0 16px rgba(14,165,233,0.35)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#0EA5E9'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <FiShoppingCart /> Add to Cart
                      </button>
                      <button
                        style={{
                          background: 'rgba(14,165,233,0.08)',
                          color: '#0EA5E9',
                          padding: '0.6rem 0.75rem',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(14,165,233,0.15)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.15)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.08)'; }}
                      >
                        <FiStar />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ ...cardBg, padding: '3rem', textAlign: 'center' }}
          >
            <div style={{ color: '#475569', marginBottom: '1rem' }}>
              <svg style={{ width: '4rem', height: '4rem', margin: '0 auto' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.5rem' }}>
              {searchTerm ? 'No products match your search' : 'No products available'}
            </h3>
            <p style={{ color: '#64748B' }}>
              {searchTerm ? 'Try a different search term' : 'Add new products to get started'}
            </p>
          </motion.div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default ProductList;