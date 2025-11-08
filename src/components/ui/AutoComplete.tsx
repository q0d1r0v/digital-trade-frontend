import React, { useState, useMemo } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Box,
  IconButton,
  FormHelperText,
  TextField,
  InputAdornment,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";

interface SelectOption {
  [key: string]: any;
}

interface CustomSelectProps<T extends SelectOption> {
  label: string;
  items: T[];
  value: string | number | Array<string | number>;
  onChange: (value: string | number | Array<string | number>) => void;
  multiple?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
  itemKey: string;
  itemLabel: string;
  itemDisabled?: string;
  searchable?: boolean;
}

function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function AutoComplete<T extends SelectOption>({
  label,
  items,
  value,
  onChange,
  multiple = false,
  clearable = false,
  fullWidth = true,
  required = false,
  disabled = false,
  error = false,
  helperText,
  placeholder,
  size = "medium",
  variant = "outlined",
  itemKey,
  itemLabel,
  itemDisabled,
  searchable = false,
}: CustomSelectProps<T>) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (
    event: SelectChangeEvent<string | number | Array<string | number>>,
  ) => {
    const selectedValue = event.target.value;

    if (multiple) {
      const valueArray =
        typeof selectedValue === "string"
          ? selectedValue.split(",")
          : (selectedValue as Array<string | number>);
      onChange(valueArray);
    } else {
      onChange(selectedValue as string | number);
    }
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(multiple ? [] : "");
  };

  const renderLabel = (val: string | number): React.ReactNode => {
    const item = items.find((i) => {
      const itemValue = getNestedValue(i, itemKey);
      return itemValue === val || itemValue?.toString() === val?.toString();
    });

    return item ? (getNestedValue(item, itemLabel) ?? val) : val;
  };

  const isValueEmpty = multiple
    ? Array.isArray(value) && value.length === 0
    : value === "" || value === null || value === undefined;

  const displayValue = multiple && Array.isArray(value) ? value : value;

  const filteredItems = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      const labelValue = getNestedValue(item, itemLabel);
      const labelString =
        typeof labelValue === "string" || typeof labelValue === "number"
          ? String(labelValue).toLowerCase()
          : "";
      return labelString.includes(query);
    });
  }, [items, searchQuery, searchable, itemLabel]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleMenuOpen = () => {
    setSearchQuery("");
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      error={error}
      size={size}
      variant={variant}
    >
      <InputLabel shrink={!isValueEmpty || undefined}>{label}</InputLabel>

      <Select
        multiple={multiple}
        value={displayValue}
        onChange={handleChange}
        onOpen={handleMenuOpen}
        input={
          <OutlinedInput
            label={label}
            sx={{
              borderRadius: "30px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "30px",
              },
            }}
          />
        }
        displayEmpty={!!placeholder}
        sx={{
          borderRadius: "30px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "30px",
          },
          "& .MuiSelect-select": {
            borderRadius: "30px",
          },
        }}
        renderValue={(selected) => {
          if (isValueEmpty && placeholder) {
            return (
              <em style={{ color: "rgba(0, 0, 0, 0.6)" }}>{placeholder}</em>
            );
          }

          if (multiple) {
            const selectedArray = selected as Array<string | number>;
            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selectedArray.map((val) => (
                  <Chip
                    key={val}
                    label={renderLabel(val)}
                    size={size}
                    sx={{ maxWidth: "200px" }}
                  />
                ))}
              </Box>
            );
          } else {
            return renderLabel(selected as string | number);
          }
        }}
        endAdornment={
          clearable && !isValueEmpty && !disabled ? (
            <IconButton
              onClick={handleClear}
              size="small"
              sx={{
                marginRight: 1,
                visibility: isValueEmpty ? "hidden" : "visible",
              }}
              tabIndex={-1}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ) : null
        }
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
              width: "auto",
            },
          },
          autoFocus: false,
        }}
      >
        {searchable && (
          <Box
            sx={{
              px: 2,
              py: 1,
              position: "sticky",
              top: 0,
              bgcolor: "background.paper",
              zIndex: 1,
            }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder={t("defaults.search")}
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            />
          </Box>
        )}

        {placeholder && !multiple && (
          <MenuItem value="" disabled>
            <em>{placeholder}</em>
          </MenuItem>
        )}

        {filteredItems.map((item) => {
          const val = getNestedValue(item, itemKey);
          const label = getNestedValue(item, itemLabel);
          const stringVal =
            typeof val === "string" || typeof val === "number"
              ? val
              : val?.toString() || "";

          const isDisabled = itemDisabled
            ? Boolean(getNestedValue(item, itemDisabled))
            : false;

          return (
            <MenuItem key={stringVal} value={stringVal} disabled={isDisabled}>
              {label as React.ReactNode}
            </MenuItem>
          );
        })}

        {filteredItems.length === 0 && (
          <MenuItem disabled>
            <em>{t("defaults.no_data")}</em>
          </MenuItem>
        )}
      </Select>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
