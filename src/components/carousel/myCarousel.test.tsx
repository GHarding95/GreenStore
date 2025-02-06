import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyCarousel from './myCarousel'

describe('MyCarousel', () => {
  it('renders all icon names correctly', () => {
    render(<MyCarousel />);
    
    // Test for presence of icons in first slide
    expect(screen.getByText('HTML5')).toBeInTheDocument();
    expect(screen.getByText('CSS3')).toBeInTheDocument();
    expect(screen.getByText('React JS')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('applies bounce effect on hover', () => {
    render(<MyCarousel />);
    
    // Find the HTML5 icon container
    const html5Container = screen.getByText('HTML5').parentElement;
    expect(html5Container).toBeTruthy();

    if (html5Container) {
      // Check initial state (no bounce class)
      expect(html5Container.className).not.toContain('fa-bounce');

      // Trigger hover
      fireEvent.mouseEnter(html5Container);
      expect(html5Container.className).toContain('fa-bounce');

      // Remove hover
      fireEvent.mouseLeave(html5Container);
      expect(html5Container.className).not.toContain('fa-bounce');
    }
  });
});