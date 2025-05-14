import { useEffect, useState } from 'react';
import { User, Package, Search, ChevronDown, ChevronUp, Filter, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false); 
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const navigate = useNavigate();

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const response = await fetch("https://localhost:7227/api/Order/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        const formattedOrders = data.map((order) => ({
          id: order.id,
          customerName: order.user?.name || 'Unknown',
          email: order.user?.email || 'Unknown',
          orderDate: order.orderDate,
          totalAmount: order.totalAmount ? order.totalAmount.toFixed(2) : '0.00',
          status: order.status,
          items: order.orderItems.map((item) => ({
            bookTitle: item.bookTitle,
            quantity: item.quantity,
            price: item.unitPrice ? item.unitPrice.toFixed(2) : '0.00',
          })),
        }));

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [navigate]);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }

    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toString().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.email.toLowerCase().includes(searchLower) ||
      order.items.some(item => item.bookTitle.toLowerCase().includes(searchLower))
    );
  });

  const formatStatus = (status) => {
    switch (status) {
      case 'Pending':
        return 'Pending confirmation';
      case 'ReadyForPickup':
        return 'Ready for pickup';
      case 'Completed':
        return 'Completed';
      case 'Cancelled':
        return 'Cancelled';
      case 'Approved':
        return 'Approved';
      default:
        return status;
    }
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'Pending confirmation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Ready for pickup':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const cancelOrder = () => {
    if (!selectedOrderId) return;

    const token = localStorage.getItem("accessToken");

    fetch(`https://localhost:7227/api/Order/cancel/${selectedOrderId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        setSuccessMessage(`Order #${selectedOrderId} has been cancelled.`);
        setShowSuccess(true);
        setOrders(orders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: 'Cancelled' } : order
        ));
        setShowCancelModal(false);
      })
      .catch((error) => {
        console.error("Error cancelling order:", error);
      });
  };

  const openAcceptModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowAcceptModal(true); 
  };

  const approveOrder = () => {
    if (!selectedOrderId) return;

    const token = localStorage.getItem("accessToken");

    fetch(`https://localhost:7227/api/Order/approve/${selectedOrderId}`, {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then(() => {
            setSuccessMessage(`Order #${selectedOrderId} has been approved.`);
            setShowSuccess(true);

            setOrders(orders.map((order) =>
            order.id === selectedOrderId ? { ...order, status: 'Approved' } : order
            ));
            setShowAcceptModal(false);
        })
        .catch((error) => {
            console.error("Error approving order:", error);
        });
  };

  const handleLogout = () => 
    {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("Role");
      navigate("/signin");
    };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <div className="w-72 bg-white flex-shrink-0 h-full overflow-y-auto ml-7">
        <div className="flex flex-col items-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="text-gray-500" size={24} />
          </div>
          <div className="mt-2 text-center">
            <div className="font-medium uppercase text-gray-500">Staff</div>
            <div className="text-sm text-gray-500">staff@chapterhouse.com</div>
          </div>
        </div>

        <div className="mt-4 px-4 space-y-2">
          <button
            className="w-full py-3 px-4 text-left rounded font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => navigate('/staff')}
          >
            Order Management
          </button>
          <button
            className="w-full py-3 px-4 text-left rounded font-medium text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pl-0 pr-8 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Order Management</h1>
          </div>

          {showSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
              <Check size={20} className="mr-2" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {filteredOrders.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Package size={48} className="mx-auto mb-4 text-gray-400" />
                <p>No orders found matching your filters.</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border-b border-gray-200 last:border-b-0">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Package className="text-gray-500" size={24} />
                        </div>
                        <div>
                          <div className="font-medium text-black">Order #{order.id}</div>
                          <div className="text-sm text-gray-500">{order.customerName}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right hidden md:block">
                          <div className="text-sm text-gray-900">{order.orderDate}</div>
                          <div className="text-sm text-gray-500">{order.items.length} items</div>
                        </div>

                        <div className="flex-shrink-0">
                          <span className={`px-2 py-1 text-xs rounded-full border ${getStatusBadgeClasses(order.status)}`}>
                            {formatStatus(order.status)}
                          </span>
                        </div>

                        <div className="flex-shrink-0">
                          <div className="text-sm font-medium text-black">${order.totalAmount}</div>
                        </div>

                        <div className="flex-shrink-0">
                          {expandedOrder === order.id ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                        </div>
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="bg-gray-50 p-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Order Details</h3>
                        {order.items.map((item) => (
                          <div key={item.bookTitle}>
                            <p>{item.bookTitle} - {item.quantity} x ${item.price}</p>
                          </div>
                        ))}
                        <div className="mt-4 flex justify-between">
                          <button
                            onClick={() => openCancelModal(order.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                          >
                            Cancel Order
                          </button>
                          <button
                            onClick={() => openAcceptModal(order.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                          >
                            Accept Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Cancel Order</h3>
              <button onClick={() => setShowCancelModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200">
                No, keep order
              </button>
              <button onClick={cancelOrder} className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                Yes, cancel order
              </button>
            </div>
          </div>
        </div>
      )}

      {showAcceptModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Approve Order</h3>
              <button onClick={() => setShowAcceptModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4">Are you sure you want to approve this order?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAcceptModal(false)} className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200">
                No, do not approve
              </button>
              <button onClick={approveOrder} className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                Yes, approve order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
