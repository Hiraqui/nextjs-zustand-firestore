// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import "whatwg-fetch";

import {
  TextEncoder as NodeTextEncoder,
  TextDecoder as NodeTextDecoder,
} from "util";

// Jest 30 + jsdom 26 compatibility: Setup global TextEncoder/TextDecoder
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = NodeTextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = NodeTextDecoder;
}

// Also setup for globalThis (modern standard)
if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = NodeTextEncoder;
}

if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = NodeTextDecoder;
}

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  ...jest.requireActual("firebase/app"),
  initializeServerApp: jest.requireActual("firebase/app").initializeApp,
}));

// Ignore emulators options in .env
process.env.NEXT_PUBLIC_EMULATOR = undefined;

// Mock motion/react-client to avoid module resolution issues
jest.mock("motion/react-client", () => {
  const mockMotion = {
    div: "div",
    span: "span",
    button: "button",
    form: "form",
    input: "input",
    h1: "h1",
    h2: "h2",
    p: "p",
    footer: "footer",
    main: "main",
    header: "header",
    section: "section",
    article: "article",
    nav: "nav",
    aside: "aside",
  };

  const AnimatePresence = ({ children }) => children;

  return {
    motion: mockMotion,
    AnimatePresence,
    // Also export everything as named exports for `import * as motion` pattern
    ...mockMotion,
  };
});

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
}));

// Mock Next.js image
jest.mock("next/image", () => {
  return function Image({ src, alt, ...props }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  };
});

// Increase timeout for async operations
jest.setTimeout(15000);
