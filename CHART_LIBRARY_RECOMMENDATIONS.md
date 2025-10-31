# Chart Library Recommendations

## 🏆 Primary Recommendation: **Recharts**

### Why Recharts?
- ✅ **React-native** - Built specifically for React (no wrapper needed)
- ✅ **TypeScript support** - Full type definitions included
- ✅ **Next.js compatible** - Works perfectly with Next.js 14
- ✅ **Lightweight** - Smaller bundle size than alternatives
- ✅ **Customizable** - Easy to style with Tailwind CSS
- ✅ **Active maintenance** - Well-maintained and widely used

### Installation
```bash
npm install recharts
```

### Example Implementation

#### Revenue Chart (Line Chart)
```tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatPrice } from '@/helper';

interface RevenueChartProps {
  selectedPeriod: string;
  monthlyRevenue: Array<{ month: string; revenue: number; bookings: number }>;
  currency?: string;
}

export default function RevenueChart({
  selectedPeriod,
  monthlyRevenue,
  currency,
}: RevenueChartProps) {
  const data = monthlyRevenue.slice(-6);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">Monthly Revenue</h2>
          <div className="text-sm text-secondary-600">
            {selectedPeriod === '1d' && 'Last 24 hours'}
            {selectedPeriod === '7d' && 'Last 7 days'}
            {selectedPeriod === '30d' && 'Last 30 days'}
            {selectedPeriod === '90d' && 'Last 90 days'}
            {selectedPeriod === '1y' && 'Last year'}
          </div>
        </div>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => formatPrice(value, currency)}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value: number) => formatPrice(value, currency)}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="bookings" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Bookings"
              yAxisId="right"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

#### Demographics Chart (Pie Chart)
```tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DemographicsChartProps {
  demographics: {
    totalAdults: number;
    totalChildren: number;
    totalGuests: number;
    adultPercentage: string;
    childrenPercentage: string;
  };
}

const COLORS = ['#3b82f6', '#10b981'];

export default function DemographicsChart({ demographics }: DemographicsChartProps) {
  const { totalAdults, totalChildren } = demographics;

  const data = [
    { name: 'Adults', value: totalAdults },
    { name: 'Children', value: totalChildren },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Guest Demographics</h2>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

#### Room Status Chart (Donut/Pie Chart)
```tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RoomStatusChartProps {
  availableRooms: number;
  totalRooms: number;
}

const COLORS = ['#10b981', '#f59e0b'];

export default function RoomStatusChart({ availableRooms, totalRooms }: RoomStatusChartProps) {
  const occupiedRooms = totalRooms - availableRooms;
  
  const data = [
    { name: 'Available', value: availableRooms },
    { name: 'Occupied', value: occupiedRooms },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Room Status</h2>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

---

## Alternative Options

### 2. Chart.js with react-chartjs-2
```bash
npm install chart.js react-chartjs-2
```
- Most popular charting library overall
- Very feature-rich and flexible
- Large community and extensive documentation

### 3. Tremor Charts (Tailwind-based)
```bash
npm install @tremor/react
```
- Built with Tailwind CSS
- Perfect for dashboards
- Modern, polished UI out of the box

### 4. Nivo
```bash
npm install @nivo/core @nivo/line @nivo/pie
```
- Beautiful charts with animations
- React-first design
- Many chart types available

---

## Quick Comparison

| Feature | Recharts | Chart.js | Tremor | Nivo |
|---------|----------|----------|--------|------|
| Bundle Size | Small | Medium | Small | Medium |
| React Native | ✅ | ⚠️ (Wrapper) | ✅ | ✅ |
| TypeScript | ✅ | ✅ | ✅ | ✅ |
| Customization | Easy | Advanced | Easy | Medium |
| Learning Curve | Low | Medium | Low | Low |
| Tailwind Friendly | ✅ | ⚠️ | ✅✅ | ✅ |

---

## Recommendation

**Start with Recharts** - It provides the best balance of:
- Ease of use
- React integration
- TypeScript support
- Customization options
- Performance

If you need more advanced features later, you can always migrate to Chart.js or add it alongside Recharts.


