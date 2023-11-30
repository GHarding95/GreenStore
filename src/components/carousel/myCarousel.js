import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3, faBootstrap, faReact, faFontAwesome, faGithub, faGoogle, faWindows } from '@fortawesome/free-brands-svg-icons';
import { Container, Carousel } from 'react-bootstrap';
import './myCarousel.css';

const iconData = [
  { icon: faHtml5, name: 'HTML5', color: '#e34c26' },
  { icon: faCss3, name: 'CSS3', color: '#2965f1' },
  { icon: faBootstrap, name: 'Bootstrap', color: '#563d7c' },
  { icon: faReact, name: 'React JS', color: '#61dafb' },
  { icon: faGithub, name: 'Github', color: '#000000' },
  { icon: faFontAwesome, name: 'Font Awesome', color: '#183153' },
  { icon: faGoogle, name: 'Google', color: '#DB4437' },
  { icon: faWindows, name: 'Windows', color: '#0078D6' }
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
        <Carousel.Item>
          <div className="icons-wrapper">
            {firstSlideIcons.map(({ icon, name, color }) => (
              <div
                key={name}
                className={`icon ${hoveredIcon === name ? 'fa-bounce' : ''}`}
                onMouseEnter={() => handleIconHover(name)}
                onMouseLeave={() => handleIconHover(null)}
              >
                <FontAwesomeIcon icon={icon} size="4x" style={{ color }} />
                <p>{name}</p>
              </div>
            ))}
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="icons-wrapper">
            {secondSlideIcons.map(({ icon, name, color }) => (
              <div
                key={name}
                className={`icon ${hoveredIcon === name ? 'fa-bounce' : ''}`}
                onMouseEnter={() => handleIconHover(name)}
                onMouseLeave={() => handleIconHover(null)}
              >
                <FontAwesomeIcon icon={icon} size="4x" style={{ color }} />
                <p>{name}</p>
              </div>
            ))}
          </div>
        </Carousel.Item>
      </Carousel>
    );
  };

  return (
    <Container>
      {renderIcons()}
    </Container>
  );
}
