import React, { useState, useEffect } from 'react';
import './App.scss';
import 'typeface-poppins';
import Navigation from './components/navigation/navigation';
import Footer from './components/footer/footer';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Products from './pages/products';
import Basket from './pages/basket';
import About from './pages/about';
import useFetchData from './hooks/useFetchData';
import BasketContext from './hooks/basketContext';

const App: React.FC = () => {
  const { cards, setCards } = useFetchData();
  const [count, setCount] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const storedCount = localStorage.getItem('basketCount');
    if (storedCount) {
      setCount(parseInt(storedCount, 10));
    }
    setIsInitialized(true);
  }, []);

  return (
    <div className="App">
      <BasketContext.Provider value={{ cards, setCards, basketCount: count, setBasketCount: setCount }}>
        {isInitialized && (
          <>
            <Navigation count={count} setCount={setCount} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products setCount={setCount} />} />
              <Route path="/about" element={<About />} />
              <Route path="/basket" element={<Basket setCount={setCount} />} /> {/* Pass setCount here */}
            </Routes>
            <Footer />
          </>
        )}
      </BasketContext.Provider>
    </div>
  );
};

export default App;
