import test from "node:test";
import assert from "node:assert/strict";
import { instagramUrl, publicPosts, readInstagram } from "../server/instagram-feed.mjs";

const accountId = "0123456789abcdef01234567";
const publicPost = {
  status: "published", content: "VDZ Brigade", publishedAt: "2026-06-01T10:00:00Z",
  platform: "instagram", platformPostUrl: "https://www.instagram.com/p/Example123/",
  mediaItems: [{ type: "image", url: "https://cdn.example.com/vdz.jpg" }],
};
test("Alleen echte Instagram-permalinks", () => {
  assert.equal(instagramUrl("https://instagram.com.evil.test/p/x/"), null);
  assert.equal(instagramUrl("https://www.instagram.com/accounts/login/"), null);
  assert.equal(instagramUrl("javascript:alert(1)"), null);
  assert.equal(instagramUrl(publicPost.platformPostUrl), publicPost.platformPostUrl);
});
test("Geen drafts, ingeplande posts, Stories of toekomstige posts", () => {
  for (const status of ["draft", "scheduled", "failed", "publishing", "cancelled"]) assert.deepEqual(publicPosts([{ ...publicPost, status }], accountId, true), []);
  assert.deepEqual(publicPosts([{ ...publicPost, publishedAt: "2099-01-01" }], accountId, true), []);
  assert.deepEqual(publicPosts([{ ...publicPost, mediaProductType: "STORY" }], accountId, true), []);
});
test("Publieke output bevat alleen beeld, caption, datum en Instagram-link", () => {
  const [post] = publicPosts([{ ...publicPost, accessToken: "private", analytics: { revenue: 99 } }], accountId, true);
  assert.equal(post.caption, "VDZ Brigade");
  assert.equal(post.image, "https://cdn.example.com/vdz.jpg");
  assert.equal("accessToken" in post, false);
  assert.equal("analytics" in post, false);
});
test("Carrousels en video-covers blijven gekoppeld aan de originele post", () => {
  const posts = publicPosts([{ ...publicPost, mediaItems: [...publicPost.mediaItems, { type: "video", url: "https://cdn.example.com/video.mp4", thumbnail: "https://cdn.example.com/cover.jpg" }] }], accountId, true);
  assert.equal(posts.length, 2);
  assert.equal(posts[1].image, "https://cdn.example.com/cover.jpg");
  assert.equal(posts[1].video, true);
  assert.equal(posts[0].link, posts[1].link);
});
test("Zernio-posts van andere accounts worden niet getoond", () => {
  const post = { ...publicPost, platforms: [{ platform: "instagram", accountId: "other", status: "published", platformPostUrl: publicPost.platformPostUrl }] };
  assert.deepEqual(publicPosts([post], accountId), []);
  post.platforms[0].accountId = { _id: accountId };
  assert.equal(publicPosts([post], accountId).length, 1);
});
test("Alle requests zijn GET en gebruiken uitsluitend @socialnow.nl", async () => {
  const requests = [];
  const posts = await readInstagram("test-key", async (url, options) => {
    requests.push({ url, options });
    return { ok: true, json: async () => url.endsWith("/accounts") ? { accounts: [
      { _id: "another", platform: "instagram", username: "client" },
      { _id: accountId, platform: "instagram", username: "@socialnow.nl", isActive: true },
    ] } : { posts: url.includes("source=external") ? [publicPost] : [] } };
  });
  assert.equal(posts.length, 1);
  assert.equal(requests.length, 3);
  for (const request of requests) {
    assert.equal(request.options.method, undefined);
    if (!request.url.endsWith("/accounts")) assert.equal(new URL(request.url).searchParams.get("accountId"), accountId);
  }
});
test("Ontbrekend SocialNow-account haalt geen klantposts op", async () => {
  let calls = 0;
  await assert.rejects(readInstagram("test-key", async () => { calls++; return { ok: true, json: async () => ({ accounts: [{ _id: accountId, platform: "instagram", username: "client" }] }) }; }));
  assert.equal(calls, 1);
});
test("Providerfouten lekken geen ruwe response of sleutel", async () => {
  await assert.rejects(readInstagram("test-key", async () => ({ ok: false, status: 401 })), { message: "Zernio status 401" });
});
