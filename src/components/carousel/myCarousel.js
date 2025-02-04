import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3, faBootstrap, faReact, faFontAwesome, faGithub, faGoogle, } from '@fortawesome/free-brands-svg-icons';
import tsLogo from "../../assets/ts-logo.png";
import { Container, Carousel } from 'react-bootstrap';
import './myCarousel.css';

const iconData = [
  { icon: faHtml5, name: 'HTML5', color: '#e34c26', type: 'fa' },
  { icon: faCss3, name: 'CSS3', color: '#2965f1', type: 'fa' },
  { icon: faReact, name: 'React JS', color: '#61dafb', type: 'fa' },
  { icon: tsLogo, name: 'TypeScript', color: '#007aac', type: 'img' },
  { icon: faBootstrap, name: 'Bootstrap', color: '#563d7c', type: 'fa' },
  { icon: faGithub, name: 'Github', color: '#000000', type: 'fa' },
  { icon: faFontAwesome, name: 'Font Awesome', color: '#183153', type: 'fa' },
  { icon: faGoogle, name: 'Google', color: '#DB4437', type: 'fa' },
];

export default function MyCarousel() {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleIconHover = (iconName) => {
    setHoveredIcon(iconName);
  };

  const renderIcons = () => {
    const firstSlideIcons = iconData.slice(0, 4);
    const secondSlideIcons = iconData.slice(4);
  
    return (
      <Carousel indicators={false}>
        {[firstSlideIcons, secondSlideIcons].map((slideIcons, index) => (
          <Carousel.Item key={index}>
            <div className="icons-wrapper">
              {slideIcons.map(({ icon, name, color, type }) => (
                <div
                  key={name}
                  className={`icon ${hoveredIcon === name ? 'fa-bounce' : ''}`}
                  onMouseEnter={() => handleIconHover(name)}
                  onMouseLeave={() => handleIconHover(null)}
                >
                  {type === 'fa' ? (
                    <FontAwesomeIcon icon={icon} size="4x" style={{ color }} />
                  ) : (
                    <img src={icon} alt={name} className="ts-icon" />
                  )}
                  <p>{name}</p>
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  };
  

  return (
    <Container>
      {renderIcons()}
    </Container>
  );
}
