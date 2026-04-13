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

/**
 * Sets `body[data-route]`, scrolls to top, and clears focus on route changes so the next Tab
 * targets the first focusable in document order (the skip link). Otherwise focus stays on the
 * clicked nav link and Tab skips past the skip control.
 */
const RouteTracker: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    document.body.dataset.route = location.pathname;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const id = window.requestAnimationFrame(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body) {
        active.blur();
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [location.pathname]);
  return null;
};

function readStoredBasketCount(): number {
  try {
    const stored = localStorage.getItem('basketCount');
    if (stored) {
      const n = parseInt(stored, 10);
      return Number.isFinite(n) ? n : 0;
    }
  } catch {
    /* localStorage unavailable */
  }
  return 0;
}

const App: React.FC = () => {
  const { cards, setCards, productsError, productsLoading, refetchProducts } = useFetchData();
  const [count, setCount] = useState<number>(readStoredBasketCount);

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
        <>
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
      </BasketContext.Provider>
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;
