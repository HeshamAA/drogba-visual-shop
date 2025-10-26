import { useTranslation } from 'react-i18next';
import { Truck, Shield, Sparkles } from 'lucide-react';

export default function ValueProposition() {
  const { t } = useTranslation();

  const values = [
    {
      icon: Truck,
      title: t('values.shipping.title'),
      desc: t('values.shipping.desc'),
    },
    {
      icon: Sparkles,
      title: t('values.quality.title'),
      desc: t('values.quality.desc'),
    },
    {
      icon: Shield,
      title: t('values.secure.title'),
      desc: t('values.secure.desc'),
    },
  ];

  return (
    <section className="py-16 px-4 bg-secondary">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          {t('sections.values')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
