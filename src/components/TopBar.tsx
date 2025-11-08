import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@mui/material";
import { useSidebarStore } from "@/store/sidebarStore";
import { LanguageSwitcher } from "@/components/ChangeLang";

export const TopBar = () => {
  const { isMobileOpen, isMobile, toggleMobileOpen, toggleMini, isMini } =
    useSidebarStore();

  const handleMobileToggle = () => {
    toggleMobileOpen();
  };

  const handleMiniToggle = () => {
    toggleMini();
  };

  return (
    <header className="bg-[#fff] flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        {isMobile ? (
          <Button
            onClick={handleMobileToggle}
            sx={{
              minWidth: "auto",
              padding: "12px",
              borderRadius: 10,
            }}
          >
            <Icon
              icon={
                isMobileOpen ? "ri-menu-unfold-2-line" : "ri-menu-fold-2-line"
              }
              width={24}
              height={24}
              className="text-blue-600"
            />
          </Button>
        ) : (
          <div className="flex items-center justify-start gap-4">
            <Button
              onClick={handleMiniToggle}
              sx={{
                minWidth: "auto",
                padding: "12px",
                borderRadius: 10,
              }}
              size="large"
            >
              <Icon
                icon={!isMini ? "ri-menu-unfold-2-line" : "ri-menu-fold-2-line"}
                width={24}
                height={24}
                className="text-blue-600"
              />
            </Button>
            <div className="text-lg text-gray-500 hidden md:flex items-center gap-2 select-none">
              <kbd className="px-1 py-0.5 rounded bg-[#f8f8f8]">Ctrl</kbd>+
              <kbd className="px-1 py-0.5 rounded bg-[#f8f8f8]">K</kbd>
              🔎
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
      </div>
    </header>
  );
};
