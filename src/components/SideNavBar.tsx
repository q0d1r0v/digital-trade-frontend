import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  useMediaQuery,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Icon } from "@iconify/react";
import { useSidebarStore } from "@/store/sidebarStore";
import { useSystemStore } from "@/store/useSystemStore";
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

interface Props {
  navItems: NavItem[];
  setNavItems: React.Dispatch<React.SetStateAction<NavItem[]>>;
}

const hasPermission = (
  userPermissions: string[],
  requiredPermissions: string[],
): boolean => {
  if (!Array.isArray(userPermissions) || userPermissions.length === 0) {
    return false;
  }

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  return requiredPermissions.some((required) =>
    userPermissions.some(
      (userPerm) =>
        userPerm === required ||
        userPerm.startsWith(required + ".") ||
        required.startsWith(userPerm + "."),
    ),
  );
};

const hasNavItemPermission = (
  userPermissions: string[],
  item: NavItem,
): boolean => {
  return hasPermission(userPermissions, item.permissions);
};

const hasNavChildPermission = (
  userPermissions: string[],
  child: NavChild,
): boolean => {
  if (!child.permissions || child.permissions.length === 0) {
    return true;
  }
  return hasPermission(userPermissions, child.permissions);
};

const filterNavItemsByPermissions = (
  navItems: NavItem[],
  userPermissions: string[],
): NavItem[] => {
  if (!Array.isArray(navItems) || !Array.isArray(userPermissions)) {
    return [];
  }

  return navItems
    .filter((item) => {
      try {
        return hasNavItemPermission(userPermissions, item);
      } catch {
        return false;
      }
    })
    .map((item) => ({
      ...item,
      children: item.children
        ? item.children.filter((child) => {
            try {
              return hasNavChildPermission(userPermissions, child);
            } catch {
              return false;
            }
          })
        : undefined,
    }))
    .filter((item) => !item.children || item.children.length > 0);
};

export const SideNavBar: React.FC<Props> = ({ navItems, setNavItems }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { system } = useSystemStore();
  const {
    isMini,
    isMobileOpen,
    activeId,
    isMobile,
    setActiveId,
    setMobileOpen,
    setIsMobile,
    toggleMini,
  } = useSidebarStore();
  const isMobileSize = useMediaQuery("(max-width:768px)");

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const previousActiveIdRef = useRef<string>("");

  const filteredNavItems = useMemo(() => {
    const userPermissions = system?.permissions?.available?.permissions || [];

    if (!Array.isArray(userPermissions)) {
      return navItems;
    }

    const filtered = filterNavItemsByPermissions(navItems, userPermissions);
    return filtered;
  }, [navItems, system?.permissions]);

  useEffect(() => {
    setIsMobile(isMobileSize);
    if (isMobileSize) {
      setMobileOpen(false);
    }
  }, [isMobileSize, setIsMobile, setMobileOpen]);

  useEffect(() => {
    if (!filteredNavItems.length) return;

    const currentPath = location.pathname;
    let foundActiveId = "";
    let foundParentId = "";

    filteredNavItems.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (child.path === currentPath) {
            foundActiveId = child.id;
            foundParentId = item.id;
          }
        });
      }
    });

    if (foundActiveId && foundActiveId !== previousActiveIdRef.current) {
      previousActiveIdRef.current = foundActiveId;
      setActiveId(foundActiveId);

      if (foundParentId) {
        setNavItems((prevItems) =>
          prevItems.map((item) => {
            if (item.id === foundParentId) {
              return { ...item, isOpen: true };
            }
            return { ...item, isOpen: false };
          }),
        );
      }
    }
  }, [location.pathname, filteredNavItems, setActiveId, setNavItems]);

  const toggleItem = (itemId: string) => {
    if (isMini) {
      toggleMini();
      return;
    }
    setNavItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, isOpen: !item.isOpen };
        }
        return { ...item, isOpen: false };
      }),
    );
  };

  const handleChildClick = (childId: string, path: string) => {
    setActiveId(childId);
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    localStorage.clear();
    navigate("/auth/login");
    if (isMobile) {
      setMobileOpen(false);
    }
    window.location.reload();
  };

  const hasActiveChild = (item: NavItem): boolean => {
    return item.children?.some((child) => child.id === activeId) || false;
  };

  return (
    <>
      {isMobile && isMobileOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.4)",
            zIndex: 1200,
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobileOpen || !isMobile}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        transitionDuration={300}
        sx={{
          width: isMini ? 90 : 320,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMini ? 90 : 320,
            boxSizing: "border-box",
            borderRightStyle: "none",
            bgcolor: "linear-gradient(to bottom, #f8fafc, #ffffff)",
            transition: "width 0.3s ease, transform 0.3s ease",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            height: 82,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem",
            color: "primary.main",
            cursor: isMini ? "pointer" : "default",
            transition: "all 0.3s ease",
            overflow: "hidden",
            fontWeight: 600,
            border: "1px solid rgba(0, 0, 0, 0.04)",
          }}
          onClick={isMini ? toggleMini : undefined}
        >
          <Box
            component="span"
            sx={{
              whiteSpace: "nowrap",
              opacity: isMini ? 0 : 1,
              width: isMini ? 0 : "auto",
              transition: "opacity 0.2s ease, width 0.3s ease",
              fontFamily: "Engram Pro",
            }}
          >
            <div className="flex items-center justify-center gap-4 select-none text-2xl">
              <span>🚀</span>
              <span>
                Digital <span style={{ fontFamily: "sans-serif" }}>-</span>
                Trade
              </span>
            </div>
          </Box>
          {isMini && <div className="text-2xl cursor-pointer">🚀</div>}
        </Box>

        <List sx={{ px: isMini ? 1 : 2, py: 2, flex: 1, overflowY: "auto" }}>
          {filteredNavItems.map((item) => (
            <Box key={item.id}>
              <Tooltip
                title={isMini ? item.title : ""}
                placement="right"
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "primary.main",
                      color: "#fff",
                      borderRadius: 2,
                      fontSize: "0.875rem",
                    },
                  },
                }}
              >
                <ListItemButton
                  onClick={() => toggleItem(item.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isMini ? "center" : "flex-start",
                    gap: 2,
                    borderRadius: 10,
                    mb: 1,
                    px: isMini ? 2 : 3,
                    py: 2,
                    bgcolor: hasActiveChild(item)
                      ? "primary.main"
                      : "transparent",
                    color: hasActiveChild(item) ? "#fff" : "inherit",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: hasActiveChild(item)
                        ? "primary.dark"
                        : "action.hover",
                    },
                    boxShadow: !hasActiveChild(item)
                      ? "inset 0 0 0 1px rgba(13, 60, 254, 0.05)"
                      : "",
                    border: hasActiveChild(item)
                      ? "1px solid rgba(13, 60, 254, 1)"
                      : "",
                  }}
                >
                  {item.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        m: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: hasActiveChild(item) ? "#fff" : "primary.main",
                      }}
                    >
                      <Icon icon={item.icon} width={28} height={28} />
                    </ListItemIcon>
                  )}
                  {!isMini && (
                    <ListItemText
                      primary={
                        <Typography fontWeight={500} noWrap>
                          {item.title}
                        </Typography>
                      }
                    />
                  )}
                  {!isMini && item.children && (
                    <Box
                      sx={{
                        color: hasActiveChild(item) ? "#fff" : "text.secondary",
                      }}
                    >
                      {item.isOpen ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  )}
                </ListItemButton>
              </Tooltip>

              {item.children && (
                <Collapse
                  in={item.isOpen && !isMini}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.id}
                        onClick={() => handleChildClick(child.id, child.path)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          borderRadius: 10,
                          pl: 7,
                          mb: 0.5,
                          transition: "all 0.2s ease",
                          bgcolor:
                            activeId === child.id
                              ? "primary.main"
                              : "transparent",
                          color: activeId === child.id ? "#fff" : "inherit",
                          "&:hover": {
                            bgcolor:
                              activeId === child.id
                                ? "primary.dark"
                                : "action.hover",
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            color:
                              activeId === child.id ? "#fff" : "primary.main",
                          }}
                        >
                          <Icon
                            icon={child.icon || "ri-checkbox-blank-circle-fill"}
                            width={8}
                            height={child.icon ? 20 : 8}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography fontWeight={400} noWrap>
                              {child.title}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>

        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            bgcolor: "background.paper",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            px: isMini ? 1 : 2,
            py: 2,
          }}
        >
          <Tooltip
            title={isMini ? t("defaults.logOut") : ""}
            placement="right"
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: "error.main",
                  color: "#fff",
                  borderRadius: 2,
                  fontSize: "0.875rem",
                },
              },
            }}
          >
            <ListItemButton
              onClick={handleLogoutClick}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: isMini ? "center" : "flex-start",
                gap: 2,
                borderRadius: 10,
                px: isMini ? 2 : 3,
                py: 2,
                bgcolor: "transparent",
                color: "error.main",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "error.light",
                  color: "#fff",
                },
                boxShadow: "inset 0 0 0 1px rgba(211, 47, 47, 0.2)",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  m: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                <Icon icon="solar:logout-2-bold" width={28} height={28} />
              </ListItemIcon>
              {!isMini && (
                <ListItemText
                  primary={
                    <Typography fontWeight={500} noWrap>
                      {t("defaults.logOut")}
                    </Typography>
                  }
                />
              )}
            </ListItemButton>
          </Tooltip>
        </Box>
      </Drawer>

      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              minWidth: 400,
            },
          },
        }}
      >
        <DialogTitle id="logout-dialog-title" sx={{ pb: 1, fontWeight: 600 }}>
          {t("defaults.logOut")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            {t("defaults.logOutText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleLogoutCancel}
            variant="outlined"
            sx={{
              borderRadius: 10,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            {t("defaults.cancel")}
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 10,
              textTransform: "none",
              fontWeight: 500,
            }}
            autoFocus
          >
            {t("defaults.logOut")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
