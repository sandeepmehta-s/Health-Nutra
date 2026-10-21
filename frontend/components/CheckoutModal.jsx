/**
 * Health Nutra - CheckoutModal Component (Slide-over Right Drawer)
 * Modern right-side slide-over drawer that swipes in from right to left,
 * occupying only the right side of the screen without taking the full page.
 */

function CheckoutModal({
  product,
  initialQty = 1,
  isOpen,
  onClose,
  onOrderCompleted,
}) {
  if (!isOpen || !product) return null;

  const [qty, setQty] = React.useState(initialQty);
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [pincode, setPincode] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState("COD");
  const [submitting, setSubmitting] = React.useState(false);
  const [receipt, setReceipt] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");

  const unitPrice = Number(product.price) || 0;
  const totalPrice = unitPrice * qty;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      setErrorMsg("Please fill in your Name, Phone Number, and Delivery Address.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        unitPrice: unitPrice,
        totalAmount: totalPrice,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        shippingAddress: `${address.trim()}${city ? `, ${city.trim()}` : ""}${pincode ? ` - ${pincode.trim()}` : ""}`,
        city: city ? city.trim() : "",
        pincode: pincode ? pincode.trim() : "",
        paymentMethod: paymentMethod,
        items: [
          {
            productId: product.id,
            name: product.name,
            quantity: qty,
            price: unitPrice,
            unit: product.unit || "Unit",
            image: product.image || "/images/10q.png",
          },
        ],
      };

      const result = await window.apiHelper.createOrder(payload);

      if (result && result.success) {
        const orderData = result.data || result.order || {
          id: result.orderId || "HN-ORD-1",
          customerName: customerName.trim(),
          productName: product.name,
          quantity: qty,
          totalAmount: totalPrice,
          paymentMethod: paymentMethod,
          shippingAddress: payload.shippingAddress,
        };
        setReceipt(orderData);
        if (onOrderCompleted) onOrderCompleted(orderData);
      } else {
        setErrorMsg(result?.message || "Failed to submit order. Please try again.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setReceipt(null);
    setErrorMsg("");
    onClose();
  };

  const dummyFallback = React.useMemo(() => {
    const n = (product?.name || "").toLowerCase();
    const c = (product?.category || "").toLowerCase();
    if (n.includes("9g") || c.includes("multivitamin")) return "/images/9g.png";
    if (n.includes("10q") || c.includes("syrup")) return "/images/10q.png";
    if (n.includes("omega")) return "/images/omega3.png";
    if (n.includes("tea") || c.includes("green")) return "/images/greentea.png";
    return "/images/10q.png";
  }, [product?.name, product?.category]);

  const imageSrc = product.image
    ? product.image.startsWith("http") || product.image.startsWith("/")
      ? product.image
      : `/${product.image}`
    : dummyFallback;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* CSS Animation for smooth right-to-left swipe */}
      <style>{`
        @keyframes slideDrawerFromRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-drawer-slide-in {
          animation: slideDrawerFromRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Dimmed Backdrop (Clicking outside closes drawer) */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleResetAndClose}
      />

      {/* Slide-over panel container on the right side */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-14 pointer-events-none">
        
        {/* Drawer Box: Does not take full page, slides from right to left */}
        <div className="w-screen max-w-md sm:max-w-lg lg:max-w-xl bg-white shadow-2xl flex flex-col h-full pointer-events-auto animate-drawer-slide-in border-l border-slate-200">
          
          {/* Sticky Header */}
          <div className="px-6 py-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80 shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center shadow-xs">
                <Icon name="shopping-bag" className="w-5 h-5 text-[#F97316]" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {receipt ? "Order Confirmed!" : "Direct Formulation Order"}
                </h3>
                <p className="text-xs text-slate-500">
                  {receipt ? `Order #${receipt.id} Placed Successfully` : "Fast dispatch directly from certified store"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              title="Close drawer"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-6 overflow-y-auto flex-grow space-y-6">
            {receipt ? (
              /* Confirmation Receipt View */
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#166534] flex items-center justify-center mx-auto animate-bounce">
                  <Icon name="check-circle" className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-xl font-black text-slate-900">Thank You, {receipt.customerName}!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your order has been placed with Health Nutra. Our dispatch team will verify and ship your medicine promptly.
                  </p>
                </div>

                {/* Receipt Summary Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                    <span className="text-slate-400 font-bold uppercase">Order Reference:</span>
                    <span className="font-black text-slate-900">#{receipt.id}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Formulation:</span>
                    <span className="font-bold text-slate-900">{receipt.productName}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Quantity:</span>
                    <span className="font-bold text-slate-900">{receipt.quantity} {product.unit || "Unit"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Payment Mode:</span>
                    <span className="font-bold text-emerald-700">{receipt.paymentMethod || "Cash on Delivery"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-700">Total Payable:</span>
                    <span className="text-base font-black text-[#166534]">₹{receipt.totalAmount}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    <strong>Delivery to:</strong> {receipt.shippingAddress}
                  </div>
                </div>

                {/* Action Buttons: Download PDF Invoice & Track Order */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.downloadOrderInvoicePDF) {
                        window.downloadOrderInvoicePDF(receipt);
                      }
                    }}
                    className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  >
                    <Icon name="download" className="w-4 h-4" />
                    <span>Download Official PDF Invoice</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const id = receipt.orderId || receipt.id;
                        handleResetAndClose();
                        if (window.onOpenTrackModalWithId) {
                          window.onOpenTrackModalWithId(id);
                        }
                      }}
                      className="py-3 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Icon name="truck" className="w-3.5 h-3.5 text-[#166534]" />
                      <span>Track Status</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetAndClose}
                      className="py-3 rounded-2xl text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] transition-colors cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Order Form View */
              <form onSubmit={handleSubmitOrder} className="space-y-5">
                
                {/* Product Summary Mini Card */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 shrink-0 flex items-center justify-center">
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        ₹{unitPrice} per {product.unit || "Unit"}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 bg-white rounded-xl p-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-xs font-black text-slate-800">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Price Banner */}
                <div className="p-3.5 rounded-xl bg-emerald-100/60 border border-emerald-300 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">
                    Total Price ({qty} {product.unit || "Unit"}):
                  </span>
                  <span className="text-xl font-black text-[#166534]">
                    ₹{totalPrice}
                  </span>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 bg-slate-50/50 hover:bg-white transition-all"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 bg-slate-50/50 hover:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. user@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 bg-slate-50/50 hover:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Complete Shipping Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Flat No., Building, Street Name, Area..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 bg-slate-50/50 hover:bg-white transition-all"
                  ></textarea>
                </div>

                {/* City & Pincode */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Indore"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#166534] bg-slate-50/50 hover:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Pin Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 452010"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#166534] bg-slate-50/50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Payment Option */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-2">
                    Payment Option
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="p-3.5 rounded-xl border-2 border-[#166534] bg-emerald-50/60 flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="text-[#166534] focus:ring-[#166534]"
                      />
                      <span className="text-xs font-bold text-slate-900">Cash on Delivery</span>
                    </label>

                    <label className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between opacity-50 cursor-not-allowed bg-slate-50">
                      <div className="flex items-center gap-2">
                        <input type="radio" disabled name="payment" />
                        <span className="text-xs font-medium text-slate-500">UPI on Delivery</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                        Disabled
                      </span>
                    </label>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600">
                    {errorMsg}
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl text-sm font-black text-white bg-[#166534] hover:bg-[#14532d] shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer transform hover:-translate-y-0.5 active:scale-98"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="check" className="w-4 h-4" />
                      <span>Confirm Order (Pay ₹{totalPrice} on Delivery)</span>
                    </>
                  )}
                </button>

              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.CheckoutModal = CheckoutModal;
}

if (typeof exports !== "undefined") {
  exports.CheckoutModal = CheckoutModal;
}
