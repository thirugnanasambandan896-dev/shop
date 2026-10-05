import React, { useState } from 'react';
import {
  DollarSign,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle,
  Truck,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OrderStatus, Product } from '../types/shop';

export const MerchantDashboard: React.FC = () => {
  const {
    products,
    orders,
    promos,
    updateOrderStatus,
    adjustStock,
    deleteProduct,
    addProduct,
    setActiveView,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'promos'>('inventory');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<Product['category']>('Living');
  const [newPrice, setNewPrice] = useState(120);
  const [newStock, setNewStock] = useState(15);
  const [newMaterials, setNewMaterials] = useState('');
  const [newOrigin, setNewOrigin] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Calculations for KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const processingOrders = orders.filter((o) => o.status === 'Processing').length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status.toLowerCase() === orderFilter.toLowerCase();
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addProduct({
      name: newTitle,
      subtitle: newSubtitle || 'Artisanal architectural object',
      category: newCategory,
      price: Number(newPrice),
      description: newDescription || 'Crafted with natural materials and architectural precision.',
      materials: newMaterials || 'Solid Brass & Raw Stoneware',
      dimensions: 'Custom dimensions',
      origin: newOrigin || 'Atelier Studio, Europe',
      care: 'Wipe with soft lint-free cloth.',
      stock: Number(newStock),
      image: '/src/assets/images/product_minimalist_lamp_1791180846199.jpg',
      tags: [newCategory, 'Artisanal'],
      variants: [
        { id: 'v1', name: 'Natural Finish', inStock: true },
        { id: 'v2', name: 'Smoked Matte', inStock: true },
      ],
      isNew: true,
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewPrice(120);
    setNewStock(15);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & View Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
            <span>Shopkeeper Control Hub</span>
            <span aria-hidden="true">·</span>
            <span>Live Merchant System</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-stone-900 tracking-tight">
            Store Operations & Inventory
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time management of product catalog, stock levels, fulfillment status, and customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('store')}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            ← View Customer Storefront
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex justify-between items-start text-stone-500">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Sales Revenue</span>
            <DollarSign className="w-4 h-4 text-stone-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-stone-900 font-mono tabular-nums">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Calculated from {totalOrders} customer orders</span>
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex justify-between items-start text-stone-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-stone-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-stone-900 font-mono tabular-nums">
              {totalOrders}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {processingOrders} pending fulfillment
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex justify-between items-start text-stone-500">
            <span className="text-xs font-medium uppercase tracking-wider">Active Catalog</span>
            <Package className="w-4 h-4 text-stone-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-stone-900 font-mono tabular-nums">
              {products.length} Items
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {products.reduce((acc, p) => acc + p.stock, 0)} total units in stock
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex justify-between items-start text-stone-500">
            <span className="text-xs font-medium uppercase tracking-wider">Stock Attention</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockProducts.length > 0 ? 'text-amber-500' : 'text-stone-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-serif text-2xl font-bold font-mono tabular-nums ${lowStockProducts.length > 0 ? 'text-amber-700' : 'text-stone-900'}`}>
              {lowStockProducts.length}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {lowStockProducts.length > 0 ? 'Items below 5 pieces' : 'All inventory healthy'}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-stone-200 flex gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'inventory'
              ? 'text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Inventory & Products ({products.length})
          {activeTab === 'inventory' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-900" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'orders'
              ? 'text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Fulfillment & Orders ({orders.length})
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-900" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('promos')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'promos'
              ? 'text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Promotional Codes ({promos.length})
          {activeTab === 'promos' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-900" />
          )}
        </button>
      </div>

      {/* TAB 1: Inventory & Products */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search catalog items..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-stone-900 focus:outline-none"
              />
            </div>
            <div className="text-xs text-stone-500">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Product Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock In Hand</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-md bg-stone-100 border border-stone-200"
                          />
                          <div>
                            <p className="font-semibold text-stone-900">{p.name}</p>
                            <p className="text-[11px] text-stone-400">{p.origin}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600">{p.category}</td>
                      <td className="py-3 px-4 font-mono font-medium text-stone-900 tabular-nums">
                        ${p.price}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjustStock(p.id, -1)}
                            className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center transition-colors"
                            title="Decrease stock"
                          >
                            -
                          </button>
                          <span
                            className={`font-mono tabular-nums px-2 py-0.5 rounded text-xs font-semibold ${
                              p.stock <= 5
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-800'
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            onClick={() => adjustStock(p.id, 1)}
                            className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center transition-colors"
                            title="Increase stock"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-600 tabular-nums">
                        ★ {p.rating.toFixed(1)} ({p.reviewCount})
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete from catalog"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orders & Fulfillment Operations */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs">
              {['all', 'processing', 'packed', 'shipped', 'delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                    orderFilter === st
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="text-xs text-stone-500">
              {filteredOrders.length} orders shown
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs divide-y divide-stone-100">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-stone-400">
                No orders match this status filter.
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div key={ord.id} className="p-5 space-y-4 hover:bg-stone-50/40 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-stone-900">{ord.id}</span>
                      <span className="text-xs text-stone-400 font-mono">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'Shipped'
                            ? 'bg-sky-100 text-sky-800'
                            : ord.status === 'Packed'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-stone-900 font-mono tabular-nums text-sm">
                        ${ord.total.toFixed(2)}
                      </span>

                      {/* Status advancement buttons */}
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="text-xs bg-stone-50 border border-stone-300 rounded px-2.5 py-1 text-stone-800 focus:outline-none"
                      >
                        <option value="Processing">Mark Processing</option>
                        <option value="Packed">Mark Packed</option>
                        <option value="Shipped">Mark Shipped</option>
                        <option value="Delivered">Mark Delivered</option>
                        <option value="Cancelled">Mark Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600 bg-stone-50/60 p-3 rounded-lg border border-stone-100">
                    <div>
                      <p className="font-semibold text-stone-900">Customer</p>
                      <p>{ord.customerName}</p>
                      <p className="text-stone-500">{ord.customerEmail}</p>
                      <p className="text-stone-500">{ord.customerPhone}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">Destination Address</p>
                      <p>{ord.shippingAddress.street}</p>
                      <p>{ord.shippingAddress.city}, {ord.shippingAddress.zip}</p>
                      <p>{ord.shippingAddress.country}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">Fulfillment Details</p>
                      <p>Carrier: <span className="font-mono">{ord.trackingNumber}</span></p>
                      <p>Payment: <span className="uppercase">{ord.paymentMethod.replace('_', ' ')}</span></p>
                      <p>Est. Arrival: {ord.estimatedDelivery}</p>
                    </div>
                  </div>

                  {/* Order items line */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {ord.items.map((i) => (
                      <span
                        key={i.cartId}
                        className="bg-white border border-stone-200 px-2.5 py-1 rounded text-stone-700"
                      >
                        {i.quantity}× {i.product.name}
                        {i.selectedVariant && ` (${i.selectedVariant})`}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Promotional Codes */}
      {activeTab === 'promos' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <h3 className="font-serif text-lg font-semibold text-stone-900 mb-1">
              Active Store Promotional Vouchers
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Customers can apply these codes in their shopping bag to receive automatic discounts at checkout.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {promos.map((pr) => (
                <div
                  key={pr.code}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-stone-900 text-sm tracking-wider">
                        {pr.code}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-2">{pr.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-200/80 text-[11px] text-stone-500">
                    Min order threshold: ${pr.minSpend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Add Product to Catalog
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Hand-Carved Walnut Stool"
                  className="w-full p-2 border border-stone-300 rounded bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Subtitle / Craft Note</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g. Sculptural solid timber side table"
                  className="w-full p-2 border border-stone-300 rounded bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 rounded bg-white"
                  >
                    <option value="Living">Living</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Audio">Audio</option>
                    <option value="Apothecary">Apothecary</option>
                    <option value="Objects">Objects</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Materials</label>
                  <input
                    type="text"
                    value={newMaterials}
                    onChange={(e) => setNewMaterials(e.target.value)}
                    placeholder="e.g. Solid European Oak"
                    className="w-full p-2 border border-stone-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Provenance / Origin</label>
                  <input
                    type="text"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    placeholder="e.g. Copenhagen, Denmark"
                    className="w-full p-2 border border-stone-300 rounded bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Architectural background, tactile details, acoustic tuning..."
                  className="w-full p-2 border border-stone-300 rounded bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded font-medium hover:bg-stone-800"
                >
                  Publish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
