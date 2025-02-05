import React from 'react';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <div className="about-banner">
        <h1>About GreenStore</h1>
      </div>
      <div className="about-content">
        <p>
          Welcome to <strong>GreenStore</strong>! We are a sustainable e-commerce platform committed to providing 
          eco-friendly and ethically sourced products. Our mission is to make green living accessible to everyone 
          while promoting sustainability.
        </p>
        <p>
          Whether you're looking for organic goods, reusable products, or environmentally friendly alternatives, 
          GreenStore is your one-stop shop for a better planet.
        </p>
        <div className="about-stats">
          <div className="stat-box">
            <h3>5000+</h3>
            <p>Eco-friendly products</p>
          </div>
          <div className="stat-box">
            <h3>100%</h3>
            <p>Sustainable sourcing</p>
          </div>
          <div className="stat-box">
            <h3>10,000+</h3>
            <p>Happy customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;