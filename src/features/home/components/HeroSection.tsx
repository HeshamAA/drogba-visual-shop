import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HeroSection() {
  const { t } = useTranslation();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const heroVideo = "/hero.webm";
  const heroFallback = "/hero_optimized.mp4";

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* شاشة تحميل سوداء */}
      {!videoLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: videoLoaded ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-black z-20 flex items-center justify-center"
        >
          {/* ممكن تحط لوجو بسيط أو سبينر هنا لو حبيت */}
        </motion.div>
      )}

      {/* الفيديو الخلفي */}
      <motion.video
        autoPlay
        muted
        loop
        playsInline
        onCanPlayThrough={() => setVideoLoaded(true)}
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: videoLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <source src={heroVideo} type="video/webm" />
        <source src={heroFallback} type="video/mp4" />
      </motion.video>

      {/* تدرج فوق الفيديو */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none" />

      {/* المحتوى */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: videoLoaded ? 1 : 0, y: videoLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            {t("hero.headline")}
          </h1>

          <Link to="/products">
            <Button
              size="lg"
              variant="gradient"
              className="font-semibold px-8 py-6 text-lg shadow-lg shadow-black/10"
            >
              {t("hero.cta")}
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* مؤشر السحب للأسفل */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: videoLoaded ? 1 : 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
