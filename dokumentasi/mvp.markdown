# GerakKita Admin Dashboard - MVP Documentation

## 📋 Project Overview

Dashboard admin GerakKita adalah aplikasi web-only yang digunakan untuk mengelola seluruh operasional sistem bus tracking. Dashboard ini memberikan akses penuh kepada administrator untuk monitoring dan manajemen data bus, user, driver, route, dan transaksi.

### Target Pengguna
- **Admin Perusahaan Bus**: Mengelola armada dan operasional
- **Super Admin**: Monitoring keseluruhan sistem

### Platform
- **Web-only** (Desktop/Laptop - tidak untuk mobile)
- Akses melalui browser modern (Chrome, Firefox, Safari, Edge)

---

## 🎯 Core Features (MVP)

### 1. **Dashboard Overview**
![Dashboard Mockup](file:///C:/Users/BRAM/.gemini/antigravity/brain/1706b1ff-dc3e-4943-b833-216d5a77a37b/uploaded_image_1768995941299.png)

**Fitur:**
- Total registered users (real-time)
- Total active buses (currently on route)
- Today's transactions (amount & revenue)
- Active wallet balance (total saldo user)
- Weekly bus usage chart (bar chart)
- Monthly transaction volume (line chart)
- Recent transactions table (latest 10)

**Metrics:**
- Total User Registered + growth percentage
- Active Buses count
- Today's Transactions + revenue
- Active Wallet balance

---

### 2. **Bus Management**

**Fitur CRUD:**
- ✅ **Create**: Tambah bus baru
- ✅ **Read**: List semua bus dengan filter & search
- ✅ **Update**: Edit informasi bus
- ✅ **Delete**: Hapus bus (soft delete)

**Data Bus:**
```typescript
{
  bus_number: string          // Nomor bus (unique)
  license_plate: string       // Plat nomor
  capacity: number            // Kapasitas penumpang
  status: 'active' | 'maintenance' | 'inactive'
  route_id: string            // Route yang assigned
  current_location?: {        // Lokasi real-time
    latitude: number
    longitude: number
  }
  last_maintenance?: Date
  created_at: Date
  updated_at: Date
}
```

**View Features:**
- Table dengan pagination
- Filter by status & route
- Search by bus number / license plate
- Live tracking status indicator
- Quick actions (Edit, Delete, View Details)

---

### 3. **User Management**

**Fitur CRUD:**
- ✅ **Create**: Tambah user manual (optional)
- ✅ **Read**: List semua users
- ✅ **Update**: Edit profile user, update wallet balance
- ✅ **Delete**: Soft delete / ban user

**Data User:**
```typescript
{
  id: string
  full_name: string
  email: string
  phone: string
  wallet_balance: number
  pin_hash?: string           // Encrypted PIN wallet
  role: 'customer' | 'driver' | 'admin'
  status: 'active' | 'suspended' | 'banned'
  total_trips: number
  total_spent: number
  created_at: Date
  last_login?: Date
}
```

**View Features:**
- Table dengan pagination & sorting
- Filter by role & status
- Search by name, email, phone
- Quick wallet top-up
- View transaction history per user
- Reset PIN wallet capability

---

### 4. **Driver Management**

**Fitur CRUD:**
- ✅ **Create**: Register driver baru
- ✅ **Read**: List semua driver
- ✅ **Update**: Edit profile, assign bus
- ✅ **Delete**: Deactivate driver

**Data Driver:**
```typescript
{
  user_id: string             // Foreign key to users
  license_number: string      // Nomor SIM
  license_expiry: Date        // Expired SIM
  assigned_bus_id?: string    // Bus yang di-assign
  status: 'available' | 'on_trip' | 'off_duty'
  rating: number              // Average rating
  total_trips: number
  join_date: Date
  is_active: boolean
}
```

**View Features:**
- Table with driver stats
- Filter by status & assigned bus
- Search by name / license number
- Assign/Unassign bus
- View driver performance (rating, trips)
- View driver location (when on trip)

---

### 5. **Transaction Management**

**Fitur:**
- ✅ **Read**: View all transactions
- ✅ **Filter**: By date range, status, payment method
- ✅ **Export**: Download CSV/Excel report

**Data Transaction:**
```typescript
{
  id: string
  user_id: string
  ticket_id?: string
  type: 'ticket_purchase' | 'wallet_topup' | 'refund'
  amount: number
  payment_method: 'midtrans' | 'wallet'
  status: 'pending' | 'success' | 'failed' | 'refunded'
  midtrans_order_id?: string
  metadata?: {
    route_id?: string
    bus_id?: string
    pickup_point?: string
    dropoff_point?: string
  }
  created_at: Date
  completed_at?: Date
}
```

**View Features:**
- Table with advanced filters
- Real-time status updates
- Search by transaction ID / user
- Date range picker
- Revenue analytics
- Refund capability
- Export to CSV/Excel

---

## 🛠 Tech Stack Recommendation

### **Frontend**
```
Framework: Next.js 14+ (App Router)
Language: TypeScript
Styling: Tailwind CSS
UI Library: shadcn/ui
Charts: Recharts
Tables: TanStack Table (React Table v8)
Forms: React Hook Form + Zod validation
State: Zustand (for global state)
```

### **Backend/Database**
```
Database: Supabase (PostgreSQL)
Authentication: Supabase Auth
Real-time: Supabase Realtime subscriptions
Storage: Supabase Storage (for documents/images)
```

### **Development Tools**
```
Package Manager: npm / pnpm
Code Quality: ESLint + Prettier
Git: GitHub
Deployment: Vercel (recommended)
```

---

## 🗄 Database Schema Requirements

### **New Tables**

#### `admin_users`
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `admin_activity_logs`
```sql
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  resource_type TEXT NOT NULL, -- 'bus', 'user', 'driver', etc
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Existing Tables Updates**

Pastikan tables berikut sudah ada dan sesuai:
- ✅ `users` (dari mobile app)
- ✅ `buses` (dari mobile app)
- ✅ `drivers` (dari mobile app)
- ✅ `transactions` (dari mobile app)
- ✅ `tickets` (dari mobile app)
- ✅ `routes` (dari mobile app)
- ✅ `bus_stops` (dari mobile app)

---

## 📂 Project Structure

```
GerakKitaAdmin/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   │   ├── page.tsx              # Dashboard overview
│   │   │   ├── buses/
│   │   │   │   ├── page.tsx          # Bus list
│   │   │   │   ├── [id]/             # Bus detail
│   │   │   │   └── new/              # Create bus
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   ├── drivers/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   └── transactions/
│   │   │       └── page.tsx
│   │   ├── api/                      # API routes (optional)
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── RecentTransactions.tsx
│   │   ├── charts/
│   │   │   ├── WeeklyUsageChart.tsx
│   │   │   └── TransactionVolumeChart.tsx
│   │   └── forms/
│   │       ├── BusForm.tsx
│   │       ├── UserForm.tsx
│   │       └── DriverForm.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Supabase browser client
│   │   │   ├── server.ts             # Supabase server client
│   │   │   └── middleware.ts         # Auth middleware
│   │   ├── utils.ts                  # Utility functions
│   │   └── validations.ts            # Zod schemas
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBuses.ts
│   │   ├── useUsers.ts
│   │   ├── useDrivers.ts
│   │   └── useTransactions.ts
│   │
│   ├── types/
│   │   ├── database.ts               # Supabase types
│   │   ├── bus.ts
│   │   ├── user.ts
│   │   ├── driver.ts
│   │   └── transaction.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   ├── logo.png
│   └── favicon.ico
│
├── .env.local                        # Environment variables
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🔐 Authentication & Authorization

### **Authentication Strategy**

> [!IMPORTANT]
> Admin dashboard menggunakan **separate authentication system** dari mobile app untuk keamanan yang lebih baik.

**Opsi yang Dipilih: Option B - Separate `admin_users` table** ✅

**Alasan:**
- **Security Isolation**: Admin credentials terpisah dari user credentials
- **Different Permission Model**: Admin memiliki permission structure yang berbeda
- **Audit Trail**: Lebih mudah tracking admin activities
- **Fail-safe**: Jika mobile app di-compromise, admin portal tetap aman

**Alternative (Not Recommended):**
- Option A: Extend `users` table dengan role 'admin'
  - ❌ Security risk jika user credentials leaked
  - ❌ Mixing customer data dengan admin data

### **Login Flow**
1. Admin login menggunakan email & password (separate dari mobile users)
2. Supabase Auth menghandle authentication untuk `admin_users` table
3. Session disimpan di cookies (httpOnly, secure)
4. JWT token dengan custom claims untuk role
5. Redirect ke dashboard setelah login sukses

### **Authorization Levels**
- **Super Admin**: Full access ke semua fitur (create, read, update, delete)
- **Admin**: Access terbatas (read & update only, no delete capability)
- **Viewer**: Read-only access (optional, untuk reporting)

### **Protected Routes**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

## ⚠️ Error Handling Strategy

### **Client-Side Error Handling**
```typescript
// Global Error Boundary
// app/error.tsx
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error monitoring service (Sentry, LogRocket)
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### **API Error Handling**
```typescript
// lib/utils/errorHandler.ts
export async function handleSupabaseError(error: any) {
  if (error.code === 'PGRST116') {
    // No data found
    toast.info('No data found')
  } else if (error.code === '23505') {
    // Unique violation
    toast.error('Duplicate entry detected')
  } else if (error.message.includes('JWT')) {
    // Auth error
    toast.error('Session expired. Please login again')
    // Redirect to login
  } else {
    toast.error('An unexpected error occurred')
    // Log to monitoring service
  }
}
```

### **Network Retry Logic**
```typescript
// lib/utils/retry.ts
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (maxRetries === 0) throw error
    await new Promise(resolve => setTimeout(resolve, delay))
    return retryWithBackoff(fn, maxRetries - 1, delay * 2)
  }
}
```

### **User-Facing Errors**
- **Toast Notifications**: Untuk inline errors (form validation, API errors)
- **Error Pages**: Untuk 404, 500, dan network errors
- **Inline Messages**: Untuk field-level validation errors
- **Loading States**: Skeleton loaders untuk mencegah layout shift

### **Error Monitoring** (Production)
```bash
# Recommended tools:
- Sentry (error tracking & performance monitoring)
- LogRocket (session replay)
- Supabase Logs (database query monitoring)
```

---

## 🎨 UI/UX Design Principles

### **Color Scheme** (dari mockup)
- **Background**: Dark theme (#0F172A, #1E293B)
- **Cards**: Semi-transparent dark (#1E293B80)
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)

### **Typography**
- **Headings**: Inter Bold
- **Body**: Inter Regular
- **Monospace**: JetBrains Mono (untuk angka/kode)

### **Components Style**
- Rounded corners (border-radius: 8px)
- Subtle shadows
- Glassmorphism effects on cards
- Smooth transitions (200ms ease)

### **Responsive Design**
- **Primary Target**: Desktop (1920x1080, 1366x768)
- **Secondary Support**: Tablet landscape (1024x768)
- **Minimum Screen Width**: 768px
- Sidebar collapsible di tablet
- Table horizontal scroll di smaller screens
- Charts responsive & touch-friendly

> [!NOTE]
> Dashboard is **web-only** and optimized for desktop use. Mobile phone support is not included in MVP.

---

## ⚡ Performance Optimization

### **Data Loading Strategies**
```typescript
// Pagination Implementation
const ITEMS_PER_PAGE = 20 // Default pagination

// Server-side pagination with Supabase
export async function getBusesPaginated(page = 1, limit = ITEMS_PER_PAGE) {
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  const { data, error, count } = await supabase
    .from('buses')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })
  
  return { data, count, error }
}
```

### **Caching Strategy**
```typescript
// Use SWR or React Query for data caching
import useSWR from 'swr'

export function useBuses() {
  const { data, error, mutate } = useSWR('/api/buses', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  })
  
  return { buses: data, isLoading: !error && !data, error, refresh: mutate }
}
```

### **Image Optimization**
```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src={bus.image_url}
  alt={bus.bus_number}
  width={400}
  height={300}
  priority={false}
  loading="lazy"
/>
```

### **Real-time Optimization**
```typescript
// Subscribe only to visible/active data
export function subscribeToActiveBuses(callback: (payload: any) => void) {
  return supabase
    .channel('active-buses')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'buses',
      filter: 'status=eq.active' // Only active buses
    }, callback)
    .subscribe()
}
```

### **Performance Metrics**
- **Target Page Load**: < 2 seconds (First Contentful Paint)
- **Target TTI**: < 3 seconds (Time to Interactive)
- **Bundle Size**: < 500kb (gzipped)
- **Lighthouse Score**: > 90 (Performance)

### **Optimization Checklist**
- [ ] Enable Next.js Image Optimization
- [ ] Implement code splitting untuk routes
- [ ] Lazy load charts & heavy components
- [ ] Minimize bundle size (remove unused dependencies)
- [ ] Enable compression (Vercel handles this)
- [ ] Use React.memo untuk expensive components
- [ ] Debounce search inputs (300ms delay)
- [ ] Implement virtual scrolling for large lists (optional)

---

## 🚀 Implementation Phases

### **Phase 1: Project Setup & Authentication** (Day 1-3)
- [ ] Initialize Next.js project dengan TypeScript
- [ ] Setup Tailwind CSS & shadcn/ui components
- [ ] Configure Supabase client (browser & server)
- [ ] Generate TypeScript types from Supabase database
- [ ] Create database migration for `admin_users` table
- [ ] Create basic layout (Sidebar + Header + Footer)
- [ ] Implement authentication system
  - [ ] Login page dengan form validation
  - [ ] Session management
  - [ ] Protected route middleware
  - [ ] Logout functionality
- [ ] Setup error handling (Error Boundary)
- [ ] Configure environment variables

### **Phase 2: Dashboard Overview (Simplified)** (Day 4-5)
- [ ] Create stats cards components (4 main metrics)
  - [ ] Total Users
  - [ ] Active Buses
  - [ ] Today's Transactions
  - [ ] Total Revenue
- [ ] Create recent transactions table (simple version)
- [ ] Add loading skeletons for all components
- [ ] Connect to Supabase for data fetching
- [ ] Implement error handling & retry logic
- [ ] **Charts postponed to Phase 8**

### **Phase 3: Bus Management (Priority 1)** (Day 6-8)
- [ ] Create buses table with TanStack Table
- [ ] Implement pagination (20 items per page)
- [ ] Implement CRUD operations
  - [ ] Create bus form with Zod validation
  - [ ] Edit bus modal/page
  - [ ] Delete confirmation dialog (soft delete)
- [ ] Add filters (status, route)
- [ ] Add search functionality (debounced)
- [ ] Real-time status indicator
- [ ] Activity logging untuk bus changes

### **Phase 4: Driver Management** (Day 9-11)
- [ ] Create drivers table dengan driver stats
- [ ] Implement CRUD operations
  - [ ] Register driver form (dengan file upload untuk SIM)
  - [ ] Edit driver profile
  - [ ] Deactivate driver (soft delete)
- [ ] Bus assignment/unassignment feature
- [ ] Driver performance metrics display
- [ ] License expiry warning indicator
- [ ] Filter & search functionality
- [ ] Activity logging

### **Phase 5: Transaction Management (Read-Only First)** (Day 12-14)
- [ ] Create transactions table (read-only)
- [ ] Implement pagination & sorting
- [ ] Advanced filtering
  - [ ] Date range picker (react-day-picker)
  - [ ] Status filter dropdown
  - [ ] Payment method filter
  - [ ] Amount range filter
- [ ] Transaction details modal
- [ ] Revenue analytics (simple version)
  - [ ] Daily/Weekly/Monthly summary
  - [ ] Payment method breakdown
- [ ] Export to CSV functionality

### **Phase 6: User Management** (Day 15-17)
- [ ] Create users table dengan pagination
- [ ] Implement filters (role, status)
- [ ] Search by name, email, phone
- [ ] View user details modal
  - [ ] Transaction history per user
  - [ ] Wallet balance display
- [ ] Wallet management features
  - [ ] Top-up wallet (admin action)
  - [ ] Reset PIN functionality
  - [ ] View wallet transaction history
- [ ] User status management (suspend/ban)
- [ ] Export user list to CSV

### **Phase 7: Testing & Bug Fixes** (Day 18-20)
- [ ] Manual testing semua CRUD operations
- [ ] Test authentication flow (login, logout, session expiry)
- [ ] Test filters & search di semua modules
- [ ] Test pagination & sorting
- [ ] Test error handling (network errors, validation errors)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Responsive testing (desktop & tablet)
- [ ] Performance testing (Lighthouse audit)
- [ ] Fix bugs yang ditemukan
- [ ] Code review & cleanup

### **Phase 8: Polish & Deploy** (Day 21-22)
- [ ] Add charts to Dashboard Overview
  - [ ] Weekly bus usage (Bar Chart)
  - [ ] Monthly transaction volume (Line Chart)
- [ ] Implement toast notifications untuk semua actions
- [ ] Add loading states untuk semua async operations
- [ ] Admin activity logs implementation
- [ ] Setup Sentry untuk error monitoring (optional)
- [ ] Final UI polish & refinements
- [ ] Deploy to Vercel
  - [ ] Configure environment variables
  - [ ] Test di production
  - [ ] Setup custom domain (optional)
- [ ] Create admin user documentation/guide

---

## 📊 Key Performance Indicators (KPI)

Dashboard harus menampilkan KPI berikut:

1. **Operational Metrics**
   - Total active buses vs. idle buses
   - Average trips per bus per day
   - Bus utilization rate (%)

2. **User Metrics**
   - Total registered users
   - Active users (last 7 days)
   - New user registration (daily/weekly)

3. **Revenue Metrics**
   - Daily/Weekly/Monthly revenue
   - Revenue by payment method
   - Average transaction value

4. **Driver Metrics**
   - Total active drivers
   - Average driver rating
   - Drivers on trip vs. available

---

## 🔒 Security Considerations

### **Data Protection**
- [ ] Implement Row Level Security (RLS) di Supabase
- [ ] Hash password menggunakan bcrypt
- [ ] HTTPS only (enforced by Vercel)
- [ ] Rate limiting untuk API calls

### **Input Validation**
- [ ] Client-side validation dengan Zod
- [ ] Server-side validation
- [ ] SQL injection prevention (Supabase handles this)
- [ ] XSS protection

### **Audit Trail**
- [ ] Log semua admin actions
- [ ] Track who created/updated/deleted data
- [ ] IP address logging
- [ ] Timestamp untuk setiap action

---

## 📱 API Integration

### **Supabase Client Example**

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export const supabase = createClientComponentClient<Database>()

// Example: Fetch all buses
export async function getBuses() {
  const { data, error } = await supabase
    .from('buses')
    .select(`
      *,
      route:routes(id, name),
      driver:drivers(user:users(full_name))
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Example: Real-time subscription
export function subscribeToBuses(callback: (payload: any) => void) {
  return supabase
    .channel('buses-channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'buses' },
      callback
    )
    .subscribe()
}
```

---

## 🧪 Testing Strategy

### **Unit Tests** (Using Jest + React Testing Library)
```typescript
// Example: Validation schema test
import { busSchema } from '@/lib/validations'

describe('busSchema', () => {
  it('should validate correct bus data', () => {
    const validBus = {
      bus_number: 'BUS-001',
      license_plate: 'B 1234 ABC',
      capacity: 40,
      status: 'active'
    }
    expect(() => busSchema.parse(validBus)).not.toThrow()
  })
  
  it('should reject invalid capacity', () => {
    const invalidBus = { capacity: -5 }
    expect(() => busSchema.parse(invalidBus)).toThrow()
  })
})
```

**Test Coverage:**
- ✅ Utility functions (formatCurrency, formatDate, etc.)
- ✅ Validation schemas (Zod)
- ✅ Custom hooks (useBuses, useDrivers, etc.)
- ✅ Helper functions (error handlers, retry logic)

### **Integration Tests**
```typescript
// Example: API integration test
import { getBuses } from '@/lib/api/buses'

describe('getBuses', () => {
  it('should fetch buses with pagination', async () => {
    const result = await getBuses({ page: 1, limit: 20 })
    expect(result.data).toBeDefined()
    expect(result.data.length).toBeLessThanOrEqual(20)
  })
})
```

**Test Coverage:**
- ✅ Supabase queries
- ✅ API routes (if using Next.js API routes)
- ✅ Authentication flow
- ✅ Data mutations (create, update, delete)

### **E2E Tests** (Optional - Playwright/Cypress)
```typescript
// Example: Login flow E2E test
test('admin can login successfully', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'admin@gerakita.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

**Critical Flows to Test:**
- ✅ Login/Logout flow
- ✅ Create bus → Assign to route → View on dashboard
- ✅ Create driver → Assign to bus → View status
- ✅ Filter transactions → Export to CSV

### **Manual Testing Checklist**

#### **Authentication**
- [ ] Login dengan credentials yang benar
- [ ] Login dengan credentials salah (error message muncul)
- [ ] Session expiry handling (redirect ke login)
- [ ] Logout functionality
- [ ] Protected routes (redirect jika tidak authenticated)

#### **CRUD Operations**
- [ ] **Buses**: Create, Read, Update, Delete
- [ ] **Drivers**: Create, Read, Update, Deactivate
- [ ] **Users**: Read, Update wallet, View history
- [ ] **Transactions**: Read, Filter, Export

#### **Filtering & Search**
- [ ] Search functionality di semua modules
- [ ] Filter by status (buses, drivers, users)
- [ ] Date range filter (transactions)
- [ ] Combined filters (multiple filters sekaligus)
- [ ] Clear filters button

#### **Data Validation**
- [ ] Submit form dengan data kosong (validation error)
- [ ] Submit form dengan data invalid (format salah)
- [ ] Duplicate entry handling (unique constraints)
- [ ] Max length validation (text fields)

#### **Error Handling**
- [ ] Network error simulation (disconnect internet)
- [ ] Database error handling
- [ ] 404 page untuk invalid routes
- [ ] 500 error page
- [ ] Toast notifications untuk errors

#### **Performance**
- [ ] Page load time < 2 seconds
- [ ] Table pagination works smoothly
- [ ] Search debounce (tidak lag saat typing)
- [ ] Image loading optimization
- [ ] Real-time updates tidak freeze UI

#### **Responsive Design**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet landscape (1024x768)
- [ ] Sidebar collapse di tablet
- [ ] Table horizontal scroll di smaller screens

#### **Browser Compatibility**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### **Testing Tools Recommendation**
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@playwright/test": "^1.40.0"
  }
}
```

---

## 📁 Missing Features (To Be Addressed)

### **1. File Upload Handling**

**Use Case:**
- Driver license images (SIM)
- Bus photos
- Admin profile pictures (optional)

**Implementation:**
```typescript
// Using Supabase Storage
import { supabase } from '@/lib/supabase/client'

export async function uploadDriverLicense(file: File, driverId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${driverId}-${Date.now()}.${fileExt}`
  const filePath = `driver-licenses/${fileName}`

  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath)

  return publicUrl
}
```

**Storage Buckets:**
- `documents` - Driver licenses, legal documents
- `images` - Bus photos, profile pictures

**File Upload Component:**
```typescript
// components/ui/file-upload.tsx
<input
  type="file"
  accept="image/*,.pdf"
  onChange={handleFileChange}
  className="file-input"
/>
```

---

### **2. Notification System**

**Priority Notifications:**
1. **License Expiry Warnings**
   - 30 days before expiry: Warning notification
   - 7 days before expiry: Critical notification
   - Expired: Prevent driver assignment

2. **System Events**
   - New user registration
   - Large transaction amount (> Rp 1,000,000)
   - Bus maintenance due
   - Failed payment attempts

**Implementation Options:**

**Option A: In-App Notifications (MVP)**
```typescript
// Simple notification badge
interface Notification {
  id: string
  type: 'warning' | 'info' | 'error'
  message: string
  read: boolean
  created_at: Date
}

// Database table: admin_notifications
```

**Option B: Email Notifications (Post-MVP)**
```typescript
// Using Resend or SendGrid
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'admin@gerakita.com',
  to: 'admin@gerakita.com',
  subject: 'Driver License Expiring Soon',
  html: '<p>Driver XYZ license expires in 7 days</p>'
})
```

---

### **3. Data Export Details**

**Library Recommendation:**
```bash
npm install papaparse
npm install @types/papaparse --save-dev
```

**CSV Export Implementation:**
```typescript
import { parse, unparse } from 'papaparse'

export function exportToCSV(data: any[], filename: string) {
  const csv = unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString()}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
```

**Excel Export (Optional):**
```bash
npm install xlsx
```

**Export Formats:**
- **Transactions**: CSV dengan columns (Date, User, Amount, Method, Status)
- **Users**: CSV dengan columns (Name, Email, Phone, Status, Wallet Balance)
- **Buses**: CSV dengan columns (Bus Number, License Plate, Status, Route)
- **Drivers**: CSV dengan columns (Name, License Number, Status, Rating)

---

### **4. Route Management Module**

> [!CAUTION]
> Route Management is **NOT included in MVP** but is crucial for operations.

**Post-MVP Feature:**
- Create/Edit/Delete routes
- Assign bus stops to routes
- Set route pricing
- View route analytics

**Temporary MVP Solution:**
- Admin manually assigns `route_id` saat create/edit bus
- View route info di bus details (read-only)
- Route data harus di-seed terlebih dahulu

---

### **5. Activity Logs Implementation**

**Database Schema:**
```sql
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  resource_type TEXT NOT NULL, -- 'bus', 'user', 'driver'
  resource_id TEXT,
  old_values JSONB, -- Previous data (for updates)
  new_values JSONB, -- New data
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON admin_activity_logs(created_at DESC);
```

**Logging Function:**
```typescript
export async function logAdminActivity({
  action,
  resourceType,
  resourceId,
  oldValues,
  newValues
}: {
  action: 'create' | 'update' | 'delete'
  resourceType: string
  resourceId: string
  oldValues?: any
  newValues?: any
}) {
  const { data: { user } } = await supabase.auth.getUser()
  
  await supabase.from('admin_activity_logs').insert({
    admin_id: user?.id,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    old_values: oldValues,
    new_values: newValues,
    ip_address: await getClientIP(),
    user_agent: navigator.userAgent
  })
}

// Usage
await logAdminActivity({
  action: 'update',
  resourceType: 'bus',
  resourceId: busId,
  oldValues: { status: 'active' },
  newValues: { status: 'maintenance' }
})
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "@supabase/supabase-js": "^2.38.0",
    "@tanstack/react-table": "^8.10.0",
    "recharts": "^2.10.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "zustand": "^4.4.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.292.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "papaparse": "^5.4.1",
    "react-day-picker": "^8.10.0",
    "sonner": "^1.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.9.0",
    "@types/react": "^18.2.0",
    "@types/papaparse": "^5.3.14",
    "typescript": "^5.2.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.53.0",
    "prettier": "^3.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

---

## 🚀 Getting Started Commands

```bash
# 1. Create Next.js project
cd C:\Users\BRAM
npx create-next-app@latest GerakKitaAdmin

# Choose options:
# - TypeScript: Yes
# - ESLint: Yes
# - Tailwind CSS: Yes
# - src/ directory: Yes
# - App Router: Yes
# - Import alias: Yes (@/*)

# 2. Navigate to project
cd GerakKitaAdmin

# 3. Install additional dependencies
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
npm install @tanstack/react-table recharts
npm install react-hook-form @hookform/resolvers zod
npm install zustand date-fns lucide-react
npm install clsx tailwind-merge

# 4. Install shadcn/ui
npx shadcn-ui@latest init

# 5. Add shadcn components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast

# 6. Create .env.local file
echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key" >> .env.local

# 7. Run development server
npm run dev
```

---

## 📚 Resources & References

### **Documentation**
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Table](https://tanstack.com/table/v8)
- [Recharts](https://recharts.org/)

### **Design Inspiration**
- [Vercel Analytics Dashboard](https://vercel.com/analytics)
- [Supabase Dashboard](https://app.supabase.com/)
- [Tailwind UI Components](https://tailwindui.com/)

---

## ✅ Success Criteria

MVP dianggap berhasil jika:

1. ✅ Admin bisa login dan logout dengan aman
2. ✅ Dashboard menampilkan real-time statistics
3. ✅ Semua 5 modules (Bus, User, Driver, Transaction, Dashboard) berfungsi
4. ✅ CRUD operations bekerja untuk Bus, User, Driver
5. ✅ Transaction dapat difilter dan di-export
6. ✅ UI responsive dan sesuai dengan mockup
7. ✅ Real-time updates berfungsi (optional tapi recommended)
8. ✅ Deploy berhasil ke Vercel

---

## 🎯 Next Steps After MVP

Setelah MVP selesai, fitur-fitur tambahan yang bisa dikembangkan:

1. **Advanced Analytics**
   - Predictive analytics untuk demand forecasting
   - Route optimization suggestions
   - Driver performance trends

2. **Notifications System**
   - Email notifications untuk events penting
   - In-app notifications
   - WhatsApp integration (optional)

3. **Route Management**
   - Visual route creator dengan map
   - Bus stop management
   - Schedule management

4. **Reporting**
   - Custom report builder
   - Automated daily/weekly/monthly reports
   - PDF export

5. **Mobile App** (Admin)
   - React Native app untuk monitoring on-the-go
   - Push notifications

---

## 🎯 Implementation Priority

### **Priority 1: Core MVP (Must Have)**
1. ✅ Authentication & Authorization
2. ✅ Dashboard Overview (Stats only, charts later)
3. ✅ Bus Management (Full CRUD)
4. ✅ Driver Management (Full CRUD)
5. ✅ Transaction Management (Read-only + Export)

### **Priority 2: Enhanced MVP (Should Have)**
6. ✅ User Management (Full features)
7. ✅ Charts & Analytics
8. ✅ Advanced Filtering
9. ✅ Activity Logs

### **Priority 3: Post-MVP (Nice to Have)**
10. ⏸️ Route Management Module
11. ⏸️ Email Notifications
12. ⏸️ Advanced Analytics & Reporting
13. ⏸️ Real-time Dashboard Updates
14. ⏸️ Refund Functionality

---

## 📝 Notes & Recommendations

### **Timeline**
- **Revised MVP Timeline**: **22 days** (3+ weeks with buffer)
- **Original estimate** (18 days) terlalu optimis
- **Buffer time** sudah included untuk unexpected issues
- **1 developer full-time** assumption

### **Maintenance**
- Estimasi **4-8 jam per minggu** untuk updates & bug fixes
- Weekly monitoring untuk error logs (Sentry)
- Monthly dependency updates (security patches)

### **Scalability**
- Architecture mendukung **horizontal scaling**
- Supabase dapat handle 500+ concurrent connections
- Next.js di Vercel auto-scales berdasarkan traffic
- Consider upgrading Supabase plan jika:
  - Database size > 500MB
  - Monthly Active Users > 50,000
  - Real-time connections > 200 concurrent

### **Cost Estimation**

**Development Phase (Free):**
- ✅ Supabase Free Tier: 500MB database, 2GB storage
- ✅ Vercel Free Tier: Unlimited deploys, 100GB bandwidth
- ✅ All libraries: Open source (gratis)

**Production Phase:**
| Service | Free Tier | Paid Plan (if needed) |
|---------|-----------|----------------------|
| Supabase | 500MB, 2GB storage | $25/mo (Pro) - 8GB database |
| Vercel | 100GB bandwidth | $20/mo (Pro) - 1TB bandwidth |
| Sentry | 5K errors/mo | $26/mo - 50K errors |
| Domain | - | ~$12/year |
| **Total** | **$0/month** | **$71/month** (jika exceed free tier) |

> [!TIP]
> Mulai dengan free tier, upgrade saat sudah production dan traffic meningkat.

### **Security Reminders**
- [ ] Never commit `.env.local` to Git
- [ ] Use strong passwords untuk admin accounts
- [ ] Enable 2FA untuk Supabase dashboard (recommended)
- [ ] Regular security audits setiap 3 bulan
- [ ] Keep dependencies updated (npm audit)

### **Pre-Launch Checklist**
- [ ] Generate TypeScript types dari Supabase
- [ ] Create seed data untuk development
- [ ] Setup staging environment
- [ ] Create first super admin account
- [ ] Test all CRUD operations
- [ ] Run Lighthouse audit (target score > 90)
- [ ] Setup error monitoring (Sentry)
- [ ] Create user documentation
- [ ] Backup database (automated daily backups)

---

---

## 📋 Quick Start Checklist

Sebelum memulai development:

- [ ] **Stakeholder Alignment**
  - [ ] Confirm Route Management tidak di MVP (manual assignment saja)
  - [ ] Confirm minimum browser support (modern browsers only)
  - [ ] Confirm budget untuk third-party services (Sentry, etc.)

- [ ] **Technical Preparation**
  - [ ] Access ke Supabase project dari mobile app
  - [ ] Generate TypeScript types: `npx supabase gen types typescript --project-id [id] > types/database.ts`
  - [ ] Create mockup data untuk development
  - [ ] Setup Git repository dengan proper `.gitignore`

- [ ] **Development Environment**
  - [ ] Node.js 18+ installed
  - [ ] Code editor (VS Code recommended)
  - [ ] Git configured
  - [ ] Supabase CLI installed (optional tapi recommended)

---

*Dokumentasi ini dibuat pada: 21 Januari 2026*  
*Direvisi pada: 21 Januari 2026*  
*Author: Antigravity AI*  
*Version: 2.0* (Revised with improvements)
