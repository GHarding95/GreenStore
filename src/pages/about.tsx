import React, { useEffect, useState } from 'react';
import MyCarousel from '../components/carousel/myCarousel';
import './about.scss';

const About: React.FC = () => {
  const [ecoProducts, setEcoProducts] = useState(0);
  const [sustainableSourcing, setSustainableSourcing] = useState(0);
  const [happyCustomers, setHappyCustomers] = useState(0);

  useEffect(() => {
    const incrementNumber = (target: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
      let current = 0;
      const interval = setInterval(() => {
        if (current < target) {
          current += Math.ceil(target / 100);
          setter(current);
        } else {
          clearInterval(interval);
        }
      }, 30);
    };

    incrementNumber(5000, setEcoProducts);
    incrementNumber(100, setSustainableSourcing);
    incrementNumber(10000, setHappyCustomers);
  }, []);

  return (
    <div className="about-page">
      <header className="about-page__masthead">
        <p className="about-page__eyebrow">Portfolio project</p>
        <h1>About GreenStore</h1>
      </header>

      <section className="about-page__story" aria-labelledby="about-intro-title">
        <h2 id="about-intro-title" className="visually-hidden">
          About this project
        </h2>
        <p>
          Welcome to <strong>GreenStore!</strong> This is a mock e-commerce website created as part of my web development portfolio.
          Built with React JS and TypeScript, it features a fully mobile-responsive design while ensuring accessibility with WCAG best practices. Users can browse products,
          manage their basket, and experience a seamless shopping interface.
        </p>
      </section>

      <section className="about-page__metrics" aria-label="Project highlights">
        <ul className="about-page__metrics-list">
          <li className="about-page__metric">
            <span className="about-page__metric-value">{ecoProducts}+</span>
            <span className="about-page__metric-label">Eco-friendly products</span>
          </li>
          <li className="about-page__metric">
            <span className="about-page__metric-value">{sustainableSourcing}%</span>
            <span className="about-page__metric-label">Sustainable sourcing</span>
          </li>
          <li className="about-page__metric">
            <span className="about-page__metric-value">{happyCustomers}+</span>
            <span className="about-page__metric-label">Happy customers</span>
          </li>
        </ul>
      </section>

      <section className="about-page__tech" aria-labelledby="about-tech-heading">
        <h2 id="about-tech-heading">Tech stack</h2>
        <p className="about-page__tech-lead">
          Libraries and tools used to build this site.
        </p>
        <div className="about-page__carousel">
          <MyCarousel />
        </div>
      </section>
    </div>
  );
};

export default About;
