import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostBySlug, getAdjacentPosts, allPosts } from '../data/posts';
import Button from './Button';
import ProgressiveImage from './ProgressiveImage';
import {
  Calendar, Clock, ChevronLeft, ChevronRight, Plus, Minus,
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

// Kleine, afhankelijkheidsvrije weergave van een beperkte markdown-subset:
// ## kop, - lijstitem, > citaat, en losse alinea's. Geen externe library
// nodig voor wat de dagelijkse schrijftaak feitelijk produceert.
function renderBody(body: string): React.ReactNode[] {
  const blocks = body.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  const out: React.ReactNode[] = [];

  blocks.forEach((block, i) => {
    const lines = block.split('\n').map((l) => l.trim());

    if (lines[0].startsWith('## ')) {
      out.push(
        <h2 key={i} className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter leading-tight mt-12 mb-5 first:mt-0">
          {lines[0].slice(3)}
        </h2>
      );
      return;
    }

    if (lines[0].startsWith('# ')) {
      out.push(
        <h2 key={i} className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter leading-tight mt-12 mb-5 first:mt-0">
          {lines[0].slice(2)}
        </h2>
      );
      return;
    }

    if (lines.every((l) => l.startsWith('- '))) {
      out.push(
        <ul key={i} className="space-y-3 my-6">
          {lines.map((l, j) => (
            <li key={j} className="flex items-start gap-3 text-gray-300 leading-relaxed">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#25D366] shrink-0" />
              <span>{l.slice(2)}</span>
            </li>
          ))}
        </ul>
      );
      return;
    }

    if (lines[0].startsWith('> ')) {
      out.push(
        <blockquote key={i} className="my-8 border-l-2 border-[#25D366] pl-6 text-xl md:text-2xl font-bold text-white leading-snug">
          {lines.map((l) => l.replace(/^>\s?/, '')).join(' ')}
        </blockquote>
      );
      return;
    }

    out.push(
      <p key={i} className="text-gray-300 leading-relaxed text-base md:text-lg mb-6">
        {block}
      </p>
    );
  });

  return out;
}

const BlogPostPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  useSEO({
    title: post ? post.title : 'Artikel niet gevonden',
    description: post?.excerpt || 'Dit artikel bestaat niet of is verplaatst.',
    path: slug ? `/blog/${slug}` : '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Artikel niet gevonden</h1>
        <Button variant="green" icon onClick={() => navigate('/blog')}>
          TERUG NAAR BLOG
        </Button>
      </div>
    );
  }

  const { prev, next } = getAdjacentPosts(post.slug);
  const showAdjacent = allPosts.length > 1;

  return (
    <div className="min-h-screen text-white">
      {/* Hero */}
      <div className="relative w-full h-[45vh] md:h-[60vh] overflow-hidden">
        <ProgressiveImage
          src={`${import.meta.env.BASE_URL}${post.coverImage}`}
          alt={post.title}
          className="w-full h-full"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4 text-[11px] font-bold uppercase tracking-widest text-white/60">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(post.date)}
              </span>
              {post.readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {post.readTime}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-[0.95] tracking-tighter">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="border-l-2 border-white/10 pl-6 md:pl-10">
          {renderBody(post.body)}
        </div>
      </div>

      {/* FAQ */}
      {post.faqs && post.faqs.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 md:px-12 pb-16 md:pb-24">
          <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter mb-8">
            Veelgestelde <span className="text-[#25D366]">vragen</span>
          </h2>
          <div className="space-y-3">
            {post.faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="sn-warp-tile rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                  >
                    <span className="font-bold text-white text-sm md:text-base">{faq.question}</span>
                    <span className="shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      {isOpen ? <Minus size={14} className="text-[#25D366]" /> : <Plus size={14} className="text-white/50" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 md:px-6 pb-5 md:pb-6 text-gray-400 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 pb-16 md:pb-20">
        <div className="sn-warp-tile relative rounded-[2.5rem] p-8 md:p-14 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/5 via-transparent to-[#00A3E0]/5 opacity-50" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-5">
              Benieuwd wat dit <span className="text-[#25D366]">voor jou</span> doet?
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-8 font-medium leading-relaxed">
              Vraag een gratis proof of concept aan, zonder verplichting.
            </p>
            <Button variant="green" icon onClick={onOpenBooking} className="!px-10 !h-[52px] !text-base">
              Neem Contact Op
            </Button>
          </div>
        </div>
      </div>

      {/* Adjacent posts */}
      {showAdjacent && (
        <div className="max-w-4xl mx-auto px-6 md:px-12 pb-20">
          <div className="border-t border-white/10 pt-10 flex flex-col items-center gap-10">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">Meer artikelen</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <button
                onClick={() => navigate(`/blog/${prev.slug}`)}
                className="sn-warp-tile group relative rounded-2xl p-6 md:p-8 cursor-pointer hover:!border-[#F62961] transition-all overflow-hidden text-left"
              >
                <div className="relative z-10">
                  <span className="text-[#F62961] text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 opacity-60 group-hover:opacity-100 transition-opacity">Vorige</span>
                  <h3 className="text-base md:text-lg font-black uppercase text-white flex items-center gap-3 tracking-tighter">
                    <ChevronLeft size={18} className="group-hover:-translate-x-2 transition-transform text-[#F62961] shrink-0" />
                    {prev.title}
                  </h3>
                </div>
              </button>

              <button
                onClick={() => navigate(`/blog/${next.slug}`)}
                className="sn-warp-tile group relative rounded-2xl p-6 md:p-8 cursor-pointer hover:!border-[#00A3E0] transition-all overflow-hidden text-left md:text-right"
              >
                <div className="relative z-10">
                  <span className="text-[#00A3E0] text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 opacity-60 group-hover:opacity-100 transition-opacity">Volgende</span>
                  <h3 className="text-base md:text-lg font-black uppercase text-white flex items-center md:justify-end gap-3 tracking-tighter">
                    {next.title}
                    <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform text-[#00A3E0] shrink-0" />
                  </h3>
                </div>
              </button>
            </div>

            <button
              onClick={() => navigate('/blog')}
              className="text-white/40 hover:text-[#00A3E0] font-bold uppercase tracking-[0.3em] text-[10px] transition-colors mt-2"
            >
              Alle artikelen bekijken
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage;
