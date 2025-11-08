import React, { forwardRef } from "react";
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  Grow,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Grow ref={ref} {...props} />;
});

type VariantType = "primary" | "warning" | "danger" | "success";

interface ActionDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant: VariantType;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
}

const variantStyles = {
  primary: {
    color: "#1976d2",
    okButtonColor: "primary" as const,
  },
  success: {
    color: "#2e7d32",
    okButtonColor: "success" as const,
  },
  warning: {
    color: "#ed6c02",
    okButtonColor: "warning" as const,
  },
  danger: {
    color: "#d32f2f",
    okButtonColor: "error" as const,
  },
};

export const ActionDialog: React.FC<ActionDialogProps> = ({
  open,
  onClose,
  title,
  message,
  variant,
  onOk,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
}) => {
  const styles = variantStyles[variant];

  const handleOk = () => {
    if (onOk) {
      onOk();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <MuiDialog
      open={open}
      maxWidth="sm"
      fullWidth
      keepMounted
      slots={{
        transition: Transition,
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: `2px solid ${styles.color}`,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ color: styles.color, fontWeight: 600 }}
        >
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        {onCancel && (
          <Button
            onClick={handleCancel}
            variant="outlined"
            sx={{ minWidth: 80 }}
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={handleOk}
          variant="contained"
          color={styles.okButtonColor}
          sx={{ minWidth: 80 }}
        >
          {okText}
        </Button>
      </DialogActions>
    </MuiDialog>
  );
};
