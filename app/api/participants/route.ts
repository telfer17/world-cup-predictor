import { DEADLINE } from "@/lib/constants";
import { normaliseUkPhone, stripToDigits } from "@/lib/phone";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  if (Date.now() >= DEADLINE.getTime()) {
    return Response.json({ error: "Entries are closed." }, { status: 403 });
  }

  let body: { name?: string; club_contact?: string; phone?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const clubContact =
    typeof body.club_contact === "string" ? body.club_contact.trim() : "";
  const phoneDigits =
    typeof body.phone === "string" ? stripToDigits(body.phone) : "";
  const phone = normaliseUkPhone(phoneDigits);

  if (!name) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }
  if (!clubContact) {
    return Response.json({ error: "Club contact is required." }, { status: 400 });
  }
  if (!phoneDigits) {
    return Response.json({ error: "Contact number is required." }, { status: 400 });
  }
  if (!phone) {
    return Response.json(
      { error: "Enter a valid UK phone number (11 digits)." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("participants")
    .insert({ name, club_contact: clubContact, phone })
    .select("id")
    .single();

  if (error) {
    console.error("participant insert failed:", error);
    return Response.json({ error: "Failed to create entry." }, { status: 500 });
  }

  return Response.json({ id: data.id });
}
