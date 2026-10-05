import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, PromoCode } from '../types/shop';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PROMOS } from '../data/initialData';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  promos: PromoCode[];
  activePromo: PromoCode | null;
  activeView: 'store' | 'admin' | 'tracking' | 'story';
  setActiveView: (view: 'store' | 'admin' | 'tracking' | 'story') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Cart actions
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Promo actions
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;

  // Order actions
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingNumber' | 'estimatedDelivery'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Admin / Product management
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  addReview: (productId: string, review: { author: string; rating: number; comment: string }) => void;

  // Notification toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('atelier_products_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('atelier_cart_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('atelier_wishlist_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('atelier_orders_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  const [promos] = useState<PromoCode[]>(INITIAL_PROMOS);
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);

  const [activeView, setActiveView] = useState<'store' | 'admin' | 'tracking' | 'story'>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('atelier_products_v1', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('atelier_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_wishlist_v1', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('atelier_orders_v1', JSON.stringify(orders));
  }, [orders]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    const chosenVariant = variant || (product.variants.length > 0 ? product.variants[0].name : undefined);
    const cartId = `${product.id}-${chosenVariant || 'default'}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartId === cartId);
      if (existing) {
        return prev.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { cartId, product, quantity: Math.min(quantity, product.stock), selectedVariant: chosenVariant }];
    });

    showToast(`Added ${product.name} to bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const clamped = Math.min(quantity, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setActivePromo(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const cartDiscount = activePromo && cartSubtotal >= activePromo.minSpend
    ? Math.round(((cartSubtotal * activePromo.discountPercent) / 100) * 100) / 100
    : 0;

  // Free shipping threshold: $150
  const cartShipping = cartSubtotal >= 150 || cartSubtotal === 0 ? 0 : 15;
  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const cartTax = Math.round(taxableAmount * 0.08 * 100) / 100;
  const cartTotal = Math.round((taxableAmount + cartShipping + cartTax) * 100) / 100;

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved items');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Promo handling
  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = promos.find((p) => p.code === clean && p.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired promotional code' };
    }
    if (cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Order must be at least $${found.minSpend} to apply ${clean}`,
      };
    }
    setActivePromo(found);
    return { success: true, message: `Applied ${found.discountPercent}% discount (${found.code})` };
  };

  const removePromo = () => {
    setActivePromo(null);
  };

  // Order placement
  const placeOrder = (
    orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingNumber' | 'estimatedDelivery'>
  ): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `ORD-${randomNum}`;
    const countryPrefix = orderData.shippingAddress.country.substring(0, 2).toUpperCase() || 'AT';
    const tracking = `${countryPrefix}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const deliveryDays = orderData.deliveryMethod === 'express' ? 2 : 4;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + deliveryDays);
    const estimatedDelivery = estDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const newOrder: Order = {
      ...orderData,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'Processing',
      trackingNumber: tracking,
      estimatedDelivery,
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const boughtItem = orderData.items.find((item) => item.product.id === prod.id);
        if (boughtItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - boughtItem.quantity),
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Order ${orderId} updated to ${status}`);
  };

  const getOrderById = (orderId: string) => {
    const clean = orderId.trim().toUpperCase();
    return orders.find((o) => o.id === clean || o.id === `ORD-${clean}`);
  };

  // Product operations for store owner
  const addProduct = (product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => {
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added product "${product.name}"`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
    showToast('Product specifications updated');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog');
  };

  const adjustStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  const addReview = (productId: string, review: { author: string; rating: number; comment: string }) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newReviews = [
            {
              id: `rev-${Date.now()}`,
              author: review.author,
              rating: review.rating,
              date: new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }),
              comment: review.comment,
            },
            ...p.reviews,
          ];
          const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = Math.round((totalRating / newReviews.length) * 10) / 10;
          return {
            ...p,
            reviews: newReviews,
            reviewCount: newReviews.length,
            rating: avgRating,
          };
        }
        return p;
      })
    );
    showToast('Thank you! Your review has been published');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        promos,
        activePromo,
        activeView,
        setActiveView,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        lastPlacedOrder,
        setLastPlacedOrder,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTax,
        cartTotal,
        toggleWishlist,
        isInWishlist,
        applyPromo,
        removePromo,
        placeOrder,
        updateOrderStatus,
        getOrderById,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        addReview,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
