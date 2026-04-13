import React from 'react';

/** WCAG 2.4.1 bypass block — first tab stop (used in Navigation on all routes). */
const SkipToMain: React.FC = () => {
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const main = document.getElementById('main-content');
    if (!main) return;
    e.preventDefault();
    main.focus({ preventScroll: false });
    main.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  return (
    <a href="#main-content" className="skip-link" onClick={handleClick}>
      Skip to main content
    </a>
  );
};

export default SkipToMain;
