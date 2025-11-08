import { useTranslation } from "react-i18next";

export const AdminPublicPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 mb-6">
          <span className="text-5xl">🚀</span>
        </div>

        <h1 className="text-3xl font-semibold text-gray-800 mb-3">
          {t("deafults.selectMenu")}
        </h1>

        <p className="text-gray-500 mb-8 text-lg">
          {t("deafults.selectMenuText")}
        </p>
      </div>
    </div>
  );
};
