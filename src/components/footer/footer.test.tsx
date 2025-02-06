import { render, screen } from '@testing-library/react';
import App from '../../App';
import { describe, test, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock the Navigation component to avoid external dependency issues
vi.mock('../../components/navigation/navigation', () => ({
  default: () => <div>Mock Navigation</div>,
}));

describe('Footer Integration Test', () => {
  test('renders the footer within the App component', () => {
    // Render the App component wrapped in BrowserRouter
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Check if the footer is rendered with the correct role
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();

    // Check if the current year is displayed in the footer
    const currentYear = new Date().getFullYear();
    const yearText = screen.getByText(`© ${currentYear} Glen Harding`);
    expect(yearText).toBeInTheDocument();
  });
});