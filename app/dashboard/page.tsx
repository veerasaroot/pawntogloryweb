"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Trophy,
  Clock,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Users,
} from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import Link from "next/link";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [enrolledTournaments, setEnrolledTournaments] = useState<any[]>([]);
  const [activeMatches, setActiveMatches] = useState<any[]>([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getDashboardData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // Fetch Profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profile);

      // Fetch Enrolled Courses & Progress
      const { data: enrollments } = await supabase
        .from("course_enrollments")
        .select(
          `
          course:courses(id, title, thumbnail, lessons(id))
        `
        )
        .eq("user_id", user.id);

      // Fetch progress for these courses
      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", true);

      const processedCourses =
        enrollments?.map((e: any) => {
          const course = e.course;
          const totalLessons = course.lessons.length;
          const completedLessons =
            progress?.filter((p: any) =>
              course.lessons.some((l: any) => l.id === p.lesson_id)
            ).length || 0;
          const percent =
            totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;
          return { ...course, progress: percent };
        }) || [];

      setEnrolledCourses(processedCourses);

      // Fetch Enrolled Tournaments
      const { data: participants } = await supabase
        .from("participants")
        .select(
          `
          id,
          tournament:tournaments(*)
        `
        )
        .eq("user_id", user.id);

      const tournaments =
        participants?.map((p: any) => ({
          ...p.tournament,
          participantId: p.id,
        })) || [];
      setEnrolledTournaments(tournaments);

      // Fetch Active Matches for Pairing and Results
      if (participants && participants.length > 0) {
        const participantIds = participants.map((p: any) => p.id);
        const { data: matches } = await supabase
          .from("matches")
          .select(
            `
            *,
            tournament:tournaments(title),
            player1:participants(id, user:profiles(username, full_name)),
            player2:participants(id, user:profiles(username, full_name))
          `
          )
          .or(
            `player1_id.in.(${participantIds.join(
              ","
            )}),player2_id.in.(${participantIds.join(",")})`
          )
          .order("created_at", { ascending: false });

        setActiveMatches(matches || []);
      }

      setLoading(false);
    }

    getDashboardData();
  }, [supabase, router]);

  const submitResult = async (matchId: string, result: string) => {
    const { error } = await supabase
      .from("matches")
      .update({ result, verified: false })
      .eq("id", matchId);

    if (error) {
      alert("Error submitting result: " + error.message);
    } else {
      // Refresh matches
      const { data: updatedMatches } = await supabase
        .from("matches")
        .select(
          `
          *,
          tournament:tournaments(title),
          player1:participants(id, user:profiles(username, full_name)),
          player2:participants(id, user:profiles(username, full_name))
        `
        )
        .eq("id", matchId)
        .single();

      setActiveMatches(
        activeMatches.map((m) => (m.id === matchId ? updatedMatches : m))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background border border-border p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <UserAvatar
            name={profile?.full_name || profile?.username}
            avatarUrl={profile?.avatar_url}
            size="lg"
          />
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {profile?.full_name || profile?.username}!
            </h1>
            <p className="text-muted-foreground text-sm">
              Track your progress and upcoming games.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/settings"
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Profile Settings
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content: Courses & Active Games */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active MatchesSection */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Your Matches
              </h2>
            </div>
            {activeMatches.length === 0 ? (
              <div className="bg-muted/30 border border-dashed border-border rounded-xl p-8 text-center">
                <p className="text-muted-foreground">
                  You don't have any active match pairings.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {activeMatches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-background border border-border rounded-xl p-4 shadow-sm space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {match.tournament?.title}
                        </p>
                        <p className="text-sm font-semibold">
                          Round {match.round}
                        </p>
                      </div>
                      {match.result ? (
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          {match.result}
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                          Pending
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-4 py-2">
                      <div className="flex flex-col items-center gap-1 w-1/3">
                        <span className="font-bold text-center truncate w-full">
                          {match.player1?.user?.username || "Bye"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          White
                        </span>
                      </div>
                      <div className="text-xl font-black italic text-muted-foreground/30">
                        VS
                      </div>
                      <div className="flex flex-col items-center gap-1 w-1/3">
                        <span className="font-bold text-center truncate w-full">
                          {match.player2?.user?.username || "Bye"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Black
                        </span>
                      </div>
                    </div>
                    {!match.result && (
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => submitResult(match.id, "1-0")}
                          className="flex-1 text-xs py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
                        >
                          1-0
                        </button>
                        <button
                          onClick={() => submitResult(match.id, "1/2-1/2")}
                          className="flex-1 text-xs py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
                        >
                          1/2-1/2
                        </button>
                        <button
                          onClick={() => submitResult(match.id, "0-1")}
                          className="flex-1 text-xs py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
                        >
                          0-1
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Courses Progress Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                My Courses
              </h2>
              <Link
                href="/course"
                className="text-sm text-foreground hover:underline flex items-center gap-1"
              >
                Explore More <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {enrolledCourses.length === 0 ? (
              <div className="bg-muted/30 border border-dashed border-border rounded-xl p-8 text-center">
                <p className="text-muted-foreground">
                  You haven't enrolled in any courses yet.
                </p>
                <Link
                  href="/course"
                  className="mt-4 inline-block bg-foreground text-background px-6 py-2 rounded-lg font-medium text-sm"
                >
                  Start Learning
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {enrolledCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/course/${course.id}`}
                    className="group bg-background border border-border rounded-xl overflow-hidden hover:border-foreground/50 transition-all shadow-sm"
                  >
                    <div className="aspect-video relative bg-muted">
                      {course.thumbnail && (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-bold truncate group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-medium">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-foreground h-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar: Tournament Enrollments */}
        <div className="space-y-6">
          <section className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              My Tournaments
            </h2>
            <div className="space-y-3">
              {enrolledTournaments.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Not enrolled in any tournaments.
                </p>
              ) : (
                enrolledTournaments.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tournament/${t.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border"
                  >
                    <div className="bg-foreground/5 p-2 rounded-lg text-foreground">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{t.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {t.status}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))
              )}
            </div>
            <Link
              href="/tournament"
              className="block text-center text-xs font-medium py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              Find Tournaments
            </Link>
          </section>

          {/* Quick Stats or Tips */}
          <section className="bg-black text-white rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="font-bold text-lg">Next Move</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-sm text-gray-300">
                  Keep up with your daily puzzles to maintain your rating.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-sm text-gray-300">
                  Join our weekly blitz tournament this Saturday!
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
