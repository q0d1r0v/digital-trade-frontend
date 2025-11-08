import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSystemStore } from "@/store/useSystemStore";

export const NoPermissionPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSystemStore();

  // functions
  const redirectToAnotherPage = () => {
    if (user?.type === "director" || user?.type === "employee") {
      navigate("/app/admin/public");
    } else if (user?.type === "admin") {
      navigate("/app/super/admin/public");
    }
  };
  useEffect(() => {
    redirectToAnotherPage();
  }, []);
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{t("error.403.title")}</h1>
      <p>{t("error.403.message")}</p>
    </div>
  );
};
