// src/config/subscriptions.ts (Example)

export interface PlanFeature {
  text: string;
  included: boolean; // Indicates if included in the plan by default
}

export interface SubscriptionPlan {
  id: 'free' | 'pro_monthly' | 'pro_annual'; // Unique IDs
  name: string;
  price: string; // e.g., "$0", "$10/month", "$99/year"
  billingCycle: string; // e.g., "Free", "Billed Monthly", "Billed Annually"
  description: string; // Short description
  features: PlanFeature[];
  ctaText: string; // Default CTA
  isPopular?: boolean; // Optional flag for highlighting
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Tier',
    price: '$0',
    billingCycle: 'Always Free',
    description: 'Get started with the basics.',
    features: [
      { text: 'Access to limited free courses', included: true },
      { text: 'Access to free vlogs & articles', included: true },
      { text: 'Community forum access', included: true },
      { text: 'Downloadable resources', included: false },
      { text: 'Priority support', included: false },
      { text: 'Exclusive Pro content', included: false },
    ],
    ctaText: 'Current Plan', // Or "Get Started" if logic handles it
  },
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: '$10', // Example price
    billingCycle: 'Billed Monthly',
    description: 'Unlock full access month-by-month.',
    features: [
      { text: 'Access to ALL courses & series', included: true },
      { text: 'Access to free vlogs & articles', included: true },
      { text: 'Community forum access', included: true },
      { text: 'Downloadable resources', included: true },
      { text: 'Offline viewing', included: true },
      { text: 'Priority support', included: true },
      { text: 'Exclusive Pro content', included: true },
    ],
    ctaText: 'Go Pro Monthly',
  },
  {
    id: 'pro_annual',
    name: 'Pro Annual',
    price: '$99', // Example price
    billingCycle: 'Billed Annually (Save 17%)', // Highlight savings
    description: 'Best value for dedicated learners.',
    features: [
      { text: 'Access to ALL courses & series', included: true },
      { text: 'Access to free vlogs & articles', included: true },
      { text: 'Community forum access', included: true },
      { text: 'Downloadable resources', included: true },
      { text: 'Offline viewing', included: true },
      { text: 'Priority support', included: true },
      { text: 'Exclusive Pro content', included: true },
    ],
    ctaText: 'Go Pro Annual',
    isPopular: true, // Highlight this plan
  },
];
