import { setLocalStorage } from "@/lib/localStorageHandle";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ICartVariant {
  id: string;
  name: string;
  price: number;
}

export interface ICartOption {
  id: string;
  name: string;
  price: number;
}

export interface ICartProduct {
  /** Unique cart-item ID (crypto.randomUUID()) */
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  variant?: ICartVariant;
  options?: ICartOption[];
  note?: string;
  basePrice: number;
}

/** Delivery zone selected during checkout. Stored, never derived. */
export interface ICartDeliveryZone {
  id: string;
  name: string;
  deliveryPrice: number;
  minimumOrder: number;
  estimatedTimeMin: number;
  estimatedTimeMax: number;
}

/** Dine-in table established by the QR entry flow. Stored, never derived. */
export interface ICartTable {
  id: string;
  number: string;
}

interface ICartState {
  items: ICartProduct[];
  deliveryZone: ICartDeliveryZone | null;
  /** Dine-in table context established by scanning a QR code. */
  table: ICartTable | null;
  /** Applied discounts (future: coupons) — an input, not a derived value. */
  discount: number;
  /** Tax input (flat amount today). */
  tax: number;
}

interface IPersistedCart {
  items: ICartProduct[];
  deliveryZone: ICartDeliveryZone | null;
  table: ICartTable | null;
}

const persist = (
  items: ICartProduct[],
  deliveryZone: ICartDeliveryZone | null,
  table: ICartTable | null,
) => {
  const payload: IPersistedCart = { items, deliveryZone, table };
  setLocalStorage(JSON.stringify(payload));
};

// Always start empty so server and client render identical markup on mount;
// real cart data is hydrated client-side via `hydrateCart` after mount.
const initialState: ICartState = {
  items: [],
  deliveryZone: null,
  table: null,
  discount: 0,
  tax: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ICartProduct>) => {
      const incoming = action.payload;
      const existingIdx = state.items.findIndex(
        (item) =>
          item.productId === incoming.productId &&
          item.variant?.id === incoming.variant?.id &&
          JSON.stringify((item.options ?? []).map((o) => o.id).sort()) ===
            JSON.stringify((incoming.options ?? []).map((o) => o.id).sort()),
      );

      if (existingIdx !== -1) {
        state.items[existingIdx].quantity += incoming.quantity;
      } else {
        state.items.push(incoming);
      }

      persist(state.items, state.deliveryZone, state.table);
    },

    /** Replace an existing item by its cart id (used by Edit flow). */
    updateItem: (state, action: PayloadAction<ICartProduct>) => {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
        persist(state.items, state.deliveryZone, state.table);
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persist(state.items, state.deliveryZone, state.table);
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity += 1;
        persist(state.items, state.deliveryZone, state.table);
      }
    },

    /** Decrease quantity. Removes the item if it reaches 0. */
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const idx = state.items.findIndex((i) => i.id === action.payload);
      if (idx !== -1) {
        if (state.items[idx].quantity <= 1) {
          state.items.splice(idx, 1);
        } else {
          state.items[idx].quantity -= 1;
        }
        persist(state.items, state.deliveryZone, state.table);
      }
    },

    /** Select / change the checkout delivery zone. */
    setDeliveryZone: (state, action: PayloadAction<ICartDeliveryZone>) => {
      state.deliveryZone = action.payload;
      persist(state.items, state.deliveryZone, state.table);
    },

    /** Remove the delivery zone selection (cart emptied, etc). */
    clearDeliveryZone: (state) => {
      state.deliveryZone = null;
      persist(state.items, state.deliveryZone, state.table);
    },

    /** Set the active dine-in table from the QR entry flow. */
    setDineInTable: (state, action: PayloadAction<ICartTable>) => {
      state.table = action.payload;
      state.deliveryZone = null;
      persist(state.items, state.deliveryZone, state.table);
    },

    /** Clear the active dine-in table. */
    clearDineInTable: (state) => {
      state.table = null;
      persist(state.items, state.deliveryZone, state.table);
    },

    /** Clear the entire cart. */
    clearCart: (state) => {
      state.items = [];
      state.deliveryZone = null;
      state.table = null;
      persist([], null, null);
    },

    /**
     * Load persisted cart state client-side, after mount (avoids SSR/CSR
     * mismatch). Supports the legacy shape (bare items array) so carts saved
     * before the Delivery System upgrade still hydrate.
     */
    hydrateCart: (
      state,
      action: PayloadAction<IPersistedCart | ICartProduct[]>,
    ) => {
      const payload = action.payload;
      if (Array.isArray(payload)) {
        state.items = payload;
        state.deliveryZone = null;
        state.table = null;
      } else {
        state.items = payload.items ?? [];
        state.deliveryZone = payload.deliveryZone ?? null;
        state.table = payload.table ?? null;
      }
    },
  },
});

export const {
  addItem,
  updateItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  setDeliveryZone,
  clearDeliveryZone,
  setDineInTable,
  clearDineInTable,
  clearCart,
  hydrateCart,
} = cartSlice.actions;

export default cartSlice.reducer;
