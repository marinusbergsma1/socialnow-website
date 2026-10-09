import { readInstagram, PROFILE_URL } from "../server/instagram-feed.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  // Only public media from @socialnow.nl is returned. No caller-supplied account IDs.
  if (!process.env.ZERNIO_API_KEY) return res.status(200).json({ profile: PROFILE_URL, posts: [] });
  try {
    const posts = await readInstagram(process.env.ZERNIO_API_KEY);
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({ profile: PROFILE_URL, posts });
  } catch {
    res.setHeader("Cache-Control", "no-store");
    return res.status(503).json({ profile: PROFILE_URL, posts: [] });
  }
}
