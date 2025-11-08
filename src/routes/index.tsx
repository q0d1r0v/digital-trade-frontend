import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

// public pages
import { IndexPage } from "@/pages/public/index";
import { LoginPage } from "@/pages/public/auth/LoginPage";
import { NotFoundPage } from "@/pages/public/404";

// protected pages
import { ProtectedRoute } from "./ProtectedRoute";

// super admin pages
import { SuperAdminDashboardPage } from "@/pages/app/supper-admin/dashboard/index";
import { SuperAdminCompanyPage } from "@/pages/app/supper-admin/company/index";
import { SuperAdminUsersPage } from "@/pages/app/supper-admin/users";
import { SuperAdminUserRolesPage } from "@/pages/app/supper-admin/roles";
import { SuperAdminCurrencyPage } from "@/pages/app/supper-admin/currency";

// admin pages
import { AdminCompanyPage } from "@/pages/app/admin/company";
import { SuperAdminPublicPage } from "@/pages/app/supper-admin/public";
import { AdminPublicPage } from "@/pages/app/admin/public";
import { AdminUsersPage } from "@/pages/app/admin/users";

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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [{ index: true, element: <IndexPage /> }],
  },
  {
    path: "/auth/",
    element: <PublicLayout />,
    children: [{ path: "login", element: <LoginPage /> }],
  },
  {
    path: "/app/",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute permissions={superAdminUsersPermissions}>
            <SuperAdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "super/admin/public",
        element: (
          <ProtectedRoute permissions={[]}>
            <SuperAdminPublicPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "super/admin/users",
        element: (
          <ProtectedRoute permissions={superAdminUsersPermissions}>
            <SuperAdminUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "super/admin/company",
        element: (
          <ProtectedRoute permissions={superAdminCompanyPermissions}>
            <SuperAdminCompanyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "super/admin/roles",
        element: (
          <ProtectedRoute permissions={superAdminRolesPermissions}>
            <SuperAdminUserRolesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "super/admin/currency",
        element: (
          <ProtectedRoute permissions={superAdminCurrencyPermissions}>
            <SuperAdminCurrencyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/public",
        element: (
          <ProtectedRoute permissions={[]}>
            <AdminPublicPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute permissions={adminCompanyPermissions}>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/company",
        element: (
          <ProtectedRoute permissions={adminCompanyPermissions}>
            <AdminCompanyPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
