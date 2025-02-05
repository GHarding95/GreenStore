import { useState, useEffect } from 'react';
import { ProductCard } from '../types';

interface UseFetchDataResult {
  cards: ProductCard[];
  setCards: React.Dispatch<React.SetStateAction<ProductCard[]>>;
  error: string | null;
}

const useFetchData = (): UseFetchDataResult => {
  const [cards, setCards] = useState<ProductCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = await fetch(
          'https://mock.shop/api?query={products(first:%2020){edges%20{node%20{id%20title%20description%20featuredImage%20{id%20url}%20variants(first:%203){edges%20{node%20{price%20{amount%20currencyCode}}}}}}}}'
        );

        if (!request.ok) {
          throw new Error('Failed to fetch data');
        }

        const response = await request.json();
        const products = response?.data?.products?.edges || [];

        // Map API response to the ProductCard type
        const fetchedCards: ProductCard[] = products.map((product: any) => ({
          imageSrc: product.node.featuredImage?.url ?? "",
          title: product.node.title,
          text: product.node.description,
          price: parseFloat(product.node.variants.edges[0]?.node.price.amount) || 0, // Ensure price is a number
          currency: product.node.variants.edges[0]?.node.price.currencyCode || "USD",
        }));

        setCards(fetchedCards);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  return { cards, setCards, error };
};

export default useFetchData;
