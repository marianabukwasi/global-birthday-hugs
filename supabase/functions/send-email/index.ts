import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const COLORS = {
  bg: "#080E24",
  gold: "#F5C842",
  text: "#F0F4FF",
  muted: "#8B8FA3",
  cardBg: "#0D1B4B",
};

function layout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <!-- Logo -->
  <tr><td align="center" style="padding-bottom:32px;">
    <span style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:bold;color:${COLORS.text};">
      Birthday<span style="color:${COLORS.gold};">CORE</span>
    </span>
  </td></tr>
  <!-- Content -->
  <tr><td style="background:${COLORS.cardBg};border-radius:16px;padding:40px 32px;">
    ${content}
  </td></tr>
  <!-- Footer -->
  <tr><td align="center" style="padding-top:32px;">
    <p style="color:${COLORS.muted};font-size:13px;font-style:italic;margin:0;">
      Everybody deserves to be celebrated.
    </p>
    <p style="color:${COLORS.muted};font-size:11px;margin:8px 0 0;">
      © ${new Date().getFullYear()} BirthdayCORE
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function btn(text: string, url: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td>
    <a href="${url}" style="display:inline-block;background:${COLORS.gold};color:${COLORS.bg};font-weight:bold;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
      ${text}
    </a>
  </td></tr></table>`;
}

function h1(text: string): string {
  return `<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;color:${COLORS.text};margin:0 0 16px;">${text}</h1>`;
}

function p(text: string): string {
  return `<p style="color:${COLORS.text};font-size:15px;line-height:1.6;margin:0 0 16px;">${text}</p>`;
}

interface EmailData {
  template: string;
  to: string;
  data: Record<string, any>;
}

function buildEmail(template: string, data: Record<string, any>): { subject: string; html: string } {
  const siteUrl = Deno.env.get("SUPABASE_URL")?.replace(".supabase.co", "") || "https://birthdaycore.com";

  switch (template) {
    case "welcome_giver":
      return {
        subject: "You just made someone's birthday better.",
        html: layout(
          h1("Welcome to BirthdayCORE") +
          p(`You have joined <strong style="color:${COLORS.gold}">${data.totalUsers || "thousands of"}</strong> people around the world who believe everybody deserves to be celebrated.`) +
          p("Your wish is on its way.") +
          p("Thank you for showing up. It matters more than you know.")
        ),
      };

    case "welcome_receiver":
      return {
        subject: "Your birthday page is live.",
        html: layout(
          h1("BirthdayCORE is ready for you") +
          p("Share your link and watch the world show up.") +
          p(`Your birthday is in <strong style="color:${COLORS.gold}">${data.daysUntil || "?"}</strong> days.`) +
          btn("Share My Link", data.shareLink || siteUrl)
        ),
      };

    case "wish_received":
      return {
        subject: `A wish just arrived from ${data.country || "somewhere special"}`,
        html: layout(
          h1("A new wish arrived ✨") +
          p(`Someone in <strong style="color:${COLORS.gold}">${data.country || "the world"}</strong> just sent you a birthday wish.`) +
          p(`You now have <strong style="color:${COLORS.gold}">${data.wishCount || 1}</strong> wishes from <strong style="color:${COLORS.gold}">${data.countryCount || 1}</strong> countries.`) +
          btn("View My Page", data.pageUrl || siteUrl)
        ),
      };

    case "birthday_countdown":
      return {
        subject: "7 days until your birthday.",
        html: layout(
          h1("7 days to go 🎉") +
          p(`<strong style="color:${COLORS.gold}">${data.wishCount || 0}</strong> people from <strong style="color:${COLORS.gold}">${data.countryCount || 0}</strong> countries are ready to celebrate you.`) +
          p("Verify your identity so your gift arrives on time.") +
          btn("Verify Now", data.verifyUrl || siteUrl)
        ),
      };

    case "verification_reminder":
      return {
        subject: "Action needed — verify your details before your birthday.",
        html: layout(
          h1("Your birthday is in 48 hours") +
          p("Verify your bank details now so you can receive your Birthday Pot.") +
          p("This only takes a minute.") +
          btn("Verify Now", data.verifyUrl || siteUrl)
        ),
      };

    case "birthday_morning":
      return {
        subject: `Happy Birthday ${data.name || ""}. The world showed up.`,
        html: layout(
          h1(`Happy Birthday, <span style="color:${COLORS.gold}">${data.name || "Celebrant"}</span> 🎂`) +
          p("Today is your day.") +
          p(`<strong style="color:${COLORS.gold}">${data.wishCount || 0}</strong> people from <strong style="color:${COLORS.gold}">${data.countryCount || 0}</strong> countries celebrated you.`) +
          p("Your Birthday Card and video are ready.") +
          btn("See My Birthday", data.revealUrl || siteUrl)
        ),
      };

    case "thank_you_received":
      return {
        subject: `${data.name || "Someone"} just thanked you.`,
        html: layout(
          h1("You were part of their birthday") +
          p(`<strong style="color:${COLORS.gold}">${data.name || "Someone"}</strong> sent a thank you to everyone who celebrated them.`) +
          p("You were part of their birthday. Thank you for showing up.")
        ),
      };

    case "birthday_nudge":
      return {
        subject: "Your birthday is coming up.",
        html: layout(
          h1("Your turn to be celebrated") +
          p("You have celebrated others on BirthdayCORE. Now it is your turn.") +
          p("Set up your birthday page and let the world celebrate you.") +
          btn("Set Up My Birthday", data.setupUrl || `${siteUrl}/setup`)
        ),
      };

    default:
      return { subject: "BirthdayCORE", html: layout(p("You have a notification from BirthdayCORE.")) };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { template, to, data }: EmailData = await req.json();

    if (!template || !to) {
      return new Response(JSON.stringify({ error: "Missing template or to" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { subject, html } = buildEmail(template, data || {});

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BirthdayCORE <noreply@birthdaycore.com>",
        to: [to],
        subject,
        html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Resend error", details: result }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
