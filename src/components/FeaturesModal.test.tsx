import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeaturesModal from './FeaturesModal';
import { Plan } from '../types';

const mockPlan: Plan = {
  id: 'test-plan',
  name: 'Test Plan',
  description: 'A comprehensive test plan',
  monthlyPrice: 29.99,
  features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
};

describe('FeaturesModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when plan is null', () => {
    const { container } = render(
      <FeaturesModal
        open={true}
        plan={null}
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when plan is provided and modal is open', () => {
    render(
      <FeaturesModal
        open={true}
        plan={mockPlan}
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
      />
    );

    expect(screen.getByText('Test Plan')).toBeInTheDocument();
    expect(screen.getByText('$29.99/month')).toBeInTheDocument();
    expect(screen.getByText('A comprehensive test plan')).toBeInTheDocument();
    expect(screen.getByText('All Features Included:')).toBeInTheDocument();
  });

  it('displays all features in the modal', () => {
    render(
      <FeaturesModal
        open={true}
        plan={mockPlan}
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
      />
    );

    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
    expect(screen.getByText('Feature 4')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <FeaturesModal
        open={true}
        plan={mockPlan}
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
      />
    );

    fireEvent.click(screen.getByText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubscribe and onClose when subscribe button is clicked', () => {
    render(
      <FeaturesModal
        open={true}
        plan={mockPlan}
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
      />
    );

    fireEvent.click(screen.getByText('Subscribe to Test Plan'));
    expect(mockOnSubscribe).toHaveBeenCalledWith('test-plan');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close icon is clicked', () => {
    render(
      <FeaturesModal
        open={true}
        plan={mockPlan}
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
      />
    );

    // Find the close icon button
    const closeIcon = screen.getByRole('button', { name: '' });
    fireEvent.click(closeIcon);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when modal is closed', () => {
    render(
      <FeaturesModal
        open={false}
        plan={mockPlan}
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
      />
    );

    expect(screen.queryByText('Test Plan')).not.toBeInTheDocument();
  });
});
