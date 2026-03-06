import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-ink px-4">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-heading font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Pagina nao encontrada</p>
        <a href="/" className="text-accent underline hover:text-brand-blue-soft transition-colors">
          Voltar ao inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
