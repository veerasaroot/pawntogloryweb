"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Users, BookOpen, Trophy, FileText, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardStats {
  usersCount: number;
  coursesCount: number;
  blogsCount: number;
  tournamentsCount: number;
}

interface RecentItem {
  id: string;
  title?: string;
  full_name?: string;
  created_at: string;
  type: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    usersCount: 0,
    coursesCount: 0,
    blogsCount: 0,
    tournamentsCount: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts in parallel
      const [usersRes, coursesRes, blogsRes, tournamentsRes] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true }),
          supabase.from("courses").select("id", { count: "exact", head: true }),
          supabase.from("blogs").select("id", { count: "exact", head: true }),
          supabase
            .from("tournaments")
            .select("id", { count: "exact", head: true }),
        ]);

      setStats({
        usersCount: usersRes.count || 0,
        coursesCount: coursesRes.count || 0,
        blogsCount: blogsRes.count || 0,
        tournamentsCount: tournamentsRes.count || 0,
      });

      // Fetch recent activity
      const [recentUsers, recentCourses, recentBlogs, recentTournaments] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("id, full_name, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("courses")
            .select("id, title, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("blogs")
            .select("id, title, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("tournaments")
            .select("id, title, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
        ]);

      const activity: RecentItem[] = [
        ...(recentUsers.data?.map((u) => ({ ...u, type: "user" })) || []),
        ...(recentCourses.data?.map((c) => ({ ...c, type: "course" })) || []),
        ...(recentBlogs.data?.map((b) => ({ ...b, type: "blog" })) || []),
        ...(recentTournaments.data?.map((t) => ({
          ...t,
          type: "tournament",
        })) || []),
      ]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 10);

      setRecentActivity(activity);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock chart data based on stats
  const chartData = [
    {
      name: "Jan",
      users: Math.floor(stats.usersCount * 0.3),
      courses: Math.floor(stats.coursesCount * 0.2),
    },
    {
      name: "Feb",
      users: Math.floor(stats.usersCount * 0.4),
      courses: Math.floor(stats.coursesCount * 0.3),
    },
    {
      name: "Mar",
      users: Math.floor(stats.usersCount * 0.5),
      courses: Math.floor(stats.coursesCount * 0.5),
    },
    {
      name: "Apr",
      users: Math.floor(stats.usersCount * 0.6),
      courses: Math.floor(stats.coursesCount * 0.6),
    },
    {
      name: "May",
      users: Math.floor(stats.usersCount * 0.8),
      courses: Math.floor(stats.coursesCount * 0.8),
    },
    { name: "Jun", users: stats.usersCount, courses: stats.coursesCount },
  ];

  const statCards = [
    {
      title: "Total Users",
      value: stats.usersCount,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Courses",
      value: stats.coursesCount,
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: "Blog Posts",
      value: stats.blogsCount,
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      title: "Tournaments",
      value: stats.tournamentsCount,
      icon: Trophy,
      color: "bg-orange-500",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="w-4 h-4" />;
      case "course":
        return <BookOpen className="w-4 h-4" />;
      case "blog":
        return <FileText className="w-4 h-4" />;
      case "tournament":
        return <Trophy className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getActivityLabel = (item: RecentItem) => {
    switch (item.type) {
      case "user":
        return `New user: ${item.full_name || "Unknown"}`;
      case "course":
        return `Course created: ${item.title}`;
      case "blog":
        return `Blog published: ${item.title}`;
      case "tournament":
        return `Tournament added: ${item.title}`;
      default:
        return "Activity";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to the admin dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-background border border-border rounded-xl p-6 hover:border-foreground/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-background border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Growth Overview</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  name="Users"
                />
                <Area
                  type="monotone"
                  dataKey="courses"
                  stackId="2"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.3}
                  name="Courses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-background border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No recent activity
              </p>
            ) : (
              recentActivity.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 bg-muted rounded-lg">
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {getActivityLabel(item)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
