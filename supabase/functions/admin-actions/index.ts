import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, password, payload } = await req.json();

    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    if (!password || password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Log the action
    await supabase.from("admin_logs").insert({
      action,
      details: payload || {},
    });

    switch (action) {
      case "get_stats": {
        const { data: profiles } = await supabase.from("profiles").select("user_type, created_at");
        const { data: wishes } = await supabase.from("wishes").select("created_at");
        const { data: contributions } = await supabase.from("contributions").select("amount_cents, created_at, status");
        const { data: globalStats } = await supabase.from("global_stats").select("*").eq("id", 1).single();
        const { data: reports } = await supabase.from("wish_reports").select("*").eq("status", "pending").order("created_at", { ascending: false });
        const { data: tickets } = await supabase.from("support_tickets").select("*").order("created_at", { ascending: false }).limit(50);
        const { data: spins } = await supabase.from("spins").select("*").order("created_at", { ascending: false }).limit(50);
        const { data: logs } = await supabase.from("admin_logs").select("*").order("created_at", { ascending: false }).limit(50);

        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const givers = profiles?.filter((p: any) => p.user_type === "giver") || [];
        const receivers = profiles?.filter((p: any) => p.user_type === "receiver") || [];
        const wishesToday = wishes?.filter((w: any) => w.created_at?.startsWith(todayStr)) || [];

        const monthContribs = contributions?.filter((c: any) => c.created_at >= monthStart) || [];
        const monthRevenue = monthContribs.reduce((sum: number, c: any) => sum + (c.amount_cents || 0), 0);

        // User growth: signups per day for last 30 days
        const growth: Record<string, number> = {};
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          growth[d.toISOString().slice(0, 10)] = 0;
        }
        profiles?.forEach((p: any) => {
          const day = p.created_at?.slice(0, 10);
          if (day && growth[day] !== undefined) growth[day]++;
        });

        return new Response(JSON.stringify({
          totalUsers: profiles?.length || 0,
          giverCount: givers.length,
          receiverCount: receivers.length,
          totalWishes: wishes?.length || 0,
          wishesToday: wishesToday.length,
          monthRevenueCents: monthRevenue,
          reports: reports || [],
          tickets: tickets || [],
          spins: spins || [],
          logs: logs || [],
          growth: Object.entries(growth).map(([date, count]) => ({ date, count })),
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "dismiss_report": {
        await supabase.from("wish_reports").update({ status: "dismissed" }).eq("id", payload.reportId);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "remove_content": {
        // Remove the wish
        const { data: report } = await supabase.from("wish_reports").select("wish_id").eq("id", payload.reportId).single();
        if (report) {
          await supabase.from("wishes").delete().eq("id", report.wish_id);
        }
        await supabase.from("wish_reports").update({ status: "removed" }).eq("id", payload.reportId);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "reply_ticket": {
        // Mark as replied (actual email send would use send-email function)
        await supabase.from("support_tickets").update({ status: "replied" } as any).eq("id", payload.ticketId);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
