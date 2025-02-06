export interface ProductCard { // Renamed from Card as it was conflicting with the Card interface in useFetchData.ts
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
  }