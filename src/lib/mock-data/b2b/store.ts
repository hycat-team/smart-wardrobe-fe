import { create } from 'zustand';
import { mockOrders, mockReturnRequests } from './index';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  imageUrl: string;
  brandId: string;
  brandName: string;
  selected: boolean;
};

type B2BDemoState = {
  cart: CartItem[];
  isCartOpen: boolean;
  orders: typeof mockOrders;
  returnRequests: typeof mockReturnRequests;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  toggleItemSelection: (productId: string, size: string, color: string) => void;
  toggleBrandSelection: (brandId: string, isSelected: boolean) => void;
  toggleAllSelection: (isSelected: boolean) => void;
  clearCart: () => void;
  checkout: () => string; // returns orderId
  setCartOpen: (isOpen: boolean) => void;
  submitReturnRequest: (request: Omit<typeof mockReturnRequests[0], 'id' | 'status' | 'createdAt' | 'timeline'>) => void;
  updateReturnRequestStatus: (requestId: string, status: string) => void;
};

export const useB2BDemoStore = create<B2BDemoState>((set) => ({
  cart: [],
  isCartOpen: false,
  orders: mockOrders,
  returnRequests: mockReturnRequests,

  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find(
        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
      );
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.productId === item.productId && i.size === item.size && i.color === item.color
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
          isCartOpen: true, // Auto open cart when adding
        };
      }
      return { cart: [...state.cart, item], isCartOpen: true };
    }),

  removeFromCart: (productId, size, color) =>
    set((state) => ({
      cart: state.cart.filter(
        (i) => !(i.productId === productId && i.size === size && i.color === color)
      ),
    })),

  updateQuantity: (productId, size, color, quantity) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      ),
    })),

  toggleItemSelection: (productId, size, color) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, selected: !i.selected }
          : i
      ),
    })),

  toggleBrandSelection: (brandId, isSelected) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.brandId === brandId ? { ...i, selected: isSelected } : i
      ),
    })),

  toggleAllSelection: (isSelected) =>
    set((state) => ({
      cart: state.cart.map((i) => ({ ...i, selected: isSelected })),
    })),

  clearCart: () => set({ cart: [] }),

  checkout: () => {
    let orderId = "";
    set((state) => {
      const selectedItems = state.cart.filter(item => item.selected);
      if (selectedItems.length === 0) return state;

      orderId = `order_${Math.random().toString(36).substr(2, 9)}`;

      // Group items by brand for orders if needed, but for now just create one order or multiple
      // We will create one order per brand for simplicity, but here we just keep the original logic for one order
      // However, we just remove the selected items from the cart.

      const newOrder = {
        id: orderId,
        userId: "user_001",
        brandId: selectedItems[0].brandId, // assuming single brand checkout for simplicity in mock
        items: selectedItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        totalAmount: selectedItems.reduce((total, item) => total + item.price * item.quantity, 0),
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };

      return {
        orders: [newOrder, ...state.orders],
        cart: state.cart.filter(item => !item.selected),
        isCartOpen: false,
      };
    });
    return orderId;
  },

  submitReturnRequest: (request) =>
    set((state) => {
      const requestId = `after_sales_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      const newRequest = {
        ...request,
        id: requestId,
        status: "SUBMITTED",
        createdAt: now,
        timeline: [
          {
            status: "SUBMITTED",
            timestamp: now,
          },
        ],
      };
      return {
        returnRequests: [newRequest, ...state.returnRequests],
      };
    }),

  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

  updateReturnRequestStatus: (requestId, status) =>
    set((state) => ({
      returnRequests: state.returnRequests.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status,
            timeline: [
              ...req.timeline,
              { status, timestamp: new Date().toISOString() },
            ],
          };
        }
        return req;
      }),
    })),
}));
