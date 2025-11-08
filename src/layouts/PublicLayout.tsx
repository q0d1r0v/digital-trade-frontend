import { Outlet } from "react-router-dom";
import { LanguageSwitcher } from "@/components/ChangeLang";

export const PublicLayout = () => {
  return (
    <div>
      <header className="flex justify-end p-4">
        <LanguageSwitcher />
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};
