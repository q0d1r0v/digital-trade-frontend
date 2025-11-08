import React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Box,
} from "@mui/material";
import { Icon } from "@iconify/react";

interface FilePickerProps {
  value: File | File[] | null;
  onChange: (file: File | File[] | null) => void;
  fullWidth?: boolean;
  className?: string;
  clearable?: boolean;
  multiple?: boolean;
}

export const FilePicker: React.FC<FilePickerProps> = ({
  value,
  onChange,
  fullWidth,
  className,
  multiple = false,
}) => {
  const fileInputId = React.useId();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        const newFiles = Array.from(e.target.files);
        const existingFiles = Array.isArray(value) ? value : [];
        onChange([...existingFiles, ...newFiles]);
      } else {
        onChange(e.target.files[0]);
      }
    }
  };

  const handleClear = () => {
    onChange(null);
  };

  const handleDeleteFile = (indexToDelete: number) => {
    if (Array.isArray(value)) {
      const newFiles = value.filter((_, index) => index !== indexToDelete);
      onChange(newFiles.length > 0 ? newFiles : null);
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        id={fileInputId}
        style={{ display: "none" }}
        multiple={multiple}
        onChange={handleFileChange}
      />

      <TextField
        variant="outlined"
        fullWidth={fullWidth}
        onClick={() => document.getElementById(fileInputId)?.click()}
        multiline
        maxRows={4}
        slotProps={{
          input: {
            readOnly: true,
            sx: {
              cursor: "pointer",
              minHeight: "56px",
              alignItems: "center",
              py: 1,
              "& .MuiInputBase-input": {
                cursor: "pointer",
                display: "none",
              },
            },
            startAdornment: value ? (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  flex: 1,
                  py: 0.5,
                }}
              >
                {Array.isArray(value) ? (
                  value.map((file, index) => (
                    <Chip
                      key={`${file.name}-${index}`}
                      label={file.name}
                      onDelete={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(index);
                      }}
                      deleteIcon={<Icon icon="ri-close-line" />}
                      size="small"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ))
                ) : (
                  <Chip
                    label={value.name}
                    onDelete={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    deleteIcon={<Icon icon="ri-close-line" />}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </Box>
            ) : null,
            endAdornment: (
              <InputAdornment
                position="end"
                className="w-full flex items-center justify-end"
              >
                <IconButton component="span">
                  <Icon icon="ri-upload-cloud-line" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
};
