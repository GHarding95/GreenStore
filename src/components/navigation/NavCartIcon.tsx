import React from 'react';

/** Shopping cart glyph for the nav – uses `currentColor` for theme control */
const NavCartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    focusable="false"
    width="32"
    height="32"
  >
    {/* Push handle (L-bar into cart rim) */}
    <path
      d="M5 13.5V9h4l1 4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Cart body / wire basket */}
    <path
      d="M10 13.5h17l-2 12.2a2 2 0 01-2 1.7h-9.6a2 2 0 01-2-1.7l-2-12.2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Shelf lines */}
    <path
      d="M12.5 17.5h12M13.5 21.5h10"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      opacity="0.38"
    />
    {/* Wheels */}
    <circle cx="13" cy="26.5" r="2.75" stroke="currentColor" strokeWidth="2" />
    <circle cx="22" cy="26.5" r="2.75" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default NavCartIcon;
