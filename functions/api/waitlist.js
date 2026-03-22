export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://tel-os.app",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const { email } = await context.request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const send = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: "panos@billys.io", name: "Panos" }],
          },
        ],
        from: {
          email: "waitlist@tel-os.app",
          name: "tel-os Waitlist",
        },
        subject: `New waitlist signup: ${email}`,
        content: [
          {
            type: "text/plain",
            value: `New waitlist registration:\n\nEmail: ${email}\nTime: ${new Date().toISOString()}\n\n— tel-os waitlist form`,
          },
        ],
      }),
    });

    if (!send.ok) {
      const err = await send.text();
      console.error("MailChannels error:", err);
      return new Response(JSON.stringify({ error: "Failed to send" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error("Waitlist error:", e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://tel-os.app",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
