import { render, screen } from '@testing-library/react';
import App from './App';

test('renders chat interface', () => {
  render(<App />);
  const chatElement = screen.getByTestId('chat-interface');
  expect(chatElement).toBeInTheDocument();
}); 