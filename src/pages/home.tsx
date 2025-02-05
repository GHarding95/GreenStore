import React from 'react';
import MyCarousel from '../components/carousel/myCarousel';

const Home: React.FC = () => {
  return (
    <>
      <div className='home-container'>         
          <h1>GreenStore</h1>   
      </div>      
      <MyCarousel/>
    </>
  );
};

export default Home;