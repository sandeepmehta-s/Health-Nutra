/**
 * Health Nutra - CheckoutModal Component
 * Full checkout workflow with instant quantity adjustment, delivery address, and order receipt.
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
    if (n.includes("omega") || c.includes("omega")) return "/images/omega3.png";
    if (n.includes("tea") || c.includes("green")) return "/images/greentea.png";
    return "/images/10q.png";
  }, [product?.name, product?.category]);

  const imageSrc = product.image
    ? product.image.startsWith("http") || product.image.startsWith("/")
      ? product.image
      : `/${product.image}`
    : dummyFallback;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleResetAndClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 my-8">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-orange-50 text-accent-600 flex items-center justify-center shadow-xs">
              <Icon name="shopping-bag" className="w-5 h-5" />
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
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {receipt ? (
            /* Confirmation Receipt View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
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
                  <span className="text-base font-black text-brand-700">₹{receipt.totalAmount}</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  <strong>Delivery to:</strong> {receipt.shippingAddress}
                </div>
              </div>

              {/* Action Buttons: Download PDF Invoice, Track Order, and Continue */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.downloadOrderInvoicePDF) {
                      window.downloadOrderInvoicePDF(receipt);
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
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
                    className="py-3 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Icon name="truck" className="w-3.5 h-3.5 text-brand-700" />
                    <span>Track Status</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="py-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Order Entry Form */
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              
              {/* Product preview & Qty selector */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white p-2 border border-slate-200 flex items-center justify-center shrink-0">
                    <img src={imageSrc} alt={product.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">{product.name}</h4>
                    <div className="text-xs text-brand-700 font-bold mt-0.5">
                      ₹{unitPrice} <span className="text-slate-400 font-normal">/ {product.unit || "Unit"}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-black text-slate-900">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-xs">
                <span className="font-bold text-emerald-900">Total Price ({qty} {product.unit || "unit"}):</span>
                <span className="text-base font-black text-emerald-800">₹{totalPrice}</span>
              </div>

              {/* Form Fields */}
              <div className="space-y-3.5">
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/10"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/10"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/10"
                    />
                  </div>
                </div>

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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/10"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Pin Code
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 110001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/10"
                    />
                  </div>
                </div>

                {/* Payment Option */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                    Payment Option
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                      paymentMethod === "COD" ? "border-brand-600 bg-brand-50 text-brand-900" : "border-slate-200 text-slate-600"
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="text-brand-600"
                      />
                      <span>Cash on Delivery</span>
                    </label>

                    <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                      paymentMethod === "UPI" ? "border-brand-600 bg-brand-50 text-brand-900" : "border-slate-200 text-slate-600"
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="UPI"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                        className="text-brand-600"
                      />
                      <span>UPI on Delivery</span>
                    </label>
                  </div>
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
                className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-brand-700 to-emerald-800 hover:from-brand-800 hover:to-emerald-900 shadow-md shadow-brand-800/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
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
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.CheckoutModal = CheckoutModal;
}

if (typeof exports !== "undefined") {
  exports.CheckoutModal = CheckoutModal;
}
