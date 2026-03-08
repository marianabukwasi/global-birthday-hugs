import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, MessageSquare, DollarSign, Flag, Gift, Mail, Shield,
  BarChart3, Trash2, XCircle, Ban, Clock, RefreshCw,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const FUNC_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/admin-actions`;

const AdminDashboard = () => {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const callAdmin = useCallback(
    async (action: string, payload?: any) => {
      const res = await fetch(FUNC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, password, payload }),
      });
      if (res.status === 401) {
        setAuthed(false);
        toast({ title: "Unauthorized" });
        return null;
      }
      return res.json();
    },
    [password]
  );

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const data = await callAdmin("get_stats");
    if (data && !data.error) {
      setStats(data);
      setAuthed(true);
    }
    setLoading(false);
  }, [callAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchStats();
  };

  const handleAction = async (action: string, payload: any) => {
    await callAdmin(action, payload);
    toast({ title: "Action completed" });
    fetchStats();
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="rounded-2xl bg-card border border-border p-8 w-full max-w-sm space-y-4"
        >
          <div className="flex items-center gap-2 justify-center mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Access</h1>
          </div>
          <Input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary/50 border-border"
          />
          <Button
            type="submit"
            className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
            disabled={loading}
          >
            {loading ? "Verifying…" : "Enter"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-display text-lg font-bold text-foreground">
            Birthday<span className="text-gradient-gold">CORE</span> Admin
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchStats} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} sub={`${stats?.giverCount || 0} Givers · ${stats?.receiverCount || 0} Receivers`} />
          <StatCard icon={MessageSquare} label="Wishes" value={stats?.totalWishes || 0} sub={`${stats?.wishesToday || 0} today`} />
          <StatCard icon={DollarSign} label="Revenue (month)" value={`$${((stats?.monthRevenueCents || 0) / 100).toFixed(2)}`} sub="Subscriptions + fees" />
          <StatCard icon={Flag} label="Flagged" value={stats?.reports?.length || 0} sub="Pending reports" />
        </div>

        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList className="bg-card border border-border flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="reports" className="text-xs">Flagged Content</TabsTrigger>
            <TabsTrigger value="tickets" className="text-xs">Support</TabsTrigger>
            <TabsTrigger value="growth" className="text-xs">User Growth</TabsTrigger>
            <TabsTrigger value="spins" className="text-xs">Glimmer Draw</TabsTrigger>
            <TabsTrigger value="logs" className="text-xs">Activity Log</TabsTrigger>
          </TabsList>

          {/* Flagged Content */}
          <TabsContent value="reports" className="space-y-3">
            {stats?.reports?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No pending reports.</p>
            )}
            {stats?.reports?.map((r: any) => (
              <div key={r.id} className="rounded-xl bg-card border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium mb-1">Wish: {r.wish_id?.slice(0, 8)}…</p>
                    <p className="text-xs text-muted-foreground mb-1">Reason: {r.reason}</p>
                    {r.details && <p className="text-xs text-muted-foreground">{r.details}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="text-xs border-destructive text-destructive" onClick={() => handleAction("remove_content", { reportId: r.id })}>
                      <Trash2 className="w-3 h-3 mr-1" /> Remove
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs" onClick={() => handleAction("dismiss_report", { reportId: r.id })}>
                      <XCircle className="w-3 h-3 mr-1" /> Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Support Tickets */}
          <TabsContent value="tickets" className="space-y-3">
            {stats?.tickets?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No tickets.</p>
            )}
            {stats?.tickets?.map((t: any) => (
              <div key={t.id} className="rounded-xl bg-card border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{t.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.status === "open" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.email} · {t.subject}</p>
                    <p className="text-sm text-foreground/80 mt-1">{t.message?.slice(0, 200)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  {t.status === "open" && (
                    <Button size="sm" variant="outline" className="text-xs shrink-0" onClick={() => handleAction("reply_ticket", { ticketId: t.id })}>
                      <Mail className="w-3 h-3 mr-1" /> Mark Replied
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* User Growth */}
          <TabsContent value="growth">
            <div className="rounded-xl bg-card border border-border p-4">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Signups (last 30 days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.growth || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v: string) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Glimmer Draw */}
          <TabsContent value="spins" className="space-y-3">
            {stats?.spins?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No spins yet.</p>
            )}
            {stats?.spins?.slice(0, 20).map((s: any) => (
              <div key={s.id} className="rounded-xl bg-card border border-border p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">{s.prize_name || "No prize"}</p>
                  <p className="text-xs text-muted-foreground">{s.spin_type} · {new Date(s.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.is_claimed ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {s.is_claimed ? "Claimed" : "Unclaimed"}
                </span>
              </div>
            ))}
          </TabsContent>

          {/* Activity Log */}
          <TabsContent value="logs" className="space-y-2">
            {stats?.logs?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No activity yet.</p>
            )}
            {stats?.logs?.map((l: any) => (
              <div key={l.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</span>
                <span className="text-xs text-foreground font-medium">{l.action}</span>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: any; sub: string }) => (
  <div className="rounded-xl bg-card border border-border p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className="font-display text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{sub}</p>
  </div>
);

export default AdminDashboard;
