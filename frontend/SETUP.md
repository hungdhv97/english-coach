# Frontend Setup Guide

Hướng dẫn setup và sử dụng các công nghệ trong frontend.

## Đã Cài Đặt

✅ React 19.2.0  
✅ React Router Dom 7.9.6  
✅ Zustand 5.0.8  
✅ Zod 4.1.13  
✅ React Hook Form 7.67.0  
✅ Tailwind CSS 4.1.17  
✅ Lucide React 0.555.0  
✅ Recharts 3.5.1  
✅ TanStack Query 5.90.11  

## Cài Đặt Shadcn UI Components

Shadcn UI sử dụng CLI để thêm components. Ví dụ:

```bash
# Thêm button component
npx shadcn@latest add button

# Thêm card component
npx shadcn@latest add card

# Thêm dialog component
npx shadcn@latest add dialog

# Thêm form components
npx shadcn@latest add form input label

# Xem danh sách tất cả components
npx shadcn@latest add
```

## Cấu Hình

### Path Aliases

Đã cấu hình path alias `@/` trỏ tới `src/`:

```tsx
// Thay vì
import { Button } from '../../../components/ui/button';

// Có thể dùng
import { Button } from '@/components/ui/button';
```

### Tailwind CSS

Đã cấu hình với:
- CSS variables cho theming
- Dark mode support
- Shadcn UI color system

### TypeScript

Đã cấu hình với path aliases và strict mode.

## Sử Dụng

### 1. Zustand Store

```tsx
import { useAppStore } from '@/shared/store/useAppStore';

function MyComponent() {
  const { theme, setTheme } = useAppStore();
  
  return <button onClick={() => setTheme('dark')}>Theme: {theme}</button>;
}
```

### 2. React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      {form.formState.errors.email && (
        <span>{form.formState.errors.email.message}</span>
      )}
      
      <input {...form.register('password')} type="password" />
      {form.formState.errors.password && (
        <span>{form.formState.errors.password.message}</span>
      )}
      
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
```

### 3. TanStack Query

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { httpClient } from '@/shared/api/http-client';

// Query
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => httpClient.get(`/users/${userId}`),
  });

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return <div>{data.name}</div>;
}

// Mutation
function CreateUser() {
  const mutation = useMutation({
    mutationFn: (data: { name: string; email: string }) => 
      httpClient.post('/users', data),
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: 'John', email: 'john@example.com' })}>
      Tạo người dùng
    </button>
  );
}
```

### 4. Lucide Icons

```tsx
import { User, Settings, LogOut, Menu } from 'lucide-react';

function IconExample() {
  return (
    <div>
      <User size={24} />
      <Settings size={20} className="text-blue-500" />
      <LogOut size={18} />
      <Menu />
    </div>
  );
}
```

### 5. Recharts

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Tháng 1', value: 400 },
  { name: 'Tháng 2', value: 300 },
  { name: 'Tháng 3', value: 500 },
];

function Chart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Next Steps

1. Thêm Shadcn UI components khi cần
2. Tạo các custom hooks trong `src/hooks/`
3. Setup các Zustand stores trong `src/shared/store/`
4. Tạo form schemas với Zod trong `src/shared/lib/validators/`

