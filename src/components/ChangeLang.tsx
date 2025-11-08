import { useTranslation } from "react-i18next";
import { FormControl, Select, MenuItem, useTheme, Box } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Icon } from "@iconify/react";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
    window.location.reload();
  };

  return (
    <FormControl
      size="medium"
      sx={{
        minWidth: 160,
        "& .MuiOutlinedInput-root": {
          borderRadius: 10,
          backgroundColor: theme.palette.primary.main,
          color: "white",
          "& fieldset": { border: "none" },
          "&:hover fieldset": { border: "none" },
          "&.Mui-focused fieldset": { border: "none" },
          "& .MuiSelect-icon": { color: "white" },
        },
      }}
    >
      <Select
        value={i18n.language}
        onChange={handleChange}
        displayEmpty
        sx={{
          fontWeight: 500,
          borderRadius: 10,
          "& .MuiSelect-select": {
            py: 1.5,
            px: 2,
          },
        }}
        MenuProps={{
          PaperProps: {
            elevation: 0,
            sx: {
              borderRadius: 2,
              bgcolor: "white",
              mt: 1,
              border: `1px solid ${theme.palette.divider}`,
            },
          },
        }}
      >
        <MenuItem value="en">
          <Box display="flex" alignItems="center" gap={1}>
            <Icon icon="twemoji:flag-united-kingdom" width={20} />
            English
          </Box>
        </MenuItem>

        <MenuItem value="uz">
          <Box display="flex" alignItems="center" gap={1}>
            <Icon icon="twemoji:flag-uzbekistan" width={20} />
            O‘zbek
          </Box>
        </MenuItem>

        <MenuItem value="ru">
          <Box display="flex" alignItems="center" gap={1}>
            <Icon icon="twemoji:flag-russia" width={20} />
            Русский
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
};
