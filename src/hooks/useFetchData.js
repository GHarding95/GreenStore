import { useState, useEffect } from 'react';

const useFetchData = () => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

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
        const fetchedCards = products.map((product) => ({
          imageSrc: product.node.featuredImage?.url,
          title: product.node.title,
          text: product.node.description,
          price: product.node.variants.edges[0]?.node.price.amount, 
          currency: product.node.variants.edges[0]?.node.price.currencyCode 
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
