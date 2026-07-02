import React, { useState, useMemo } from 'react';
import {
  Store, ShoppingCart, Search, MapPin,
  Plus, Check, X, ArrowRight, BarChart3,
  Sliders, ShieldCheck, TrendingUp, Package,
  Clock, Users, Truck, Star, ChevronRight,
  Bell, Settings, LogOut, Menu
} from 'lucide-react';

// --- PRODUCTION COMPONENT CONFIGURATION DATA ---
const INITIAL_STORES = [
  { id: 1, name: "Sharma Kirana & Provisions", distance: "0.2 km", address: "Ghatkopar West, Block C", rating: "4.8", orders: 234 },
  { id: 2, name: "Gupta Fresh Fruits & Veg", distance: "0.5 km", address: "Station Road, Lane 4", rating: "4.6", orders: 189 },
  { id: 3, name: "Balaji Daily Needs", distance: "0.9 km", address: "Metro Avenue, Shop 12", rating: "4.9", orders: 312 }
];

const INITIAL_PRODUCTS = [
  { id: 1, name: "Premium Full Cream Milk (1L)", price: 66, category: "Dairy", img: "🥛", stock: true },
  { id: 2, name: "Fresh Whole Wheat Bread", price: 45, category: "Daily Essentials", img: "🍞", stock: true },
  { id: 3, name: "Organic Local Bananas (1 Dozen)", price: 60, category: "Fruits & Vegetables", img: "🍌", stock: true },
  { id: 4, name: "Crunchy Potato Wafers (Large)", price: 30, category: "Snacks", img: "🥔", stock: true },
  { id: 5, name: "Farm Fresh Eggs (Pack of 6)", price: 50, category: "Dairy", img: "🥚", stock: true },
  { id: 6, name: "A2 Desi Cow Milk (500ml)", price: 55, category: "Dairy", img: "🥛", stock: true },
  { id: 7, name: "Organic Spinach Bundle", price: 35, category: "Fruits & Vegetables", img: "🥬", stock: false },
  { id: 8, name: "Whole Wheat Atta (5kg)", price: 280, category: "Daily Essentials", img: "🌾", stock: true },
  { id: 9, name: "Fresh Tomatoes (1 kg)", price: 40, category: "Fruits & Vegetables", img: "🍅", stock: true },
  { id: 10, name: "Masoor Dal (1 kg)", price: 120, category: "Daily Essentials", img: "🫘", stock: true },
  { id: 11, name: "Britannia Good Day Biscuits", price: 25, category: "Snacks", img: "🍪", stock: true },
  { id: 12, name: "Fresh Onions (1 kg)", price: 30, category: "Fruits & Vegetables", img: "🧅", stock: true }
];

const INITIAL_ORDERS = [
  { id: "ORD-9921", customer: "Rahul Mehta", address: "Flat 402, Shivam Residency", items: "Milk (1L) x2, Wheat Bread x1", total: 177, status: "Pending", time: "10 min ago" },
  { id: "ORD-9920", customer: "Anjali Desai", address: "Bungalow 7, Garden Colony", items: "Fresh Eggs x1, Organic Bananas x1", total: 110, status: "Delivered", time: "2 hours ago" },
  { id: "ORD-9919", customer: "Vikram Singh", address: "Shop 5, Market Complex", items: "Dal x2, Onions x1, Tomatoes x1", total: 280, status: "In Transit", time: "25 min ago" },
  { id: "ORD-9918", customer: "Priya Sharma", address: "Apt 3B, Green View", items: "Milk x1, Bread x1, Eggs x1", total: 161, status: "Delivered", time: "5 hours ago" }
];

const CATEGORIES = ['All', 'Dairy', 'Daily Essentials', 'Fruits & Vegetables', 'Snacks'];

export default function App() {
  const [currentView, setCurrentView] = useState<'customer' | 'shopkeeper'>('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<typeof INITIAL_PRODUCTS>([]);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<typeof INITIAL_STORES[0] | null>(null);

  // --- FORM STATES FOR MERCHANTS ---
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCat, setNewProdCat] = useState('Daily Essentials');

  // --- CORE SYSTEM COMPUTATIONS ---
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }, [cart]);

  const orderStats = useMemo(() => {
    const pending = orders.filter(o => o.status === 'Pending').length;
    const inTransit = orders.filter(o => o.status === 'In Transit').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const revenue = orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.total, 0);
    return { pending, inTransit, delivered, revenue };
  }, [orders]);

  // --- CORE SYSTEM HANDLERS ---
  const handleAddToCart = (product: typeof INITIAL_PRODUCTS[0]) => {
    setCart([...cart, product]);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const handleCheckout = () => {
    const newOrder = {
      id: `ORD-${9922 + orders.length}`,
      customer: "You",
      address: "Your Current Location",
      items: cart.map(c => c.name).join(', '),
      total: cartTotal,
      status: "Pending",
      time: "Just now"
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const handleToggleStock = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: !p.stock } : p));
  };

  const handleUpdateOrderStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    const newProduct = {
      id: products.length + 1,
      name: newProdName,
      price: parseFloat(newProdPrice),
      category: newProdCat,
      img: "📦",
      stock: true
    };
    setProducts([newProduct, ...products]);
    setNewProdName('');
    setNewProdPrice('');
    setIsProductModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">

      {/* --- GLOBAL APPLICATION HEADER --- */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-600/30">
              <Store className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">Wyrd <span className="text-emerald-600">Shop</span></span>
              <div className="text-[9px] font-bold text-emerald-600 tracking-widest uppercase">Zero Commission Network</div>
            </div>
          </div>

          {/* VIEW SWITCHER */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentView('customer')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 ${currentView === 'customer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Consumer
            </button>
            <button
              onClick={() => setCurrentView('shopkeeper')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 ${currentView === 'shopkeeper' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Merchant
            </button>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center space-x-3">
            {currentView === 'customer' ? (
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="relative bg-slate-900 text-white p-2.5 rounded-xl hover:bg-slate-800 transition-colors duration-150 shadow-md shadow-slate-900/10"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse-soft">
                    {cart.length}
                  </span>
                )}
              </button>
            ) : (
              <div className="hidden md:flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-emerald-700 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Node</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- CONSUMER INTERFACE --- */}
      {currentView === 'customer' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
          {/* HERO SEARCH */}
          <div className="mb-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-xs uppercase tracking-widest mb-3">
                <MapPin className="w-4 h-4" />
                <span>Hyperlocal Network - Mumbai</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 leading-tight">Direct Access to Local Retailers With Zero Platform Fees</h1>
              <p className="text-slate-400 text-sm mb-6 max-w-lg">Shop fresh from neighborhood stores. Support local businesses. Pay no extra charges.</p>
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search fresh groceries from your neighborhood shops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 placeholder-slate-400 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all whitespace-nowrap border ${selectedCategory === category ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* PRODUCTS */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center space-x-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <span>Available Local Essentials</span>
              </h2>

              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-medium text-sm">
                  No products found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product, idx) => (
                    <div
                      key={product.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-200 group animate-slideUp"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-3xl">{product.img}</div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${product.stock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                          {product.stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1 text-sm leading-tight">{product.name}</h3>
                      <p className="text-xs text-slate-400 mb-3">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-extrabold text-emerald-600">₹{product.price}</span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.stock}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${product.stock ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* NEARBY STORES */}
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center space-x-2">
                <Store className="w-5 h-5 text-emerald-600" />
                <span>Nearby Stores</span>
              </h2>
              <div className="space-y-3">
                {INITIAL_STORES.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">{store.name}</h3>
                      <div className="flex items-center space-x-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-xs font-bold">{store.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-bold">{store.distance}</span>
                      <span className="text-slate-400">{store.orders} orders</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- MERCHANT INTERFACE --- */}
      {currentView === 'shopkeeper' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{orderStats.pending}</p>
              <p className="text-xs text-slate-500 mt-1">Pending Orders</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <Truck className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">In Progress</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{orderStats.inTransit}</p>
              <p className="text-xs text-slate-500 mt-1">In Transit</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <Check className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Completed</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{orderStats.delivered}</p>
              <p className="text-xs text-slate-500 mt-1">Delivered Today</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 border border-emerald-600 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-200" />
                <span className="text-xs font-bold text-emerald-200 bg-emerald-600/50 px-2 py-0.5 rounded-full">Today</span>
              </div>
              <p className="text-2xl font-extrabold">₹{orderStats.revenue}</p>
              <p className="text-xs text-emerald-200 mt-1">Total Revenue</p>
            </div>
          </div>

          {/* ORDERS TABLE */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="font-bold text-slate-900 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <span>Recent Orders</span>
              </h2>
              <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 uppercase tracking-wide">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="text-left px-5 py-3">Order ID</th>
                    <th className="text-left px-5 py-3">Customer</th>
                    <th className="text-left px-5 py-3 hidden sm:table-cell">Items</th>
                    <th className="text-left px-5 py-3">Total</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">{order.id}</td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{order.customer}</p>
                          <p className="text-xs text-slate-400">{order.time}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 hidden sm:table-cell max-w-xs truncate">{order.items}</td>
                      <td className="px-5 py-4 font-bold text-emerald-600">₹{order.total}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                          order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {order.status !== 'Delivered' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, order.status === 'Pending' ? 'In Transit' : 'Delivered')}
                            className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                          >
                            {order.status === 'Pending' ? 'Dispatch' : 'Complete'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PRODUCT MANAGEMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  <span>Inventory Management</span>
                </h2>
                <button
                  onClick={() => setIsProductModalOpen(true)}
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="text-left px-5 py-3">Product</th>
                      <th className="text-left px-5 py-3">Category</th>
                      <th className="text-left px-5 py-3">Price</th>
                      <th className="text-left px-5 py-3">Stock</th>
                      <th className="text-left px-5 py-3">Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {products.slice(0, 8).map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{product.img}</span>
                            <span className="font-medium text-slate-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs">{product.category}</td>
                        <td className="px-5 py-4 font-bold text-emerald-600">₹{product.price}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${product.stock ? 'text-emerald-600 bg-emerald-100' : 'text-red-600 bg-red-100'}`}>
                            {product.stock ? 'Available' : 'Out'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggleStock(product.id)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${product.stock ? 'bg-emerald-500' : 'bg-slate-300'}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${product.stock ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* QUICK STATS */}
            <div>
              <h2 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <span>Quick Stats</span>
              </h2>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Total Products</span>
                  <span className="font-bold text-slate-900">{products.length}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-600">In Stock</span>
                  <span className="font-bold text-emerald-600">{products.filter(p => p.stock).length}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Out of Stock</span>
                  <span className="font-bold text-red-500">{products.filter(p => !p.stock).length}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-slate-600">Total Orders</span>
                  <span className="font-bold text-slate-900">{orders.length}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- CART DRAWER --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)} />
          <div className="relative w-full max-w-md bg-white shadow-2xl animate-slideLeft overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-5 flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-900">Your Cart</h2>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Your cart is empty</p>
                <p className="text-sm text-slate-400 mt-2">Add items from nearby stores to get started</p>
              </div>
            ) : (
              <>
                <div className="p-5 space-y-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4 bg-slate-50 rounded-xl p-3">
                      <span className="text-2xl">{item.img}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">{item.name}</p>
                        <p className="text-emerald-600 font-bold text-sm">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(idx)}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-600 font-medium">Total</span>
                    <span className="text-2xl font-extrabold text-emerald-600">₹{cartTotal}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2"
                  >
                    <span>Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-3">Zero platform fees - Support local shops directly</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* --- ADD PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-900">Add New Product</h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Product Name</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Category</label>
                <select
                  value={newProdCat}
                  onChange={(e) => setNewProdCat(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option>Dairy</option>
                  <option>Daily Essentials</option>
                  <option>Fruits & Vegetables</option>
                  <option>Snacks</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Price (₹)</label>
                <input
                  type="number"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold uppercase tracking-wide hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 mt-6"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- STORE DETAIL MODAL --- */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedStore(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-scaleIn">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
                  <Store className="w-6 h-6" />
                </div>
                <button
                  onClick={() => setSelectedStore(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <h2 className="font-bold text-xl text-slate-900 mb-2">{selectedStore.name}</h2>
              <div className="flex items-center space-x-1 text-amber-500 mb-4">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold">{selectedStore.rating}</span>
                <span className="text-slate-400 text-sm">({selectedStore.orders} orders)</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-slate-600">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>{selectedStore.address}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600">
                  <Truck className="w-4 h-4 text-emerald-500" />
                  <span>{selectedStore.distance} from your location</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStore(null)}
                className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                View Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
