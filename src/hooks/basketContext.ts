import { createContext } from 'react';
import { BasketContextType } from '../types';

const BasketContext = createContext<BasketContextType>({
  cards: [],
  setCards: () => {},
  basketCount: 0,
  setBasketCount: () => {},
});

export default BasketContext;
