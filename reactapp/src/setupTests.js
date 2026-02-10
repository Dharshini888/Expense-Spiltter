// src/setupTests.js

import '@testing-library/jest-dom';



// Mock fetch globally for all tests

global.fetch = jest.fn();

