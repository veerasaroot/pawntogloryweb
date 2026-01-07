"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-background rounded-xl border border-border shadow-sm">
           <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
           <div className="text-2xl font-bold mt-2">$45,231.89</div>
           <p className="text-xs text-green-500 mt-1">+20.1% from last month</p>
        </div>
        <div className="p-6 bg-background rounded-xl border border-border shadow-sm">
           <div className="text-sm font-medium text-muted-foreground">Active Subscriptions</div>
           <div className="text-2xl font-bold mt-2">+2350</div>
           <p className="text-xs text-green-500 mt-1">+180.1% from last month</p>
        </div>
        <div className="p-6 bg-background rounded-xl border border-border shadow-sm">
           <div className="text-sm font-medium text-muted-foreground">Sales</div>
           <div className="text-2xl font-bold mt-2">+12,234</div>
           <p className="text-xs text-green-500 mt-1">+19% from last month</p>
        </div>
         <div className="p-6 bg-background rounded-xl border border-border shadow-sm">
           <div className="text-sm font-medium text-muted-foreground">Active Now</div>
           <div className="text-2xl font-bold mt-2">+573</div>
           <p className="text-xs text-green-500 mt-1">+201 since last hour</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 p-6 bg-background rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-bold mb-4">Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ background: '#333', border: 'none', borderRadius: '4px', color: '#fff' }}
                />
                <Bar dataKey="sales" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-3 p-6 bg-background rounded-xl border border-border shadow-sm">
           <h3 className="text-lg font-bold mb-4">Recent Sales</h3>
           <div className="space-y-8">
              {[1,2,3,4,5].map(i => (
                 <div key={i} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                       OM
                    </div>
                    <div className="ml-4 space-y-1">
                       <p className="text-sm font-medium leading-none">Olivia Martin</p>
                       <p className="text-xs text-muted-foreground">olivia.martin@email.com</p>
                    </div>
                    <div className="ml-auto font-medium">+$1,999.00</div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
