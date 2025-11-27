// Jest setup file for testing library
require('@testing-library/jest-dom')

// Mock window.alert for jsdom
global.alert = jest.fn()
