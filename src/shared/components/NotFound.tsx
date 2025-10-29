import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl">{t('notFound.title')}</h2>
      <p className="text-muted-foreground">
        {t('notFound.description')}
      </p>
      <Button onClick={() => navigate('/')}>
        {t('notFound.backToHome')}
      </Button>
    </div>
  );
}
