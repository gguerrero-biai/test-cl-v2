import { json } from "@sveltejs/kit";

export async function GET() {
  const PUBLIC_HUBSPOT = process.env.PUBLIC_HUBSPOT || import.meta.env.VITE_PUBLIC_HUBSPOT;

  return json({
    publicHubspot: PUBLIC_HUBSPOT,
  });
}
