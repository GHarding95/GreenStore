import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHtml5,
  faCss3,
  faBootstrap,
  faReact,
  faFontAwesome,
  faGithub,
  faGoogle,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons';
import tsLogo from '../../assets/ts-logo.png'; 
import { Container, Carousel } from 'react-bootstrap';
import './myCarousel.css';

interface Icon {
  icon: IconDefinition | string; // FontAwesome icon (IconDefinition) or image path (string)
  name: string;
  color: string;
  type: 'fa' | 'img'; // Type to differentiate between FontAwesome icons and images
}

// Define the icon data array with the Icon type
const iconData: Icon[] = [
  { icon: faHtml5, name: 'HTML5', color: '#e34c26', type: 'fa' },
  { icon: faCss3, name: 'CSS3', color: '#2965f1', type: 'fa' },
  { icon: faReact, name: 'React JS', color: '#61dafb', type: 'fa' },
  { icon: tsLogo, name: 'TypeScript', color: '#007aac', type: 'img' },
  { icon: faBootstrap, name: 'Bootstrap', color: '#563d7c', type: 'fa' },
  { icon: faGithub, name: 'Github', color: '#000000', type: 'fa' },
  { icon: faFontAwesome, name: 'Font Awesome', color: '#183153', type: 'fa' },
  { icon: faGoogle, name: 'Google', color: '#DB4437', type: 'fa' },
];

const MyCarousel: React.FC = () => {
  // Define the type for the hoveredIcon state
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  // Define the type for the handleIconHover function
  const handleIconHover = (iconName: string | null) => {
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
                    <FontAwesomeIcon icon={icon as IconDefinition} size="4x" style={{ color }} />
                  ) : (
                    <img src={icon as string} alt={name} className="ts-icon" />
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

  return <Container>{renderIcons()}</Container>;
};

export default MyCarousel;