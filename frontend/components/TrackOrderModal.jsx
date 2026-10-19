/**
 * Health Nutra - TrackOrderModal Component
 * Search order by Order Number and view live real-time status with timeline and PDF download.
 */

function TrackOrderModal({
  isOpen,
  onClose,
  initialOrderId = "",
}) {
  const [searchId, setSearchId] = React.useState(initialOrderId);
  const [orderData, setOrderData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    if (initialOrderId) {
      setSearchId(initialOrderId);
      handleTrack(initialOrderId);
    }
  }, [initialOrderId, isOpen]);

  const handleTrack = async (orderIdToSearch) => {
    const id = (orderIdToSearch || searchId).trim();
    if (!id) {
      setErrorMsg("Please enter an Order ID to search.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setOrderData(null);

    try {
      const res = await window.apiHelper.getOrder(id);
      if (res && res.success && res.data) {
        setOrderData(res.data);
      } else {
        setErrorMsg(res?.message || `No order found with ID "${id}". Please check and try again.`);
      }
    } catch (err) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "cancelled") return -1;
    if (s === "delivered") return 4;
    if (s === "shipped") return 3;
    if (s === "confirmed") return 2;
    return 1; // Pending / Placed
  };

  if (!isOpen) return null;

  const currentStep = orderData ? getStatusStep(orderData.orderStatus || orderData.status) : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 my-8">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shadow-xs">
              <Icon name="truck" className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Track Your Order
              </h3>
              <p className="text-xs text-slate-500">Enter your Order ID to see real-time dispatch & delivery status</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Search Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack(searchId);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Icon name="search" className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. HN-ORD-979838"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-black text-white bg-brand-700 hover:bg-brand-800 shadow-md shadow-brand-700/20 transition-all flex items-center gap-1.5 disabled:opacity-60 shrink-0"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Icon name="arrow-right" className="w-4 h-4" />
                  <span>Track</span>
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 flex items-center gap-2">
              <Icon name="alert-circle" className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Order Details Found */}
          {orderData && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Status Header Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Order Reference</span>
                  <div className="text-base sm:text-lg font-black text-slate-900">#{orderData.orderId || orderData.id}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Placed: {orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : "Recent"}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Current Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                    (orderData.orderStatus || orderData.status) === "Delivered"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : (orderData.orderStatus || orderData.status) === "Cancelled"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : (orderData.orderStatus || orderData.status) === "Shipped"
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-orange-100 text-orange-800 border border-orange-200"
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                    <span>{orderData.orderStatus || orderData.status || "Pending"}</span>
                  </span>
                </div>
              </div>

              {/* Progress Tracker Timeline */}
              {currentStep !== -1 && (
                <div className="py-2">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">
                    Fulfillment Progress
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                    {/* Step 1 */}
                    <div className="space-y-1.5">
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-black ${
                        currentStep >= 1 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                      }`}>
                        ✓
                      </div>
                      <div className={currentStep >= 1 ? "text-emerald-800" : "text-slate-400"}>
                        Order Placed
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-1.5">
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-black ${
                        currentStep >= 2 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                      }`}>
                        {currentStep >= 2 ? "✓" : "2"}
                      </div>
                      <div className={currentStep >= 2 ? "text-emerald-800" : "text-slate-400"}>
                        Confirmed
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-1.5">
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-black ${
                        currentStep >= 3 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                      }`}>
                        {currentStep >= 3 ? "✓" : "3"}
                      </div>
                      <div className={currentStep >= 3 ? "text-emerald-800" : "text-slate-400"}>
                        Shipped
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="space-y-1.5">
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-black ${
                        currentStep >= 4 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                      }`}>
                        {currentStep >= 4 ? "✓" : "4"}
                      </div>
                      <div className={currentStep >= 4 ? "text-emerald-800" : "text-slate-400"}>
                        Delivered
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Information Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">Customer Name:</span>
                  <span className="font-bold text-slate-900">{orderData.customerName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">Formulation Ordered:</span>
                  <span className="font-bold text-slate-900">
                    {orderData.productName || (orderData.items && orderData.items[0]?.name) || "Health Nutra Formulation"}
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">Quantity & Payment:</span>
                  <span className="font-bold text-slate-900">
                    {orderData.quantity || 1} Unit(s) • {orderData.paymentMethod || "COD"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="font-bold text-slate-700">Total Amount:</span>
                  <span className="font-black text-brand-700 text-base">₹{orderData.totalAmount}</span>
                </div>
                {orderData.shippingAddress && (
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <strong>Delivery Address:</strong> {orderData.shippingAddress}
                  </div>
                )}
              </div>

              {/* Action Buttons: Download PDF & Close */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.downloadOrderInvoicePDF && window.downloadOrderInvoicePDF(orderData)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md shadow-orange-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  <Icon name="download" className="w-4 h-4" />
                  <span>Download Official Invoice PDF</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.TrackOrderModal = TrackOrderModal;
}

if (typeof exports !== "undefined") {
  exports.TrackOrderModal = TrackOrderModal;
}

