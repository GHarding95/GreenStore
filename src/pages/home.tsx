import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faSeedling, faHeart } from '@fortawesome/free-solid-svg-icons';
import './home.scss';

const Home: React.FC = () => {
  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-hero-heading">
        <div className="home-hero__inner">
          <p className="home-hero__eyebrow">Fresh · Sustainable · Local</p>
          <h1 id="home-hero-heading">Nature-first shopping, made simple.</h1>
          <p className="home-hero__lead">
            GreenStore brings together thoughtfully sourced goods and a calm, modern experience—so you can shop with confidence and care for the planet.
          </p>
          <div className="home-hero__actions">
            <Link className="home-btn home-btn--primary" to="/products">
              Shop products
            </Link>
            <Link className="home-btn home-btn--ghost" to="/about">
              Our story
            </Link>
          </div>
        </div>
      </section>

      <section className="home-values" aria-labelledby="values-heading">
        <h2 id="values-heading" className="home-values__title">
          Why GreenStore
        </h2>
        <div className="home-values__grid">
          <article
            className="home-values__item"
            aria-labelledby="value-heading-sourcing"
            aria-describedby="value-desc-sourcing"
          >
            <div className="home-values__icon" aria-hidden>
              <FontAwesomeIcon icon={faLeaf} />
            </div>
            <h3 id="value-heading-sourcing">Responsible sourcing</h3>
            <p id="value-desc-sourcing">
              We prioritize suppliers who share our commitment to ethical and sustainable practices.
            </p>
          </article>
          <article
            className="home-values__item"
            aria-labelledby="value-heading-quality"
            aria-describedby="value-desc-quality"
          >
            <div className="home-values__icon" aria-hidden>
              <FontAwesomeIcon icon={faSeedling} />
            </div>
            <h3 id="value-heading-quality">Quality you can feel</h3>
            <p id="value-desc-quality">
              Every item is chosen for durability and everyday use—fewer replacements, less waste.
            </p>
          </article>
          <article
            className="home-values__item"
            aria-labelledby="value-heading-community"
            aria-describedby="value-desc-community"
          >
            <div className="home-values__icon" aria-hidden>
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <h3 id="value-heading-community">Community minded</h3>
            <p id="value-desc-community">
              Built as a portfolio showcase with accessibility and real e-commerce patterns in mind.
            </p>
          </article>
        </div>
      </section>

      <section className="home-band" aria-labelledby="band-heading">
        <div className="home-band__inner">
          <h2 id="band-heading">Shop the collection</h2>
          <p>
            Browse the full catalog, search by name or description, and add items to your basket—same flow you know, wrapped in a refreshed look.
          </p>
          <Link className="home-btn home-btn--primary" to="/products">
            Browse all products
          </Link>
        </div>
      </section>

      <section className="home-steps" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="home-steps__title">
          How it works
        </h2>
        <div className="home-steps__row">
          <div className="home-steps__step">
            <div className="home-steps__num" aria-hidden>
              1
            </div>
            <h3>Explore</h3>
            <p>Scroll the grid or use search to find what you need.</p>
          </div>
          <div className="home-steps__step">
            <div className="home-steps__num" aria-hidden>
              2
            </div>
            <h3>Customize</h3>
            <p>Open a product, set quantity, and add it to your basket.</p>
          </div>
          <div className="home-steps__step">
            <div className="home-steps__num" aria-hidden>
              3
            </div>
            <h3>Checkout</h3>
            <p>Review your basket and complete your demo order.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
