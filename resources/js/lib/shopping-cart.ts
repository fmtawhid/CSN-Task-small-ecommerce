export type ShoppingCartItem = {
    listingId: number;
    shopId: number;
    shopSlug: string;
    shopName: string;
    productSlug: string;
    productName: string;
    description: string | null;
    thumbnail: string | null;
    price: string;
    quantity: number;
};

const CART_STORAGE_KEY = 'marketplace-cart';
const CART_UPDATED_EVENT = 'marketplace-cart-updated';

export function readShoppingCart(): ShoppingCartItem[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const stored = window.localStorage.getItem(CART_STORAGE_KEY);
        const parsed: unknown = stored ? JSON.parse(stored) : [];

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter((item): item is ShoppingCartItem =>
            typeof item === 'object' &&
            item !== null &&
            Number.isInteger(item.listingId) &&
            Number.isInteger(item.shopId) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            typeof item.shopSlug === 'string' &&
            typeof item.shopName === 'string' &&
            typeof item.productSlug === 'string' &&
            typeof item.productName === 'string' &&
            typeof item.price === 'string',
        );
    } catch {
        return [];
    }
}

export function writeShoppingCart(items: ShoppingCartItem[]): void {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function subscribeToShoppingCart(listener: () => void): () => void {
    if (typeof window === 'undefined') {
        return () => undefined;
    }

    window.addEventListener(CART_UPDATED_EVENT, listener);
    window.addEventListener('storage', listener);

    return () => {
        window.removeEventListener(CART_UPDATED_EVENT, listener);
        window.removeEventListener('storage', listener);
    };
}

export function shoppingCartCount(items: ShoppingCartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
}
