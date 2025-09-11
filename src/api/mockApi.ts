import axios from 'axios';
import { Plan, Subscription, CheckoutData, ApiResponse } from '../types';

// Axios instance configured for json-server
export const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions using real HTTP requests
export const mockApi = {
  // Get all available plans
  getPlans: async (): Promise<ApiResponse<Plan[]>> => {
    try {
      const response = await apiClient.get<Plan[]>('/plans');
      return {
        data: response.data,
        success: true,
        message: 'Plans fetched successfully',
      };
    } catch (error) {
      console.error('Error fetching plans:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to fetch plans',
      };
    }
  },

  // Get plan by ID
  getPlanById: async (planId: string): Promise<ApiResponse<Plan | null>> => {
    try {
      const response = await apiClient.get<Plan>(`/plans/${planId}`);
      return {
        data: response.data,
        success: true,
        message: 'Plan found',
      };
    } catch (error: any) {
      console.error('Error fetching plan:', error);
      if (error.response?.status === 404) {
        return {
          data: null,
          success: false,
          message: 'Plan not found',
        };
      }
      return {
        data: null,
        success: false,
        message: 'Failed to fetch plan',
      };
    }
  },

  // Subscribe to a plan
  subscribeToPlan: async (
    checkoutData: CheckoutData
  ): Promise<ApiResponse<Subscription>> => {
    try {
      // First, get the plan details
      const planResponse = await apiClient.get<Plan>(
        `/plans/${checkoutData.planId}`
      );

      if (!planResponse.data) {
        return {
          data: {} as Subscription,
          success: false,
          message: 'Plan not found',
        };
      }

      const subscription: Subscription = {
        id: `sub_${Date.now()}`,
        planId: checkoutData.planId,
        userId: 'user_123', // Mock user ID
        status: 'active',
        startDate: new Date().toISOString(),
        plan: planResponse.data,
      };

      // Create the subscription
      const response = await apiClient.post<Subscription>(
        '/subscriptions',
        subscription
      );

      return {
        data: response.data,
        success: true,
        message: 'Subscription created successfully',
      };
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      if (error.response?.status === 404) {
        return {
          data: {} as Subscription,
          success: false,
          message: 'Plan not found',
        };
      }
      return {
        data: {} as Subscription,
        success: false,
        message: 'Failed to create subscription',
      };
    }
  },

  // Get user subscriptions
  getUserSubscriptions: async (
    userId: string = 'user_123'
  ): Promise<ApiResponse<Subscription[]>> => {
    try {
      const response = await apiClient.get<Subscription[]>(
        `/subscriptions?userId=${userId}`
      );
      return {
        data: response.data,
        success: true,
        message: 'Subscriptions fetched successfully',
      };
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to fetch subscriptions',
      };
    }
  },

  // Cancel subscription
  cancelSubscription: async (
    subscriptionId: string
  ): Promise<ApiResponse<Subscription>> => {
    try {
      // First, get the subscription
      const getResponse = await apiClient.get<Subscription>(
        `/subscriptions/${subscriptionId}`
      );

      if (!getResponse.data) {
        return {
          data: {} as Subscription,
          success: false,
          message: 'Subscription not found',
        };
      }

      // Update the subscription status
      const updatedSubscription = {
        ...getResponse.data,
        status: 'cancelled' as const,
        endDate: new Date().toISOString(),
      };

      const response = await apiClient.put<Subscription>(
        `/subscriptions/${subscriptionId}`,
        updatedSubscription
      );

      return {
        data: response.data,
        success: true,
        message: 'Subscription cancelled successfully',
      };
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      if (error.response?.status === 404) {
        return {
          data: {} as Subscription,
          success: false,
          message: 'Subscription not found',
        };
      }
      return {
        data: {} as Subscription,
        success: false,
        message: 'Failed to cancel subscription',
      };
    }
  },
};
