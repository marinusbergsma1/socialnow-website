import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { allPosts } from '../data/posts';
import ProgressiveImage from './ProgressiveImage';
import Button from './Button';
import { useSEO } from '../hooks/useSEO';

const accentColors = ['#00A3E0', '#F62961', '#F7E644', '#25D366'];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

const BlogPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const navigate = useNavigate();

  useSEO({
    title: 'Blog',
    description: 'Inzichten over AI websites, content automation, SEO en GEO, geschreven door het team van SocialNow.',
    path: '/blog',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-white">
      {/* Hero Header */}
      <div className="relative pt-32 md:pt-48 pb-16 md:pb-24 px-6 text-center overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto scroll-reveal">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
            <Newspaper size={16} className="text-[#F7E644]" />
            <span className="text-white font-black uppercase tracking-[0.5em] text-[10px]">INZICHTEN</span>
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-8">
            ONZE <span className="text-[#25D366]">BLOG</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
            Wat we leren over AI websites, content automation en vindbaarheid, en hoe we dat toepassen.
          </p>
        </div>
      </div>

      {/* Post Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-32">
        {allPosts.length === 0 ? (
          <p className="text-center text-gray-500">Binnenkort de eerste artikelen.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {allPosts.map((post, idx) => {
              const accentColor = accentColors[idx % accentColors.length];
              const isLarge = idx === 0;

              return (
                <button
                  key={post.slug}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className={`sn-warp-tile group relative rounded-[2rem] overflow-hidden text-left transition-all duration-500 hover:!border-white/25 focus:outline-none scroll-reveal ${isLarge ? 'md:col-span-2' : ''}`}
                  style={{ transitionDelay: `${idx * 120}ms` }}
                >
                  <div className={`relative w-full overflow-hidden ${isLarge ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
                    <ProgressiveImage
                      src={`${import.meta.env.BASE_URL}${post.coverImage}`}
                      alt={post.title}
                      className="w-full h-full transition-transform duration-1000 group-hover:scale-105"
                      objectFit="cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                      {(post.tags || []).slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border text-[10px] font-black uppercase tracking-widest text-white/90"
                          style={{ borderColor: `${accentColor}40` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {formatDate(post.date)}
                      </span>
                      {post.readTime && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {post.readTime}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl md:text-3xl font-black uppercase text-white tracking-tighter leading-none mb-3 group-hover:text-[#25D366] transition-colors duration-500">
                      {post.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-5 max-w-xl">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-black text-white/30 uppercase tracking-widest group-hover:text-[#25D366]/60 transition-colors">
                        Lees artikel
                      </span>
                      <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-transparent transition-all duration-500">
                        <ArrowUpRight size={14} className="text-white/40 group-hover:text-[#25D366] transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundColor: accentColor }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-32 scroll-reveal">
        <div className="sn-warp-tile relative rounded-[3rem] md:rounded-[4rem] p-10 md:p-20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/5 via-transparent to-[#00A3E0]/5 opacity-50" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
              Liever zien dan <span className="text-[#25D366]">lezen</span>?
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Vraag een gratis proof of concept aan en zie in een week wat een AI website voor jouw bedrijf doet.
            </p>
            <Button variant="green" icon onClick={onOpenBooking} className="!px-12 !h-[56px] !text-base shadow-[0_0_30px_rgba(37,211,102,0.2)]">
              Neem Contact Op
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
