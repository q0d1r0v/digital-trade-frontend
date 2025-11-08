import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Loading } from "@/utils/loadingController";
import api from "@/utils/axios";
import { API_ENDPOINTS } from "@/constants/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      Loading.show();
      const endpoint = API_ENDPOINTS.AUTH.LOGIN;
      const { data } = await api.post(endpoint, {
        email,
        password,
      });
      localStorage.setItem("access_data", JSON.stringify(data));
      localStorage.setItem("access_token", data.access_token ?? "");
      localStorage.setItem("refresh_token", data.refresh_token ?? "");
      navigate("/app/");
    } catch (err: any) {
      toast.error(err?.message || t("loginPage.error.messages"));
    } finally {
      Loading.hide();
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          padding: 6,
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 10,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          {t("loginPage.title")}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          {t("loginPage.enterYourCredentials")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            fullWidth
            label={t("loginPage.username")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            required
            slotProps={{
              input: {
                sx: {
                  borderRadius: "9999px",
                  backgroundColor: "#f5f5f5",
                  padding: "2px",
                },
              },
            }}
          />
          <TextField
            fullWidth
            label={t("loginPage.password")}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="start"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "9999px",
                  backgroundColor: "#f5f5f5",
                  padding: "2px",
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="!shadow-none h-15 !rounded-full"
            disabled={!email || !password}
          >
            {t("loginPage.title")}
          </Button>
        </Box>
        <Box textAlign="center" mt={3}>
          <Button
            variant="text"
            size="small"
            color="primary"
            className="!rounded-full"
          >
            {t("loginPage.forgotPassword")}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
