import React from 'react';
import { Check } from 'lucide-react';
import Button from './Button';

/**
 * PricingStrip — glasheldere prijzen op de homepage.
 * Website: €1.500 one-pager / €2.500 full stack.
 * Pakket: €3.000 p/m — elke dag posten + website, CRM, content & ads in 1 AI chat.
 */

interface PricingStripProps {
  onOpenBooking?: () => void;
}

const tiers = [
  {
    name: 'ONE-PAGER',
    price: '€1.500',
    period: 'eenmalig',
    color: '#00A3E0',
    highlight: false,
    features: ['Complete one-page website', 'AI-chatbot inbegrepen', 'Conversiegericht ontwerp', 'Binnen 1 week live'],
  },
  {
    name: 'FULL STACK',
    price: '€2.500',
    period: 'eenmalig',
    color: '#00A3E0',
    highlight: false,
    features: ['Volledige meerdere-pagina website', 'CRM & analytics gekoppeld', 'AI-chatbot inbegrepen', 'SEO-fundament'],
  },
  {
    name: 'ALLES-IN-1 AI PAKKET',
    price: '€3.000',
    period: 'per maand',
    color: '#25D366',
    highlight: true,
    features: ['Elke dag posten, volledig uit handen', 'Website, CRM, content & ads', 'Alles samen in 1 overzichtelijke AI chat', 'Advertenties gestuurd op data'],
  },
];

const PricingStrip: React.FC<PricingStripProps> = ({ onOpenBooking }) => (
  <section id="prijzen-strip" className="py-16 md:py-24">
    <div className="container mx-auto max-w-6xl px-4 md:px-6">
      {/* Header */}
      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#0e0e12] border border-[#25D366]/30 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white">
            Gratis proof of concept: demo &amp; rebranding
          </span>
        </div>
        <h2 className="font-black uppercase tracking-tighter text-white leading-none text-4xl md:text-6xl">
          GLASHELDERE <span className="text-[#25D366]">PRIJZEN</span>
        </h2>
        <p className="text-neutral-400 mt-4 max-w-xl mx-auto">
          Geen offertes, geen verrassingen. Dit is het.
        </p>
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`sn-warp-tile relative rounded-xl p-7 md:p-8 flex flex-col ${
              tier.highlight ? '!border-[#25D366]/60' : ''
            }`}
            style={{ '--sn-glow': `${tier.color}66` } as React.CSSProperties}
          >
            {tier.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#25D366] text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                Meest gekozen
              </div>
            )}
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: tier.color }}>
              {tier.name}
            </p>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-none">{tier.price}</span>
              <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-1">{tier.period}</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300 font-medium leading-snug">
                  <Check size={15} className="mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                  {f}
                </li>
              ))}
            </ul>
            {tier.highlight ? (
              <Button variant="green" icon onClick={onOpenBooking} triggerOnHover className="!text-sm justify-center">
                START MET AI
              </Button>
            ) : (
              <Button variant="outline" icon onClick={onOpenBooking} className="!text-sm justify-center !border-[#00A3E0]/50 hover:!border-[#00A3E0] !text-[#00A3E0]">
                PLAN EEN CALL
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Custom AI solutions — buiten de pakketten, opvallend geel */}
      <div
        className="sn-warp-tile relative rounded-xl mt-3 md:mt-4 p-7 md:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 !border-[#F7E644]/50"
        style={{ '--sn-glow': 'rgba(247, 230, 68, 0.5)' } as React.CSSProperties}
      >
        <div className="absolute -top-3 left-6 md:left-10 px-4 py-1 rounded-full bg-[#F7E644] text-black text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
          Custom AI Solutions
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-[#F7E644]">
            Buiten het pakket
          </p>
          <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none mb-3">
            Iets anders nodig? <span className="text-[#F7E644]">Wij bouwen het.</span>
          </h3>
          <p className="text-gray-400 text-sm md:text-base font-medium leading-snug max-w-xl">
            Custom AI-integraties, automations en interne tools op maat: van een AI-agent
            gekoppeld aan je eigen systemen tot volledige workflows die zichzelf draaien.
          </p>
        </div>
        <div className="shrink-0">
          <Button variant="outline" icon onClick={onOpenBooking} className="!text-sm justify-center !border-[#F7E644]/60 hover:!border-[#F7E644] !text-[#F7E644]">
            BESPREEK JE IDEE
          </Button>
        </div>
      </div>

      {/* Proof of concept CTA — prominent */}
      <div className="text-center mt-10 md:mt-12">
        <p className="text-white/50 text-sm font-bold uppercase tracking-widest mb-4">Eerst zien voordat je iets betaalt?</p>
        <Button variant="outline" icon onClick={onOpenBooking} className="!text-sm md:!text-base !px-6 md:!px-8 !border-[#25D366]/60 hover:!border-[#25D366] !text-[#25D366]">
          CLAIM JE GRATIS PROOF OF CONCEPT
        </Button>
      </div>
    </div>
  </section>
);

export default PricingStrip;
