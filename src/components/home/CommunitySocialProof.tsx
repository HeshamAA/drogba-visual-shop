import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Instagram } from 'lucide-react';

const socialImages = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=600&fit=crop',
];

export default function CommunitySocialProof() {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          {t('sections.community', 'انضم لعائلة #Drogba')}
        </h2>
        <p className="text-muted-foreground text-lg mb-6">
          {t('sections.communityDesc', 'شارك أسلوبك معنا على إنستجرام')}
        </p>
        <a
          href="https://instagram.com/drogba"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
        >
          <Instagram className="w-5 h-5" />
          <span className="font-semibold">@drogba</span>
        </a>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {socialImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <img
              src={image}
              alt={`Community ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Instagram className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
