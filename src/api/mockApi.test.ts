import { CheckoutData, Plan, Subscription } from '../types';

// Mock axios before importing mockApi
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  return {
    create: jest.fn(() => mockAxiosInstance),
    __mockAxiosInstance: mockAxiosInstance, // Export for access in tests
  };
});

// Now import mockApi after mocking axios
import { mockApi } from './mockApi';
import axios from 'axios';

// Get the mock instance for use in tests
const mockAxiosInstance = (axios as any).__mockAxiosInstance;

describe('mockApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlans', () => {
    it('should return all plans successfully', async () => {
      const mockPlans: Plan[] = [
        {
          id: 'basic',
          name: 'Basic Plan',
          description: 'Perfect for individuals getting started',
          monthlyPrice: 9.99,
          features: ['Up to 5 projects', '10GB storage', 'Email support'],
        },
        {
          id: 'pro',
          name: 'Pro Plan',
          description: 'Ideal for growing teams and businesses',
          monthlyPrice: 29.99,
          popular: true,
          features: ['Unlimited projects', '100GB storage', 'Priority support'],
        },
      ];

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockPlans });

      const result = await mockApi.getPlans();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/plans');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPlans);
      expect(result.message).toBe('Plans fetched successfully');
    });

    it('should handle errors when fetching plans', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await mockApi.getPlans();

      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.message).toBe('Failed to fetch plans');
    });
  });

  describe('getPlanById', () => {
    it('should return specific plan when found', async () => {
      const mockPlan: Plan = {
        id: 'basic',
        name: 'Basic Plan',
        description: 'Perfect for individuals getting started',
        monthlyPrice: 9.99,
        features: ['Up to 5 projects', '10GB storage', 'Email support'],
      };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockPlan });

      const result = await mockApi.getPlanById('basic');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/plans/basic');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPlan);
      expect(result.message).toBe('Plan found');
    });

    it('should return null when plan not found', async () => {
      const error = { response: { status: 404 } };
      mockAxiosInstance.get.mockRejectedValueOnce(error);

      const result = await mockApi.getPlanById('nonexistent');

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
      const mockPlan: Plan = {
        id: 'basic',
        name: 'Basic Plan',
        description: 'Perfect for individuals getting started',
        monthlyPrice: 9.99,
        features: ['Up to 5 projects', '10GB storage', 'Email support'],
      };

      const mockSubscription: Subscription = {
        id: 'sub_123',
        planId: 'basic',
        userId: 'user_123',
        status: 'active',
        startDate: new Date().toISOString(),
        plan: mockPlan,
      };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockPlan });
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockSubscription });

      const result = await mockApi.subscribeToPlan(mockCheckoutData);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/plans/basic');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/subscriptions',
        expect.objectContaining({
          planId: 'basic',
          userId: 'user_123',
          status: 'active',
          plan: mockPlan,
        })
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSubscription);
      expect(result.message).toBe('Subscription created successfully');
    });

    it('should fail when plan does not exist', async () => {
      const error = { response: { status: 404 } };
      mockAxiosInstance.get.mockRejectedValueOnce(error);

      const result = await mockApi.subscribeToPlan(mockCheckoutData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Plan not found');
    });
  });

  describe('getUserSubscriptions', () => {
    it('should return user subscriptions', async () => {
      const mockSubscriptions: Subscription[] = [];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockSubscriptions });

      const result = await mockApi.getUserSubscriptions();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/subscriptions?userId=user_123'
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSubscriptions);
      expect(result.message).toBe('Subscriptions fetched successfully');
    });

    it('should handle errors when fetching subscriptions', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await mockApi.getUserSubscriptions();

      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.message).toBe('Failed to fetch subscriptions');
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription successfully', async () => {
      const mockSubscription: Subscription = {
        id: 'sub_123',
        planId: 'basic',
        userId: 'user_123',
        status: 'active',
        startDate: new Date().toISOString(),
        plan: {} as Plan,
      };

      const cancelledSubscription = {
        ...mockSubscription,
        status: 'cancelled',
        endDate: new Date().toISOString(),
      };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockSubscription });
      mockAxiosInstance.put.mockResolvedValueOnce({
        data: cancelledSubscription,
      });

      const result = await mockApi.cancelSubscription('sub_123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/subscriptions/sub_123'
      );
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/subscriptions/sub_123',
        expect.objectContaining({
          status: 'cancelled',
          endDate: expect.any(String),
        })
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe('Subscription cancelled successfully');
    });

    it('should return error for non-existent subscription', async () => {
      const error = { response: { status: 404 } };
      mockAxiosInstance.get.mockRejectedValueOnce(error);

      const result = await mockApi.cancelSubscription('nonexistent');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Subscription not found');
    });
  });
});
