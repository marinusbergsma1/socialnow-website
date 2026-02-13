import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  useSEO({
    title: 'Privacybeleid',
    description: 'Privacybeleid van SocialNow. Hoe wij omgaan met persoonsgegevens conform de AVG/GDPR.',
    path: '/privacy',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-28 md:pt-36 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-8"
        >
          <ChevronLeft size={14} />
          Terug
        </button>

        <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter mb-4">
          Privacybeleid
        </h1>
        <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-12">
          Laatst bijgewerkt: februari 2026
        </p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-black uppercase text-white tracking-tight mb-3">1. Wie zijn wij</h2>
            <p>SocialNow is een creatief bureau gevestigd aan de Amstelstraat 43G, 1017DA Amsterdam, Nederland. KVK-nummer: 90877179. Voor vragen over privacy kun je contact opnemen via <a href="mailto:info@socialnow.nl" className="text-[#5BA4F5] hover:underline">info@socialnow.nl</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase text-white tracking-tight mb-3">2. Welke gegevens verzamelen wij</h2>
            <p>Wij verzamelen alleen gegevens die je vrijwillig aan ons verstrekt:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-400">
              <li>Naam en e-mailadres (bij contact via formulier of e-mail)</li>
              <li>Telefoonnummer (bij contact via WhatsApp of telefoon)</li>
              <li>Bedrijfsnaam en projectinformatie (bij projectaanvragen)</li>
            </ul>
            <p className="mt-3">Daarnaast gebruiken wij Google Analytics voor geanonimiseerde websitestatistieken (bezoekersaantallen, paginaweergaves, apparaattype).</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase text-white tracking-tight mb-3">3. Waarvoor gebruiken wij je gegevens</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-400">
              <li>Om je vraag of projectaanvraag te beantwoorden</li>
              <li>Om onze dienstverlening te verbeteren</li>
              <li>Om websitestatistieken te analyseren (geanonimiseerd)</li>
            </ul>
            <p className="mt-3">Wij verkopen of delen je gegevens nooit met derden voor marketingdoeleinden.</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase text-white tracking-tight mb-3">4. Bewaartermijn</h2>
            <p>Wij bewaren je persoonsgegevens niet langer dan noodzakelijk voor het doel waarvoor ze zijn verzameld, met een maximale bewaartermijn van 2 jaar na het laatste contact.</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase text-white tracking-tight mb-3">5. Jouw rechten</h2>
            <p>Op grond van de AVG/GDPR heb je recht op:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-400">
              <li>Inzage in je persoonsgegevens</li>
              <li>Correctie of verwijdering van je gegevens</li>
              <li>Beperking van verwerking</li>
              <li>Overdracht van je gegevens (dataportabiliteit)</li>
              <li>Het indienen van een klacht bij de Autoriteit Persoonsgegevens</li>
            </ul>
            <p className="mt-3">Neem contact op via <a href="mailto:info@socialnow.nl" className="text-[#5BA4F5] hover:underline">info@socialnow.nl</a> om een van deze rechten uit te oefenen.</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase text-white tracking-tight mb-3">6. Cookies</h2>
            <p>Wij gebruiken alleen functionele cookies en analytics cookies (Google Analytics) met geanonimiseerde IP-adressen. Er worden geen tracking cookies van derden geplaatst.</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase text-white tracking-tight mb-3">7. Beveiliging</h2>
            <p>Wij nemen passende technische en organisatorische maatregelen om je persoonsgegevens te beschermen tegen verlies, misbruik en ongeautoriseerde toegang.</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase text-white tracking-tight mb-3">8. Wijzigingen</h2>
            <p>Wij behouden het recht om dit privacybeleid te wijzigen. De meest actuele versie is altijd beschikbaar op deze pagina.</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
