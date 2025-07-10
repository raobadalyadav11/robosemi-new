import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  description?: string;
  discount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'staff';
}

interface StoreState {
  // Hydration state
  _hasHydrated: boolean;
  _setHasHydrated: (hasHydrated: boolean) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;

  // Wishlist
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // User
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: () => boolean;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filters
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Hydration state
      _hasHydrated: false,
      _setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),

      // Cart
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          const finalPrice = item.discount 
            ? item.price * (1 - item.discount / 100)
            : item.price;
          return total + finalPrice * item.quantity;
        }, 0);
      },
      getCartItemsCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Wishlist
      wishlist: [],
      addToWishlist: (product) =>
        set((state) => {
          if (!state.wishlist.find((item) => item.id === product.id)) {
            return { wishlist: [...state.wishlist, product] };
          }
          return state;
        }),
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        })),
      isInWishlist: (productId) => {
        const { wishlist } = get();
        return wishlist.some((item) => item.id === productId);
      },
      clearWishlist: () => set({ wishlist: [] }),

      // User
      user: null,
      setUser: (user) => set({ user }),
      isAuthenticated: () => {
        const { user } = get();
        return user !== null;
      },

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Filters
      selectedCategory: '',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      priceRange: [0, 10000],
      setPriceRange: (range) => set({ priceRange: range }),
      sortBy: 'newest',
      setSortBy: (sort) => set({ sortBy: sort }),
    }),
    {
      name: 'robosemi-store',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    }
  )
);
