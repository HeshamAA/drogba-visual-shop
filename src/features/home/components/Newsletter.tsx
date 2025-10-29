import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(t("newsletter.success", "تم الاشتراك بنجاح!"));
      setEmail("");
    }
  };

  return (
    <section className="py-20 px-4 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl p-12 md:p-16 text-center bg-surface dark:bg-surface-dark"
      >
        <div className="max-w-2xl mx-auto">
          <Mail className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("newsletter.title", "احصل على خصم 10%")}
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t(
              "newsletter.description",
              "اشترك في نشرتنا الإخبارية واحصل على خصم 10% على طلبك الأول"
            )}
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t("newsletter.placeholder", "أدخل بريدك الإلكتروني")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" size="lg" variant="gradient">
              {t("newsletter.subscribe", "اشترك")}
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
