import React, { useState, useEffect } from 'react';
import { ShoppingBag, Phone, MessageCircle, Clock, CheckCircle2, AlertCircle, X, Search, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/admin/Toast';

export default function Orders() {
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter !== 'All' ? `/api/orders?status=${statusFilter}` : '/api/orders';
      const res = await authFetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      addToast('Error fetching orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await authFetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
        addToast(`Order status updated to ${newStatus}`);
      }
    } catch (err) {
      addToast('Error updating status', 'error');
    }
  };

  const getCustomerWhatsAppLink = (order) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `Hi ${order.customer_name}! This is Iniyal's Bake House regarding your brownie order #${order.order_number} (Status: ${order.status}). We are preparing your freshly baked box with love!`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`;
  };

  const statuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    return (
      o.customer_name?.toLowerCase().includes(q) ||
      o.phone?.includes(q) ||
      o.order_number?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900 uppercase">
            Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
            Track and update orders, view customer portions, and contact via direct WhatsApp.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gold-500/30 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-chocolate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, order #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cream-50 border border-gold-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', ...statuses].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-chocolate-900 text-cream-100'
                  : 'bg-cream-100 text-chocolate-700 hover:bg-cream-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gold-500/30 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-chocolate-600">
            <div className="w-8 h-8 border-3 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-chocolate-600">
            <ShoppingBag className="w-10 h-10 text-gold-500/60 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-chocolate-900">No orders found</h3>
            <p className="text-xs text-chocolate-500 mt-1">No orders match the selected filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-100 border-b border-gold-500/30 text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  <th className="py-4 px-5">Order ID</th>
                  <th className="py-4 px-5">Customer</th>
                  <th className="py-4 px-5">Portion / Items</th>
                  <th className="py-4 px-4 text-center">Amount</th>
                  <th className="py-4 px-5 text-center">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/15 text-sm text-chocolate-800">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-50/70 transition-colors">
                    
                    {/* Order ID & Date */}
                    <td className="py-4 px-5">
                      <span className="font-mono text-xs font-bold text-chocolate-900 block">
                        {order.order_number}
                      </span>
                      <span className="text-[11px] text-chocolate-500">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-5">
                      <span className="font-bold text-chocolate-900 block">
                        {order.customer_name}
                      </span>
                      <a
                        href={`tel:+91${order.phone}`}
                        className="text-xs text-caramel-600 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{order.phone}</span>
                      </a>
                    </td>

                    {/* Portion */}
                    <td className="py-4 px-5">
                      <span className="text-xs font-medium text-chocolate-800 block">
                        {order.quantity}
                      </span>
                      {order.notes && (
                        <span className="text-[11px] text-chocolate-500 italic block mt-0.5 line-clamp-1">
                          Note: {order.notes}
                        </span>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-4 text-center font-serif text-base font-bold text-chocolate-900">
                      ₹{order.total_amount}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-5 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none focus:ring-2 focus:ring-caramel-500 ${
                          order.status === 'Pending'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : order.status === 'Confirmed'
                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                            : order.status === 'Preparing'
                            ? 'bg-purple-100 text-purple-900 border-purple-300'
                            : order.status === 'Ready'
                            ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                            : order.status === 'Completed'
                            ? 'bg-green-100 text-green-900 border-green-300'
                            : 'bg-red-100 text-red-900 border-red-300'
                        }`}
                      >
                        {statuses.map(st => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions: Details & WhatsApp Contact */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* WhatsApp Contact Customer Button */}
                        <a
                          href={getCustomerWhatsAppLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                          title="Contact customer via WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Contact</span>
                        </a>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-chocolate-800 rounded-xl text-xs font-semibold border border-gold-500/30 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gold-500/40 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20 mb-4">
              <div>
                <span className="text-xs uppercase font-semibold text-chocolate-500">Order Details</span>
                <h3 className="font-serif text-xl font-bold text-chocolate-900">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg hover:bg-cream-100 text-chocolate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-chocolate-800">
              <div className="grid grid-cols-2 gap-3 bg-cream-50 p-4 rounded-2xl border border-gold-500/20">
                <div>
                  <span className="text-xs text-chocolate-500 block">Customer:</span>
                  <span className="font-bold text-chocolate-900">{selectedOrder.customer_name}</span>
                </div>
                <div>
                  <span className="text-xs text-chocolate-500 block">Phone:</span>
                  <span className="font-bold text-chocolate-900">{selectedOrder.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-chocolate-500 block">Portion / Qty:</span>
                  <span className="font-semibold text-chocolate-800">{selectedOrder.quantity}</span>
                </div>
                <div>
                  <span className="text-xs text-chocolate-500 block">Total Amount:</span>
                  <span className="font-serif text-lg font-bold text-chocolate-900">₹{selectedOrder.total_amount}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <strong>Special Customer Note:</strong> {selectedOrder.notes}
                </div>
              )}

              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                  Update Order Status:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {statuses.map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-colors ${
                        selectedOrder.status === st
                          ? 'bg-chocolate-900 text-cream-100 border-chocolate-900 shadow-xs'
                          : 'bg-cream-50 text-chocolate-700 hover:bg-cream-100 border-gold-500/30'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct WhatsApp Contact Action in Modal */}
              <div className="pt-4 border-t border-gold-500/20 flex justify-end gap-3">
                <a
                  href={getCustomerWhatsAppLink(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Customer on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

    </div>
  );
}
