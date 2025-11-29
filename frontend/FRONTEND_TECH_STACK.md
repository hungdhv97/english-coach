# Frontend Tech Stack

This document describes the technology stack used in the frontend.

## Core Framework

- **React**: 19.2.0 - Latest React with concurrent features
- **React Router**: 7.9.6 - Client-side routing
- **Vite**: 7.2.4 - Fast build tool and dev server

## State Management

- **Zustand**: 5.x - Lightweight state management
- **TanStack Query**: 5.x - Server state management and data fetching

## Forms & Validation

- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod

## UI & Styling

- **Shadcn UI**: High-quality, accessible component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Recharts**: Composable charting library

## Data Fetching

- **Axios**: HTTP client (can be replaced with fetch if needed)
- **TanStack Query**: Data fetching, caching, and synchronization

## Internationalization

- **i18next**: Internationalization framework
- **react-i18next**: React bindings for i18next
- **i18next-browser-languagedetector**: Language detection

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # App-level components
│   │   ├── providers/         # Global providers (QueryClient, etc.)
│   │   └── router/            # Route definitions
│   ├── components/            # Reusable components
│   │   └── ui/               # Shadcn UI components
│   ├── entities/              # Domain entities
│   ├── features/              # Feature modules
│   ├── pages/                 # Page components
│   ├── shared/                # Shared utilities
│   │   ├── api/              # API client and queries
│   │   ├── lib/              # Libraries (i18n, validators, utils)
│   │   └── store/            # Zustand stores
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utility functions
├── components.json            # Shadcn UI configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── vite.config.ts            # Vite configuration
```

## Key Features

### Component Architecture
- **Feature-Sliced Design**: Organized by features, entities, and shared resources
- **Shadcn UI**: Copy-paste components that are fully customizable
- **Type-safe**: Full TypeScript support

### State Management Strategy
- **Zustand**: Client-side global state (theme, user preferences)
- **TanStack Query**: Server state (API data, caching, synchronization)
- **React Hook Form**: Form state (local form state)

### Styling Approach
- **Tailwind CSS**: Utility-first CSS
- **CSS Variables**: For theming support
- **Dark Mode**: Built-in dark mode support via CSS variables

### Form Handling
- **React Hook Form**: Minimal re-renders, performant forms
- **Zod**: Runtime type validation
- **Type-safe**: Full TypeScript integration

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Add Shadcn UI Component

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## Usage Examples

### Using Zustand Store

```tsx
import { useAppStore } from '@/shared/store/useAppStore';

function MyComponent() {
  const { theme, setTheme } = useAppStore();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Current theme: {theme}
    </button>
  );
}
```

### Using React Hook Form with Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      <input {...form.register('password')} type="password" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Using TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/shared/api/http-client';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => httpClient.get(`/users/${userId}`),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.name}</div>;
}
```

### Using Lucide Icons

```tsx
import { User, Settings, LogOut } from 'lucide-react';

function Menu() {
  return (
    <div>
      <User size={20} />
      <Settings size={20} />
      <LogOut size={20} />
    </div>
  );
}
```

### Using Recharts

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
];

function Chart() {
  return (
    <LineChart width={400} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );
}
```

## Configuration Files

- `tailwind.config.js`: Tailwind CSS configuration with Shadcn UI theme
- `components.json`: Shadcn UI component configuration
- `vite.config.ts`: Vite configuration with path aliases
- `tsconfig.json`: TypeScript configuration with path aliases

## Path Aliases

- `@/` → `src/` - For easier imports

Example:
```tsx
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/shared/store/useAppStore';
```

