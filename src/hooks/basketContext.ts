import { createContext } from 'react';
import { BasketContextType } from '../types';

const BasketContext = createContext<BasketContextType>({
  cards: [],
  setCards: () => {},
  basketCount: 0,
  setBasketCount: () => {},
  productsError: null,
  productsLoading: true,
  refetchProducts: async () => {},
});

export default BasketContext;
