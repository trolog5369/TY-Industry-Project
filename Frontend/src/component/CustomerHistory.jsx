import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../Context/StoreContext';

const CustomerHistory = () => {
  const { customerId } = useParams();
  const { fetchBill, bill, updateBill ,backend_url,token} = useContext(StoreContext);
  const [customerBills, setCustomerBills] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const [depositAmount, setDepositAmount] = useState(0);
  const [expandedRows, setExpandedRows] = useState([]);
  const [whatsappModal, setWhatsappModal] = useState(false);
  const [totalRemaining, setTotalRemaining] = useState(0);

  useEffect(() => {
    fetchBill();
  }, []);

  useEffect(() => {
    if (bill && bill.length > 0) {
      const customerBills = bill.filter(item => item.customerId === customerId);
      setCustomerBills(customerBills);
      
      if (customerBills.length > 0) {
        setCustomerInfo({
          name: customerBills[0].customerName,
          phone: customerBills[0].phoneNumber
        });
        
        const remaining = customerBills.reduce((sum, bill) => {
          return sum + (bill.grandTotal - (bill.deposit || 0));
        }, 0);
        setTotalRemaining(remaining);
      }
    }
  }, [bill, customerId]);

  const toggleRow = (billId) => {
    setExpandedRows(prev => 
      prev.includes(billId) 
        ? prev.filter(id => id !== billId) 
        : [...prev, billId]
    );
  };

  const handleEdit = (bill) => {
    setCurrentBill(bill);
    setDepositAmount(bill.deposit || 0);
    setEditModal(true);
  };

  const handleViewHistory = (bill) => {
    setCurrentBill(bill);
    setHistoryModal(true);
  };

  const handleSubmit = async () => {
    try {
      await updateBill({
        billId: currentBill._id,
        deposit: depositAmount
      });
      setEditModal(false);
      fetchBill();
      alert('Deposit updated successfully!');
    } catch (error) {
      alert('Failed to update deposit');
      console.error(error);
    }
  };

  const sendWhatsAppMessage = () => {
    if (!customerInfo?.phone) {
      alert('Customer phone number is not available');
      return;
    }

    const formattedPhone = customerInfo.phone.replace(/^0/, '92');
    const message = `Dear ${customerInfo.name},\n\nYour total outstanding amount is Rs. ${totalRemaining.toFixed(2)}.\n\nPlease clear your dues at your earliest convenience.\n\nThank you.`;
    
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen dark-gradient px-4 py-6">
      <div className="max-w-7xl mx-auto">
      {/* Customer Header */}
      {customerInfo && (
        <div className="bg-[#0F1927] rounded-[16px] border border-[rgba(14,165,233,0.1)] p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#E2E8F0]">{customerInfo.name}'s Purchase History</h1>
              <p className="text-[#94A3B8]">Phone: {customerInfo.phone || 'Not provided'}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="text-right space-y-1">
                <p className="text-[#94A3B8]">Total Bills: <span className="font-medium text-[#E2E8F0]">{customerBills.length}</span></p>
                <p className="text-lg font-semibold text-[#F59E0B]">
                  Total Remaining: ₹{totalRemaining.toFixed(2)}
                </p>
              </div>
              
              {customerInfo.phone && (
                <button
                  onClick={() => setWhatsappModal(true)}
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Send Reminder
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bills Table */}
      <div className="bg-[#0F1927] rounded-[16px] overflow-hidden border border-[rgba(14,165,233,0.1)]">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#111C2D]">
              <tr>
                <th className="px-6 py-3 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">#</th>
                <th className="px-6 py-3 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Bill No.</th>
                <th className="px-6 py-3 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Date</th>
                <th className="px-6 py-3 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Total</th>
                <th className="px-6 py-3 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Deposit</th>
                <th className="px-6 py-3 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Remaining</th>
                <th className="px-6 py-3 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customerBills.length > 0 ? (
                customerBills.map((bill, index) => (
                  <React.Fragment key={bill._id}>
                    <tr className={`border-b border-[rgba(14,165,233,0.06)] ${expandedRows.includes(bill._id) ? 'bg-[#111C2D]' : 'hover:bg-[rgba(14,165,233,0.04)]'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#94A3B8]">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#E2E8F0]">{bill.billNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#94A3B8]">
                        {new Date(bill.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0] font-mono">
                        ₹{bill.grandTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0EA5E9] font-mono">
                        ₹{(bill.deposit || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F59E0B] font-mono font-bold">
                        ₹{(bill.grandTotal - (bill.deposit || 0)).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleRow(bill._id)}
                            className="p-1.5 rounded-md bg-[rgba(14,165,233,0.1)] text-[#94A3B8] hover:bg-[rgba(14,165,233,0.2)] transition-colors"
                            aria-label={expandedRows.includes(bill._id) ? "Collapse row" : "Expand row"}
                          >
                            {expandedRows.includes(bill._id) ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(bill)}
                            className="px-3 py-1.5 bg-[#0EA5E9] hover:bg-[#38BDF8] text-[#080C14] rounded-md text-sm font-bold transition-colors"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleViewHistory(bill)}
                            className="px-3 py-1.5 border border-[rgba(148,163,184,0.3)] text-[#94A3B8] hover:text-[#E2E8F0] hover:border-[rgba(148,163,184,0.5)] rounded-md text-sm font-bold transition-colors"
                          >
                            History
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRows.includes(bill._id) && (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 bg-[#111C2D]">
                          <div className="mb-4">
                            <h4 className="text-lg font-medium text-[#E2E8F0]">Items Purchased</h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-[rgba(14,165,233,0.1)] rounded-lg overflow-hidden">
                              <thead className="bg-[#0F1927]">
                                <tr>
                                  <th className="px-4 py-2 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em]">Product</th>
                                  <th className="px-4 py-2 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em]">Qty</th>
                                  <th className="px-4 py-2 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em]">Price</th>
                                  <th className="px-4 py-2 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em]">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {bill.items.map((item, idx) => (
                                  <tr key={idx} className="border-b border-[rgba(14,165,233,0.06)] hover:bg-[rgba(14,165,233,0.04)]">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#E2E8F0]">{item.productName}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#94A3B8] font-mono">{item.quantity}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#94A3B8] font-mono">₹{item.price.toFixed(2)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#0EA5E9] font-mono">₹{item.total.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="flex justify-between mt-4 text-sm">
                            <div className="text-[#94A3B8]">Net Quantity: {bill.netQuantity}</div>
                            <div className="font-medium text-[#E2E8F0]">Grand Total: ₹{bill.grandTotal.toFixed(2)}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#475569]">
                      <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-lg font-medium">No bills found for this customer</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Reminder Modal */}
      {whatsappModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1927] rounded-[16px] border border-[rgba(14,165,233,0.1)] w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#E2E8F0]">Send WhatsApp Reminder</h3>
                <button
                  onClick={() => setWhatsappModal(false)}
                  className="text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-[0.75rem] text-[#94A3B8] uppercase tracking-[0.1em]">Customer</p>
                  <p className="font-medium text-[#E2E8F0]">{customerInfo?.name}</p>
                </div>
                <div>
                  <p className="text-[0.75rem] text-[#94A3B8] uppercase tracking-[0.1em]">Phone</p>
                  <p className="font-medium text-[#E2E8F0]">{customerInfo?.phone}</p>
                </div>
                <div>
                  <p className="text-[0.75rem] text-[#94A3B8] uppercase tracking-[0.1em]">Outstanding Amount</p>
                  <p className="font-medium text-[#F59E0B]">₹{totalRemaining.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-[#111C2D] p-4 rounded-lg mb-6 border border-[rgba(14,165,233,0.1)]">
                <p className="text-[0.75rem] font-medium text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">Message Preview:</p>
                <div className="text-sm text-[#E2E8F0] bg-[#0F1927] p-3 rounded border border-[rgba(14,165,233,0.06)]">
                  Dear {customerInfo?.name},<br /><br />
                  Your total outstanding amount is Rs. {totalRemaining.toFixed(2)}.<br /><br />
                  Please clear your dues at your earliest convenience.<br /><br />
                  Thank you.
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setWhatsappModal(false)}
                  className="px-4 py-2 border border-[rgba(14,165,233,0.2)] rounded-lg text-sm font-bold text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendWhatsAppMessage}
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Send via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Deposit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1927] rounded-[16px] border border-[rgba(14,165,233,0.1)] w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#E2E8F0] mb-4">
                Update Deposit for Bill {currentBill?.billNumber}
              </h3>
              
              <div className="mb-4">
                <label className="block text-[0.75rem] font-semibold text-[#94A3B8] mb-2 uppercase tracking-[0.1em]">
                  Deposit Amount (₹)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                  min="0"
                  max={currentBill?.grandTotal || 0}
                  step="0.01"
                  className="w-full px-4 py-3 rounded-lg input-glow font-mono text-lg"
                />
              </div>

              <div className="bg-[#111C2D] p-4 rounded-lg mb-6 space-y-2 border border-[rgba(14,165,233,0.1)]">
                <div className="flex justify-between">
                  <span className="text-sm text-[#94A3B8]">Grand Total:</span>
                  <span className="text-sm font-medium text-[#E2E8F0] font-mono">₹{currentBill?.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#94A3B8]">Current Deposit:</span>
                  <span className="text-sm font-medium text-[#0EA5E9] font-mono">₹{(currentBill?.deposit || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#94A3B8]">Remaining:</span>
                  <span className="text-sm font-medium text-[#F59E0B] font-mono">
                    ₹{(currentBill?.grandTotal - (currentBill?.deposit || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditModal(false)}
                  className="px-4 py-2 border border-[rgba(14,165,233,0.2)] rounded-lg text-sm font-bold text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-[#0EA5E9] hover:bg-[#38BDF8] text-[#080C14] rounded-lg text-sm font-bold transition-colors"
                >
                  Update Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1927] rounded-[16px] border border-[rgba(14,165,233,0.1)] w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#E2E8F0]">
                  Transaction History for Bill {currentBill?.billNumber}
                </h3>
                <button
                  onClick={() => setHistoryModal(false)}
                  className="text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {currentBill?.history?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-[#111C2D]">
                      <tr>
                        <th className="px-6 py-3 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Date</th>
                        <th className="px-6 py-3 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Amount (₹)</th>
                        <th className="px-6 py-3 text-left text-[0.75rem] font-bold text-[#94A3B8] uppercase tracking-[0.1em] border-b border-[rgba(14,165,233,0.1)]">Payment Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBill.history.map((transaction, index) => (
                        <tr key={index} className="border-b border-[rgba(14,165,233,0.06)] hover:bg-[rgba(14,165,233,0.04)]">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#94A3B8]">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0EA5E9] font-mono">
                            ₹{transaction.depositHistory.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#94A3B8]">
                            {transaction.paymentMethod}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 mb-4 text-[#475569]">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-[#475569]">No transaction history found</p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setHistoryModal(false)}
                  className="px-4 py-2 border border-[rgba(148,163,184,0.3)] rounded-lg text-sm font-bold text-[#94A3B8] hover:text-[#E2E8F0] hover:border-[rgba(148,163,184,0.5)] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CustomerHistory;