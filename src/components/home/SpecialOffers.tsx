import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Zap, TrendingUp, Sparkles } from 'lucide-react';

export default function SpecialOffers() {
  const { t } = useTranslation();

  const offers = [
    {
      id: 1,
      title: t('offers.deal1.title'),
      description: t('offers.deal1.description'),
      discount: '30%',
      icon: Zap,
      gradient: 'from-accent/20 to-primary/20',
      borderColor: 'border-accent/50',
    },
    {
      id: 2,
      title: t('offers.deal2.title'),
      description: t('offers.deal2.description'),
      discount: '20%',
      icon: TrendingUp,
      gradient: 'from-primary/20 to-accent/20',
      borderColor: 'border-primary/50',
    },
    {
      id: 3,
      title: t('offers.deal3.title'),
      description: t('offers.deal3.description'),
      discount: '15%',
      icon: Sparkles,
      gradient: 'from-accent/30 to-primary/30',
      borderColor: 'border-accent/40',
    },
  ];

  return (
    <section className="py-16 px-4 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t('sections.specialOffers')}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('offers.subtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer, index) => {
          const Icon = offer.icon;
          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-lg border-2 ${offer.borderColor} bg-gradient-to-br ${offer.gradient} p-8 hover:shadow-lg transition-all duration-300 group`}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-10 h-10 text-accent" />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl font-black text-accent opacity-20"
                  >
                    {offer.discount}
                  </motion.div>
                </div>

                <h3 className="text-2xl font-bold mb-3">
                  {offer.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {offer.description}
                </p>

                <Link to="/products">
                  <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                    {t('cta.shopNow')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
