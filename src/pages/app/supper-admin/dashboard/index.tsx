import { useTranslation } from "react-i18next";

export const SuperAdminDashboardPage = () => {
  const { t } = useTranslation();
  return <div className="bg-white p-4 rounded-2xl">{t("welcome")}</div>;
};
