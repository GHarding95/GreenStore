export interface ProductCard {
  imageSrc: string;
  title: string;
  text: string;
  price: number;
  currency: string;
  quantity: number;
}

export interface BasketContextType {
  cards: ProductCard[];
  setCards: React.Dispatch<React.SetStateAction<ProductCard[]>>;
  basketCount: number;
  setBasketCount: React.Dispatch<React.SetStateAction<number>>;
  productsError: string | null;
  productsLoading: boolean;
  refetchProducts: (options?: { skipCache?: boolean }) => Promise<void>;
}