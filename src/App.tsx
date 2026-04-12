import React, { useState, useEffect } from 'react';
import './App.scss';
import 'typeface-poppins';
import Navigation from './components/navigation/navigation';
import Footer from './components/footer/footer';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Products from './pages/products';
import Basket from './pages/basket';
import About from './pages/about';
import useFetchData from './hooks/useFetchData';
import BasketContext from './hooks/basketContext';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

/** Sets `body[data-route]` and scrolls to top on navigation (React Router preserves scroll by default). */
const RouteTracker: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    document.body.dataset.route = location.pathname;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);
  return null;
};

const App: React.FC = () => {
  const { cards, setCards, productsError, productsLoading, refetchProducts } = useFetchData();
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
      <RouteTracker />
      <BasketContext.Provider
        value={{
          cards,
          setCards,
          basketCount: count,
          setBasketCount: setCount,
          productsError,
          productsLoading,
          refetchProducts,
        }}
      >
        {isInitialized && (
          <>
            <a href="#main-content" className="skip-link" tabIndex={1}>
              Skip to main content
            </a>
            <Navigation count={count} setCount={setCount} />
            <main id="main-content" tabIndex={-1}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/basket" element={<Basket setCount={setCount} />} />
              </Routes>
            </main>
            <Footer />
          </>
        )}
      </BasketContext.Provider>
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;
