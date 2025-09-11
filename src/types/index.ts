export interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  features: string[];
  popular?: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  userId: string;
  status: 'active' | 'cancelled' | 'pending';
  startDate: string;
  endDate?: string;
  plan: Plan;
}

export interface CheckoutData {
  planId: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

