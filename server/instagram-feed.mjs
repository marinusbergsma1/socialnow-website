export const PROFILE_URL = "https://www.instagram.com/socialnow.nl/";
const httpsUrl = value => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch { return null; }
};
export function instagramUrl(value) {
  const url = httpsUrl(value);
  if (!url) return null;
  const parsed = new URL(url);
  return ["instagram.com", "www.instagram.com"].includes(parsed.hostname) && /^\/(?:[^/]+\/)?(?:p|reel)\/[\w-]+\/?$/.test(parsed.pathname) ? url : null;
}
export function publicPosts(posts, accountId, external = false, now = Date.now()) {
  return (Array.isArray(posts) ? posts : []).flatMap(post => {
    if (["draft", "scheduled", "failed", "cancelled", "publishing"].includes(post.status)) return [];
    const channel = external ? post : (post.platforms || []).find(p => p.platform === "instagram" && p.status === "published" && (p.accountId?._id || p.accountId) === accountId);
    if (!channel || (external && post.platform !== "instagram")) return [];
    const link = instagramUrl(channel.platformPostUrl);
    const publishedAt = channel.publishedAt || post.publishedAt;
    const time = Date.parse(publishedAt);
    if (!link || !Number.isFinite(time) || time > now || post.mediaProductType === "STORY") return [];
    const caption = String(channel.customContent || post.content || "").slice(0, 2200);
    const media = Array.isArray(post.mediaItems) ? post.mediaItems : [];
    const items = media.length ? media : [{ type: post.mediaType, url: post.thumbnailUrl }];
    return items.slice(0, 10).flatMap((item, index) => {
      const image = httpsUrl(item.type === "video" ? item.thumbnail || item.thumbnailUrl || post.thumbnailUrl : item.url);
      if (!image) return [];
      return [{ id: `${link}#${index}`, link, image, caption, publishedAt, video: item.type === "video" }];
    });
  });
}
export async function readInstagram(key, request = fetch) {
  const get = async path => {
    const response = await request(`https://zernio.com/api/v1${path}`, {
      headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`Zernio status ${response.status}`);
    return response.json();
  };
  const accounts = await get("/accounts");
  const account = (accounts.accounts || []).find(a => a.platform === "instagram" && String(a.username || "").replace(/^@/, "").toLowerCase() === "socialnow.nl" && a.isActive !== false);
  if (!account || !/^[a-f\d]{24}$/.test(account._id)) throw new Error("SocialNow Instagram ontbreekt");
  const query = new URLSearchParams({ accountId: account._id, platform: "instagram", limit: "100" });
  const results = await Promise.allSettled([
    get(`/posts?${query}&source=external`),
    get(`/posts?${query}&status=published`),
  ]);
  if (results.every(result => result.status === "rejected")) throw new Error("Instagram-posts niet beschikbaar");
  const posts = results.flatMap((result, index) => result.status === "fulfilled" ? publicPosts(result.value.posts, account._id, index === 0) : []);
  return [...new Map(posts.map(post => [post.id, post])).values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 100);
}
