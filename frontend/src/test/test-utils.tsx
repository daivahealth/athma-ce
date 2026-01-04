import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement } from 'react';
import { vi } from 'vitest';

// Mock messages for testing
const mockMessages = {
  app: {
    title: 'Test App',
    subtitle: 'Test Subtitle',
  },
  actions: {
    login: 'Login',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
  },
  nav: {
    dashboard: 'Dashboard',
    tenants: 'Tenants',
    users: 'Users',
  },
};

// Create a test query client
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: string;
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  { locale = 'en', queryClient = createTestQueryClient(), ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider locale={locale} messages={mockMessages}>
          {children}
        </NextIntlClientProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock API responses
export const mockApiResponses = {
  tenants: [
    { id: '1', name: 'Test Tenant 1', status: 'active' },
    { id: '2', name: 'Test Tenant 2', status: 'inactive' },
  ],
  users: [
    { id: '1', email: 'test@example.com', name: 'Test User' },
  ],
};

// Mock API client
export const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

// Test utilities
export const testUtils = {
  waitForLoadingToFinish: () => new Promise(resolve => setTimeout(resolve, 0)),
  mockLocalStorage: () => {
    const store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
    };
  },
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { renderWithProviders as render };
