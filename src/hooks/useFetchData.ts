import { useState, useEffect, useCallback } from 'react';
import { ProductCard } from '../types';

const PRODUCTS_GRAPHQL = `{
  products(first: 20) {
    edges {
      node {
        id
        title
        description
        featuredImage { id url }
        variants(first: 3) {
          edges {
            node {
              price { amount currencyCode }
            }
          }
        }
      }
    }
  }
}`;

function mapApiEdgesToCards(
  edges: Array<{ node: Record<string, unknown> }>
): ProductCard[] {
  return edges.map((edge) => {
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

/** mock.shop requires POST + JSON body; GET + query string returns 405. */
async function fetchLiveCatalog(): Promise<ProductCard[]> {
  const res = await fetch('https://mock.shop/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: PRODUCTS_GRAPHQL }),
  });
  if (!res.ok) throw new Error(String(res.status));

  const body = await res.json();
  if (body.errors?.length) {
    throw new Error(body.errors.map((e: { message?: string }) => e.message).join('; '));
  }

  const edges = body?.data?.products?.edges ?? [];
  const cards = mapApiEdgesToCards(edges);
  if (cards.length === 0) throw new Error('Empty catalog');
  return cards;
}

interface UseFetchDataResult {
  cards: ProductCard[];
  setCards: React.Dispatch<React.SetStateAction<ProductCard[]>>;
  productsError: string | null;
  productsLoading: boolean;
  refetchProducts: (options?: { skipCache?: boolean }) => Promise<void>;
}

const useFetchData = (): UseFetchDataResult => {
  const [cards, setCards] = useState<ProductCard[]>([]);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setProductsError(null);
    setProductsLoading(true);
    try {
      const live = await fetchLiveCatalog();
      setCards(live);
    } catch (err) {
      console.error('Could not load product catalog:', err);
      setCards([]);
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

  const refetchProducts = useCallback(async (_options?: { skipCache?: boolean }) => {
    await loadProducts();
  }, [loadProducts]);

  return { cards, setCards, productsError, productsLoading, refetchProducts };
};

export default useFetchData;
