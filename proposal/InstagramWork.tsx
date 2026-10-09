import React, { useEffect, useState } from "react";
import { ArrowUpRight, Instagram, Play } from "lucide-react";
import { Bento, Tegel } from "./Bento";
import { useInView } from "./motion";
import collection from "../public/data/socialposts.json";
import "./instagram-work.css";

type Post = { id: string; image: string; link: string; caption: string; video?: boolean };
const fallback: Post[] = collection.posts.map(post => ({ id: post.beeld, image: `/images/social/${post.beeld}`, link: collection.profiel, caption: post.titel }));
let feedRequest: Promise<Post[]> | undefined;
function readFeed() {
  return feedRequest ??= fetch("/api/instagram")
    .then(response => response.ok ? response.json() : null)
    .then(data => Array.isArray(data?.posts) ? data.posts.filter((p: Post) => typeof p.image === "string" && typeof p.caption === "string" && /^https:\/\/(www\.)?instagram\.com\//.test(p.link)) : [])
    .catch(() => []);
}
export default function InstagramWork({ project }: { project?: "vdz" }) {
  const { ref, visible } = useInView<HTMLDivElement>("500px 0px");
  const [posts, setPosts] = useState<Post[]>(project ? [] : fallback);
  useEffect(() => {
    if (!visible) return;
    let active = true;
    readFeed().then(feed => { if (active && feed.length) setPosts(feed); });
    return () => { active = false; };
  }, [visible]);
  const selected = project ? posts.filter(post => /\bvdz\b|verduurzaming/i.test(post.caption)).slice(0, 6) : posts.slice(0, 6);
  return <div ref={ref} className={project ? "h-instagram-case" : undefined}>
    {selected.length > 0 && <Bento id={project ? "vdz-instagram" : "social"} label="SocialNow / Instagram" titel={project ? "VDZ op Instagram." : <>Ons werk.<br /><span>Op Instagram.</span></>} swipe className="h-instagram-work">
      {selected.map(post => <Tegel key={post.id} kop="SocialNow" breed={4} soort="foto">
        <a className="h-instagram-post" href={post.link} target="_blank" rel="noopener noreferrer" aria-label="Bekijk op Instagram">
          <img src={post.image} alt={post.caption.slice(0, 160)} loading="lazy" width="1080" height="1350" />
          <span className="h-instagram-post-footer"><Instagram size={16} aria-hidden="true" /><span>{post.caption}</span>{post.video ? <Play size={16} aria-hidden="true" /> : <ArrowUpRight size={16} aria-hidden="true" />}</span>
        </a>
      </Tegel>)}
    </Bento>}
    <div className="h-wrap h-instagram-profile"><a href={collection.profiel} target="_blank" rel="noopener noreferrer"><Instagram size={16} aria-hidden="true" />Bekijk ons werk op Instagram <ArrowUpRight size={16} aria-hidden="true" /></a></div>
  </div>;
}
