import { useState, useEffect, useMemo, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import { useSidebarStore } from "@/store/sidebarStore";
import { useSystemStore } from "@/store/useSystemStore";
import { t } from "i18next";

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
        userPerm.startsWith(required) || required.startsWith(userPerm),
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

export const SearchMenuDialog = ({ navItems, setNavItems }: Props) => {
  const navigate = useNavigate();
  const { setActiveId, setMobileOpen, isMobile } = useSidebarStore();
  const { system } = useSystemStore();

  // ref
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredNavItems = useMemo(() => {
    const userPermissions = system?.permissions?.available?.permissions || [];

    if (!Array.isArray(userPermissions)) {
      return navItems;
    }

    const filtered = filterNavItemsByPermissions(navItems, userPermissions);
    return filtered;
  }, [navItems, system?.permissions]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const allItems = useMemo(() => {
    const list: (NavChild & { parentTitle: string })[] = [];
    filteredNavItems.forEach((parent) => {
      if (parent.children) {
        parent.children.forEach((child) => {
          list.push({ ...child, parentTitle: parent.title });
        });
      }
    });
    return list;
  }, [filteredNavItems]);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.parentTitle.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, allItems]);

  const handleSelect = (item: NavChild & { parentTitle: string }) => {
    setActiveId(item.id);

    setNavItems((prevItems) =>
      prevItems.map((parent) => {
        if (parent.title === item.parentTitle) {
          return { ...parent, isOpen: true };
        }
        return parent;
      }),
    );

    navigate(item.path);
    if (isMobile) {
      setMobileOpen(false);
    }
    setOpen(false);
  };

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      slotProps={{
        transition: {
          onEntered: () => {
            inputRef.current?.focus();
          },
        },
      }}
    >
      <DialogTitle className="flex items-center justify-between">
        <span className="text-2xl">{t("defaults.searchMenu")}</span>
      </DialogTitle>
      <DialogContent>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xl">🔎</span>
          <TextField
            inputRef={inputRef}
            autoFocus
            fullWidth
            hiddenLabel
            placeholder={t("defaults.searchMenu") + "..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered.length > 0) {
                handleSelect(filtered[0]);
              }
            }}
            variant="standard"
            className="!mt-2"
            slotProps={{
              input: {
                sx: {
                  fontSize: "1.25rem",
                  py: 2,
                },
              },
            }}
            sx={{
              "& .MuiInputBase-root": {
                fontSize: "1.25rem",
                height: "56px",
              },
            }}
          />
          <div className="text-sm text-gray-500 hidden md:flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-gray-100">Ctrl</kbd>+
            <kbd className="px-1 py-0.5 rounded bg-gray-100">K</kbd>
          </div>
        </div>

        {filtered.length === 0 && query.trim() !== "" ? (
          <div className="text-center text-gray-500 py-6">
            {t("defaults.noFound")}
          </div>
        ) : (
          <List>
            {filtered.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => handleSelect(item)}
                  sx={{
                    borderRadius: 10,
                  }}
                >
                  {item.icon && (
                    <ListItemIcon>
                      <Icon
                        icon="ri-checkbox-blank-circle-fill"
                        className="text-blue-600"
                        width={8}
                      />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={item.title}
                    secondary={item.parentTitle}
                    className="!text-2xl"
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
