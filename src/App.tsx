// UI Components
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Contexts
import { ThemeProvider } from "@/features/theme/ThemeContext";

// i18n
import "@/shared/i18n/config";

// Pages
import { PublicRoutes, NotFoundRoute } from "@/app/routes/PublicRoutes";
import { AdminRoutes } from "@/app/routes/AdminRoutes";

const App = () => (
  <HelmetProvider>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster position="top-center" />
        <BrowserRouter>
          <Routes>
            {AdminRoutes()}
            {PublicRoutes()}
            {NotFoundRoute()}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
