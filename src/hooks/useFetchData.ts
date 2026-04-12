import { useState, useEffect, useCallback } from 'react';
import { ProductCard } from '../types';

const CACHE_KEY = 'cachedProducts';

const PRODUCTS_QUERY_URL =
  'https://mock.shop/api?query={products(first:%2020){edges%20{node%20{id%20title%20description%20featuredImage%20{id%20url}%20variants(first:%203){edges%20{node%20{price%20{amount%20currencyCode}}}}}}}}';

function isValidStoredProduct(x: unknown): x is Record<string, unknown> {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.title === 'string' &&
    o.title.trim().length > 0 &&
    typeof o.imageSrc === 'string' &&
    typeof o.price === 'number' &&
    Number.isFinite(o.price) &&
    typeof o.currency === 'string' &&
    o.currency.length > 0
  );
}

function normalizeProduct(o: Record<string, unknown>): ProductCard {
  return {
    imageSrc: String(o.imageSrc ?? ''),
    title: String(o.title ?? ''),
    text: typeof o.text === 'string' ? o.text : '',
    price: typeof o.price === 'number' && Number.isFinite(o.price) ? o.price : 0,
    currency: String(o.currency ?? 'USD'),
    quantity: typeof o.quantity === 'number' && Number.isFinite(o.quantity) ? o.quantity : 0,
  };
}

/** Returns products if cache is usable; otherwise null (caller may clear bad keys). */
function parseProductCache(raw: string | null): ProductCard[] | null {
  if (raw == null || raw === '') return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    if (!parsed.every(isValidStoredProduct)) return null;
    return parsed.map((item) => normalizeProduct(item as Record<string, unknown>));
  } catch {
    return null;
  }
}

function safeRemoveCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* private mode / quota */
  }
}

function safeSetCache(cards: ProductCard[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cards));
  } catch {
    /* private mode / quota — app still works without persistence */
  }
}

interface UseFetchDataResult {
  cards: ProductCard[];
  setCards: React.Dispatch<React.SetStateAction<ProductCard[]>>;
  productsError: string | null;
  productsLoading: boolean;
  refetchProducts: (options?: { skipCache?: boolean }) => Promise<void>;
}

async function fetchProductsFromApi(): Promise<ProductCard[]> {
  const request = await fetch(PRODUCTS_QUERY_URL);
  if (!request.ok) {
    throw new Error(`Request failed (${request.status})`);
  }

  const response = await request.json();
  const products = response?.data?.products?.edges ?? [];

  return products.map((edge: { node: Record<string, unknown> }) => {
    const node = edge.node;
    const variants = node.variants as
      | { edges?: Array<{ node?: { price?: { amount?: string; currencyCode?: string } } }> }
      | undefined;
    const priceNode = variants?.edges?.[0]?.node?.price;

    return {
      imageSrc: String((node.featuredImage as { url?: string } | undefined)?.url ?? ''),
      title: String(node.title ?? ''),
      text: typeof node.description === 'string' ? node.description : '',
      price: parseFloat(String(priceNode?.amount ?? '0')) || 0,
      currency: String(priceNode?.currencyCode ?? 'USD'),
      quantity: 0,
    };
  });
}

const useFetchData = (): UseFetchDataResult => {
  const [cards, setCards] = useState<ProductCard[]>([]);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);

  const loadProducts = useCallback(async (options?: { skipCache?: boolean }) => {
    const skipCache = options?.skipCache === true;

    if (!skipCache) {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        const fromCache = parseProductCache(raw);
        if (fromCache !== null) {
          setCards(fromCache);
          setProductsError(null);
          setProductsLoading(false);
          return;
        }
        if (raw !== null && raw !== '') {
          safeRemoveCache();
        }
      } catch {
        safeRemoveCache();
      }
    } else {
      safeRemoveCache();
    }

    setProductsError(null);
    setProductsLoading(true);

    try {
      const fetched = await fetchProductsFromApi();
      if (fetched.length === 0) {
        throw new Error('No products returned from the catalog.');
      }
      setCards(fetched);
      safeSetCache(fetched);
    } catch (err) {
      console.error('Error fetching product catalog:', err);
      setProductsError(
        'We could not load products. Check your connection and try again.'
      );
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const refetchProducts = useCallback(
    async (options?: { skipCache?: boolean }) => {
      await loadProducts({ skipCache: options?.skipCache ?? true });
    },
    [loadProducts]
  );

  return { cards, setCards, productsError, productsLoading, refetchProducts };
};

export default useFetchData;
