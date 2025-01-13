/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import Home from '../app/page'; // Adjust the path if necessary
import '@testing-library/jest-dom';

jest.mock('../app/components/UsersList', () => {
  return () => <div>UsersList Component</div>;
});

describe('Home Page', () => {
  it('renders the heading', () => {
    render(<Home />);
    const heading = screen.getByText('User Management System');
    expect(heading).toBeInTheDocument();
  });

  it('renders the UsersList component', () => {
    render(<Home />);
    const usersList = screen.getByText('UsersList Component');
    expect(usersList).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<Home />);
    const message = screen.getByText('Assignment completed by Miko Zagrodzki');
    expect(message).toBeInTheDocument();
  });
});
