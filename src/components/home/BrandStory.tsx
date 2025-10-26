import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function BrandStory() {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 container mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-2 md:order-1"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">
            {t('sections.aboutUs', 'من نحن')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('sections.brandStoryTitle', 'قصة دروجبا')}
          </h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              {t(
                'sections.brandStory1',
                'دروجبا هي أكثر من مجرد علامة تجارية للملابس - إنها حركة. ولدنا من شوارع القاهرة، نجمع بين الأسلوب الحضري والجودة العالية.'
              )}
            </p>
            <p>
              {t(
                'sections.brandStory2',
                'كل قطعة نصممها تحكي قصة، تعكس روح الشباب العربي وطموحاته. نحن نؤمن بأن الأزياء هي شكل من أشكال التعبير عن الذات.'
              )}
            </p>
          </div>
          <Button asChild size="lg" className="mt-8">
            <Link to="/products">{t('common.shopNow', 'تسوق الآن')}</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-1 md:order-2"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop"
              alt="Brand Story"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
