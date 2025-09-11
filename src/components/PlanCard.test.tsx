import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlanCard from './PlanCard';
import { Plan } from '../types';

const mockPlan: Plan = {
  id: 'test-plan',
  name: 'Test Plan',
  description: 'A test plan for unit testing',
  monthlyPrice: 19.99,
  features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
};

const mockPopularPlan: Plan = {
  ...mockPlan,
  popular: true,
};

describe('PlanCard', () => {
  const mockOnViewFeatures = jest.fn();
  const mockOnSubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders plan information correctly', () => {
    render(
      <PlanCard
        plan={mockPlan}
        onViewFeatures={mockOnViewFeatures}
        onSubscribe={mockOnSubscribe}
      />
    );

    expect(screen.getByText('Test Plan')).toBeInTheDocument();
    expect(
      screen.getByText('A test plan for unit testing')
    ).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('/month')).toBeInTheDocument();
  });

  it('displays popular badge when plan is popular', () => {
    render(
      <PlanCard
        plan={mockPopularPlan}
        onViewFeatures={mockOnViewFeatures}
        onSubscribe={mockOnSubscribe}
      />
    );

    expect(screen.getByText('Most Popular')).toBeInTheDocument();
  });

  it('does not display popular badge when plan is not popular', () => {
    render(
      <PlanCard
        plan={mockPlan}
        onViewFeatures={mockOnViewFeatures}
        onSubscribe={mockOnSubscribe}
      />
    );

    expect(screen.queryByText('Most Popular')).not.toBeInTheDocument();
  });

  it('displays first 3 features', () => {
    render(
      <PlanCard
        plan={mockPlan}
        onViewFeatures={mockOnViewFeatures}
        onSubscribe={mockOnSubscribe}
      />
    );

    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
  });

  it('shows "more features" text when plan has more than 3 features', () => {
    render(
      <PlanCard
        plan={mockPlan}
        onViewFeatures={mockOnViewFeatures}
        onSubscribe={mockOnSubscribe}
      />
    );

    expect(screen.getByText('+2 more features')).toBeInTheDocument();
  });

  it('calls onViewFeatures when "View All Features" button is clicked', () => {
    render(
      <PlanCard
        plan={mockPlan}
        onViewFeatures={mockOnViewFeatures}
        onSubscribe={mockOnSubscribe}
      />
    );

    fireEvent.click(screen.getByText('View All Features'));
    expect(mockOnViewFeatures).toHaveBeenCalledWith(mockPlan);
  });

  it('calls onSubscribe when "Subscribe Now" button is clicked', () => {
    render(
      <PlanCard
        plan={mockPlan}
        onViewFeatures={mockOnViewFeatures}
        onSubscribe={mockOnSubscribe}
      />
    );

    fireEvent.click(screen.getByText('Subscribe Now'));
    expect(mockOnSubscribe).toHaveBeenCalledWith('test-plan');
  });

  it('disables buttons when loading', () => {
    render(
      <PlanCard
        plan={mockPlan}
        onViewFeatures={mockOnViewFeatures}
        onSubscribe={mockOnSubscribe}
        isLoading={true}
      />
    );

    expect(screen.getByText('View All Features')).toBeDisabled();
    expect(screen.getByText('Subscribe Now')).toBeDisabled();
  });

  it('enables buttons when not loading', () => {
    render(
      <PlanCard
        plan={mockPlan}
        onViewFeatures={mockOnViewFeatures}
        onSubscribe={mockOnSubscribe}
        isLoading={false}
      />
    );

    expect(screen.getByText('View All Features')).not.toBeDisabled();
    expect(screen.getByText('Subscribe Now')).not.toBeDisabled();
  });
});
