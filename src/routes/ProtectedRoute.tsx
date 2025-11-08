import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSystemStore } from "@/store/useSystemStore";
import { Loading } from "@/utils/loadingController";
import { NoPermissionPage } from "@/pages/NoPermissionPage";

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
};

const hasPermission = (
  userPermissions: string[],
  requiredPermissions: string[] = [],
): boolean => {
  if (!Array.isArray(userPermissions)) return false;
  if (!requiredPermissions?.length) return true;

  const result = requiredPermissions.some((required) =>
    userPermissions.includes(required),
  );

  return result;
};

export const ProtectedRoute = ({
  children,
  roles,
  permissions,
}: ProtectedRouteProps) => {
  const user = useSystemStore((state) => state.user);
  const loading = useSystemStore((state) => state.loading);
  const userPermissions = useSystemStore(
    (state) => state.system?.permissions?.available?.permissions || [],
  );

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

  if (loading) return null;

  if (!user) return <Navigate to="/auth/login" replace />;

  if (roles && !roles.includes(user.type)) {
    return <NoPermissionPage />;
  }

  if (permissions && !hasPermission(userPermissions, permissions)) {
    return <NoPermissionPage />;
  }

  return <>{children}</>;
};
