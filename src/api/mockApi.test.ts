// Mock axios to avoid import issues
jest.mock('axios', () => ({
  create: jest.fn(() => ({})),
}));

import { mockApi } from './mockApi';
import { CheckoutData } from './../types';

// Mock setTimeout to avoid actual delays in tests
jest.useFakeTimers();

describe('mockApi', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('getPlans', () => {
    it('should return all plans successfully', async () => {
      const promise = mockApi.getPlans();

      // Fast-forward time to resolve the delay
      jest.advanceTimersByTime(1000);

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(3);
      expect(result.data[0].name).toBe('Basic Plan');
      expect(result.data[1].name).toBe('Pro Plan');
      expect(result.data[2].name).toBe('Enterprise Plan');
      expect(result.message).toBe('Plans fetched successfully');
    });

    it('should include popular flag for Pro plan', async () => {
      const promise = mockApi.getPlans();
      jest.advanceTimersByTime(1000);
      const result = await promise;

      const proPlan = result.data.find((plan) => plan.id === 'pro');
      expect(proPlan?.popular).toBe(true);

      const basicPlan = result.data.find((plan) => plan.id === 'basic');
      expect(basicPlan?.popular).toBeUndefined();
    });
  });

  describe('getPlanById', () => {
    it('should return specific plan when found', async () => {
      const promise = mockApi.getPlanById('basic');
      jest.advanceTimersByTime(1000);
      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('basic');
      expect(result.data?.name).toBe('Basic Plan');
      expect(result.data?.monthlyPrice).toBe(9.99);
      expect(result.message).toBe('Plan found');
    });

    it('should return null when plan not found', async () => {
      const promise = mockApi.getPlanById('nonexistent');
      jest.advanceTimersByTime(1000);
      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.message).toBe('Plan not found');
    });
  });

  describe('subscribeToPlan', () => {
    const mockCheckoutData: CheckoutData = {
      planId: 'basic',
      cardNumber: '1234567890123456',
      expiryDate: '12/25',
      cvv: '123',
      cardholderName: 'John Doe',
      billingAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'US',
      },
    };

    it('should create subscription successfully', async () => {
      const promise = mockApi.subscribeToPlan(mockCheckoutData);
      jest.advanceTimersByTime(1000);
      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.data.planId).toBe('basic');
      expect(result.data.userId).toBe('user_123');
      expect(result.data.status).toBe('active');
      expect(result.data.plan.name).toBe('Basic Plan');
      expect(result.message).toBe('Subscription created successfully');
    });

    it('should fail when plan does not exist', async () => {
      const invalidCheckoutData = { ...mockCheckoutData, planId: 'invalid' };
      const promise = mockApi.subscribeToPlan(invalidCheckoutData);
      jest.advanceTimersByTime(1000);
      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.message).toBe('Plan not found');
    });
  });

  describe('getUserSubscriptions', () => {
    it('should return user subscriptions', async () => {
      const promise = mockApi.getUserSubscriptions();
      jest.advanceTimersByTime(1000);
      const result = await promise;

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.message).toBe('Subscriptions fetched successfully');
    });
  });

  describe('cancelSubscription', () => {
    it('should return error for non-existent subscription', async () => {
      const promise = mockApi.cancelSubscription('nonexistent');
      jest.advanceTimersByTime(1000);
      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.message).toBe('Subscription not found');
    });
  });
});
