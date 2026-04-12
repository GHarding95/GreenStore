import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add custom matchers
expect.extend(matchers);

// jsdom does not implement scrollTo (used by RouteTracker on navigation)
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

// Cleanup after each test
afterEach(() => {
  cleanup();
});