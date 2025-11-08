import React, { forwardRef } from "react";
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Grow,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";

// Transition komponenti
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Grow ref={ref} {...props} />;
});

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  className,
  width = "sm",
  height,
}) => {
  return (
    <MuiDialog
      open={open}
      maxWidth={false}
      fullWidth
      keepMounted
      slots={{
        transition: Transition,
      }}
      slotProps={{
        paper: {
          sx: {
            width: width
              ? typeof width === "number"
                ? `${width}px`
                : width
              : "auto",
            height: height
              ? typeof height === "number"
                ? `${height}px`
                : height
              : "auto",
          },
        },
      }}
      className={className}
    >
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        {children}
      </DialogContent>

      {actions && <DialogActions sx={{ p: 1 }}>{actions}</DialogActions>}
    </MuiDialog>
  );
};
