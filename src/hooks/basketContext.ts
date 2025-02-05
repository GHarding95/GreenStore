import { createContext } from 'react';
import { BasketContextType } from '../types';

const BasketContext = createContext<BasketContextType>({
  cards: [],
  setCards: () => {},
});

export default BasketContext;