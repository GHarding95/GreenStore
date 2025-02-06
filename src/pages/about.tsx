import React, { useEffect, useState } from 'react';

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
    <div className="about-container" role="main">
      <div className="about-banner">
        <h1>About GreenStore</h1>
      </div>
      <div className="about-content">
        <p>
          Welcome to <strong>GreenStore!</strong> This is a mock e-commerce website created as part of my web development portfolio. 
          Built with React JS and TypeScript, it features a fully mobile-responsive design while ensuring accessibility with WCAG best practices. Users can browse products, 
          manage their basket, and experience a seamless shopping interface.
        </p>
        <div className="about-stats">
          <div className="stat-box">
            <h3>{ecoProducts}+ </h3>
            <p>Eco-friendly products</p>
          </div>
          <div className="stat-box">
            <h3>{sustainableSourcing}% </h3>
            <p>Sustainable sourcing</p>
          </div>
          <div className="stat-box">
            <h3>{happyCustomers}+ </h3>
            <p>Happy customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
