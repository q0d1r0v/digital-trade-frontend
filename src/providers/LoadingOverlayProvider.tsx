import React from "react";
import {
  Dialog,
  DialogContent,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { Loading } from "@/utils/loadingController";
import { useTranslation } from "react-i18next";

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const show = React.useCallback(() => setOpen(true), []);
  const hide = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    Loading._register(show, hide);
    return () => {
      Loading._unregister();
    };
  }, [show, hide]);

  return (
    <>
      {children}
      <Dialog
        open={open}
        onClose={() => {}}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(4px)",
            },
          },
          paper: {
            style: {
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            },
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <CircularProgress size={28} thickness={4} />
          </Box>

          <Typography
            variant="body2"
            fontWeight="400"
            sx={{ letterSpacing: "0.5px" }}
          >
            {t("loading.text")}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};
