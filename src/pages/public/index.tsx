import { useTranslation } from "react-i18next";

export const IndexPage = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center mt-2">
      <div>{t("welcome")}</div>
    </div>
  );
};
