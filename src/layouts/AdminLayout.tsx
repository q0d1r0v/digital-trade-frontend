import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { SideNavBar } from "@/components/SideNavBar";
import { SearchMenuDialog } from "@/components/SearchMenu";
import { useSystemStore } from "@/store/useSystemStore";
import { Loading } from "@/utils/loadingController";
import { useTranslation } from "react-i18next";

interface NavChild {
  id: string;
  title: string;
  path: string;
  permissions?: string[];
  icon?: string;
}

interface NavItem {
  id: string;
  title: string;
  icon?: string;
  isOpen: boolean;
  permissions: string[];
  children?: NavChild[];
}

export const AdminLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { fetchSystemData } = useSystemStore();
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  // super admin permissions
  const superAdminUsersPermissions = [
    "admin.user.user.index",
    "admin.user.user.store",
    "admin.user.user.show",
    "admin.user.user.update",
    "admin.user.user.delete",
    "admin.user.user.restore",
  ];
  const superAdminRolesPermissions = [
    "admin.user.role.index",
    "admin.user.role.store",
    "admin.user.role.show",
    "admin.user.role.update",
    "admin.user.role.delete",
    "admin.user.role.restore",
  ];
  const superAdminCompanyPermissions = [
    "admin.company.company.index",
    "admin.company.company.store",
    "admin.company.company.show",
    "admin.company.company.update",
    "admin.company.company.delete",
  ];
  const superAdminCurrencyPermissions = [
    "admin.system.currency.index",
    "admin.system.currency.store",
    "admin.system.currency.show",
    "admin.system.currency.update",
    "admin.system.currency.delete",
    "admin.system.currency.restore",
  ];

  // admin permissions
  const adminCompanyPermissions = [
    "company.company.company.index",
    "company.company.company.store",
    "company.company.company.show",
    "company.company.company.update",
    "company.company.company.delete",
    "company.company.company.restore",
  ];

  const user = useSystemStore((state) => state.user);
  const loading = useSystemStore((state) => state.loading);

  useEffect(() => {
    setNavItems([
      {
        id: "dashboard-1",
        title: t("navBar.dashboard"),
        icon: "hugeicons:dashboard-browsing",
        permissions: superAdminUsersPermissions,
        isOpen: false,
        children: [
          {
            id: "analytics-1",
            title: t("navBar.dashboard"),
            path: "/app/",
            icon: "ri-checkbox-blank-circle-fill",
            permissions: superAdminUsersPermissions,
          },
        ],
      },
      {
        id: "company-1",
        title: t("navBar.company"),
        icon: "hugeicons:building-06",
        isOpen: false,
        permissions: superAdminCompanyPermissions,
        children: [
          {
            id: "all-company-1",
            title: t("navBar.company"),
            permissions: superAdminCompanyPermissions,
            path: "/app/super/admin/company",
            icon: "ri-checkbox-blank-circle-fill",
          },
        ],
      },
      {
        id: "users-1",
        title: t("navBar.users"),
        icon: "hugeicons:user-group-03",
        isOpen: false,
        permissions: superAdminUsersPermissions,
        children: [
          {
            id: "all-users-1",
            title: t("navBar.users"),
            permissions: superAdminUsersPermissions,
            path: "/app/super/admin/users",
            icon: "ri-checkbox-blank-circle-fill",
          },
          {
            id: "user-roles-2",
            title: t("navBar.roles"),
            permissions: superAdminRolesPermissions,
            path: "/app/super/admin/roles",
            icon: "ri-checkbox-blank-circle-fill",
          },
        ],
      },
      {
        id: "currency-1",
        title: t("navBar.currency"),
        icon: "hugeicons:bitcoin-money-01",
        isOpen: false,
        permissions: [],
        children: [
          {
            id: "all-currrency-1",
            title: t("navBar.currency"),
            permissions: superAdminCurrencyPermissions,
            path: "/app/super/admin/currency",
            icon: "ri-checkbox-blank-circle-fill",
          },
        ],
      },
      {
        id: "admin-users-1",
        title: t("navBar.users"),
        icon: "hugeicons:user-group-03",
        isOpen: false,
        permissions: [],
        children: [
          {
            id: "all-users-1",
            title: t("navBar.users"),
            permissions: adminCompanyPermissions,
            path: "/app/admin/users",
            icon: "ri-checkbox-blank-circle-fill",
          },
        ],
      },
      {
        id: "admin-company-1",
        title: t("navBar.company"),
        icon: "hugeicons:building-06",
        isOpen: false,
        permissions: [],
        children: [
          {
            id: "all-company-1",
            title: t("navBar.company"),
            permissions: adminCompanyPermissions,
            path: "/app/admin/company",
            icon: "ri-checkbox-blank-circle-fill",
          },
        ],
      },
    ]);
  }, [i18n.language]);
  useEffect(() => {
    if (loading) {
      Loading.show();
    } else {
      Loading.hide();
    }

    return () => {
      Loading.hide();
    };
  }, [loading]);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    user?.type && (
      <div className="flex h-screen bg-[#f8f8f8]">
        <SideNavBar navItems={navItems} setNavItems={setNavItems} />
        <SearchMenuDialog navItems={navItems} setNavItems={setNavItems} />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-auto">
            <div className="h-full w-full rounded-2xl p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    )
  );
};
