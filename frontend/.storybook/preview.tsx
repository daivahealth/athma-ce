import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';
import { ThemeProvider } from '@/providers/theme-provider';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="min-h-screen bg-background p-4 text-foreground">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
