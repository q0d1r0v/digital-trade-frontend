import { PageHeader } from "@/components/ui/PageHeader";
import { Table } from "@/components/ui/Table";
import { API_ENDPOINTS } from "@/constants/api";
import i18n from "@/i18n";
import api from "@/utils/axios";
import { Loading } from "@/utils/loadingController";
import { Icon } from "@iconify/react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface IAdminCompanyDataTypes {
  pagination: {
    page: number;
    count: number;
  };
  data: any[];
  solo_data: any;
}

export const AdminCompanyPage = () => {
  const { t } = useTranslation();

  // data
  const [dataOfCompany, setDataOfCompany] = useState<IAdminCompanyDataTypes>({
    pagination: {
      page: 1,
      count: 0,
    },
    data: [],
    solo_data: null,
  });
  const [companyDetailsDialogModel, setCompanyDetailsDialogModel] =
    useState(false);

  // columns
  const userColumns = [
    {
      label: t("company.column.id"),
      value: (row: any) => <div>{row.id}</div>,
    },
    {
      label: t("company.column.logo"),
      value: (row: any) => (
        <div>
          {row.logo ? (
            <img
              src={import.meta.env.VITE_API_FILE_URL + row.logo}
              alt="logo"
              width={60}
            />
          ) : (
            <div> {t("defaults.no_data")} </div>
          )}
        </div>
      ),
    },
    {
      label: t("company.column.name"),
      value: (row: any) => <div>{row.name}</div>,
    },
    {
      label: t("company.column.company_name"),
      value: (row: any) => <div>{row.company_name}</div>,
    },
    {
      label: t("company.column.parentCompany"),
      value: (row: any) => (
        <div>
          {row.parent?.company_name ?? t("company.column.parentCompany")}
        </div>
      ),
    },
    {
      label: t("company.column.director"),
      value: (row: any) => <div>{row.director?.profile?.full_name ?? "-"}</div>,
    },
    {
      label: t("company.column.type"),
      value: (row: { type: string }) => (
        <div>
          {row.type === "entity"
            ? t("company.type.entity")
            : t("company.type.physical")}
        </div>
      ),
    },
    {
      label: t("user.table.header.createdAt"),
      value: (row: any) => <div>{row.created_at.split("T")[0]}</div>,
    },
    {
      label: t("user.table.header.show"),
      value: (row: { id: number }) => (
        <div className="flex gap-2">
          <Button
            size="small"
            variant="outlined"
            color="primary"
            sx={{
              minWidth: "auto",
              padding: "12px",
              borderRadius: 10,
            }}
            onClick={() => showCompanyDialogDetails(row.id)}
          >
            <Icon icon="ri-eye-line" />
          </Button>
        </div>
      ),
    },
  ];

  // functions
  const showCompanyDialogDetails = async (companyId: number) => {
    try {
      Loading.show();
      const endpoint =
        API_ENDPOINTS.ADMIN_COMPANY.GET_COMPANY_DETAILS(companyId);
      const { data } = await api.get(endpoint, {
        params: {
          includes: ["director.profile", "parent"],
        },
      });
      setDataOfCompany((prev) => ({
        ...prev,
        solo_data: data.data,
      }));
      setCompanyDetailsDialogModel(true);
    } catch (err: any) {
      toast.error(err.message ?? t("company.load.errorMessage"));
    } finally {
      Loading.hide();
    }
  };
  const loadAdminCompanyData = async () => {
    try {
      Loading.show();
      const endpoint = API_ENDPOINTS.ADMIN_COMPANY.LOAD_COMPANIES;
      const { data } = await api.get(endpoint, {
        params: {
          page: dataOfCompany.pagination.page,
          includes: ["director.profile", "parent"],
        },
      });
      setDataOfCompany((prev) => ({
        ...prev,
        data: data.data,
        pagination: {
          ...prev.pagination,
          count: data.meta.totalPage,
        },
      }));
    } catch (err: any) {
      toast.error(err.message ?? t("company.load.errorMessage"));
    } finally {
      Loading.hide();
    }
  };
  const changedPagination = (page: number) => {
    setDataOfCompany((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        page,
      },
    }));
  };

  // watch
  useEffect(() => {
    loadAdminCompanyData();
  }, [dataOfCompany.pagination.page]);

  useEffect(() => {
    loadAdminCompanyData();
  }, []);

  return (
    <div>
      <PageHeader title={t("company.title")} />
      <Table columns={userColumns} rows={dataOfCompany.data} />

      <div className="mt-6 flex justify-end">
        <Pagination
          onChange={(_, page) => changedPagination(page)}
          count={dataOfCompany.pagination.count}
          page={dataOfCompany.pagination.page}
          size="large"
          color="primary"
        />
      </div>

      <Dialog
        open={companyDetailsDialogModel}
        onClose={() => setCompanyDetailsDialogModel(false)}
        aria-labelledby="company-dialog-title"
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
            },
          },
        }}
      >
        <DialogTitle
          id="company-dialog-title"
          sx={{
            py: 3,
            px: 4,
            fontWeight: 600,
            fontSize: "1.5rem",
            background: "#0d3cfe",
            color: "white",
            borderRadius: "16px 16px 0 0",
          }}
        >
          {t("company.details.title")}
        </DialogTitle>

        <DialogContent sx={{ py: 3, px: 4 }}>
          {dataOfCompany.solo_data ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  py: 3,
                }}
              >
                {dataOfCompany.solo_data.logo ? (
                  <Box
                    component="img"
                    src={
                      import.meta.env.VITE_API_FILE_URL +
                      dataOfCompany.solo_data.logo
                    }
                    alt={dataOfCompany.solo_data.name}
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 3,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 3,
                      background: "#0d3cfe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "2.5rem",
                      fontWeight: 600,
                    }}
                  >
                    {dataOfCompany.solo_data.name?.charAt(0).toUpperCase()}
                  </Box>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: "#1d1d1f",
                      fontSize: "1.75rem",
                    }}
                  >
                    {dataOfCompany.solo_data.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#86868b",
                      fontWeight: 400,
                      fontSize: "1.1rem",
                    }}
                  >
                    {dataOfCompany.solo_data.company_name}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    py: 2.5,
                    px: 3,
                    background: "#f5f5f7",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#86868b",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      display: "block",
                      mb: 1,
                    }}
                  >
                    {t("company.details.type")}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: "#1d1d1f",
                      fontSize: "1.1rem",
                    }}
                  >
                    {dataOfCompany.solo_data.type === "entity"
                      ? t("company.type.entity")
                      : t("company.type.physical")}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    py: 2.5,
                    px: 3,
                    background: "#f5f5f7",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#86868b",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      display: "block",
                      mb: 1,
                    }}
                  >
                    {t("company.details.phone")}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: "#1d1d1f",
                      fontSize: "1.1rem",
                    }}
                  >
                    {dataOfCompany.solo_data.phone}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    py: 2.5,
                    px: 3,
                    background: "#f5f5f7",
                    borderRadius: 3,
                    gridColumn: { xs: "1", sm: "1 / -1" },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#86868b",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      display: "block",
                      mb: 1,
                    }}
                  >
                    {t("company.details.address")}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: "#1d1d1f",
                      fontSize: "1.1rem",
                    }}
                  >
                    {dataOfCompany.solo_data.address}
                  </Typography>
                </Box>
              </Box>

              {dataOfCompany.solo_data.director?.profile && (
                <Box
                  sx={{
                    py: 3,
                    px: 3,
                    background: "#f5f5f7",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#86868b",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      display: "block",
                      mb: 2,
                    }}
                  >
                    {t("company.details.director")}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#1d1d1f",
                        fontSize: "1.25rem",
                      }}
                    >
                      {dataOfCompany.solo_data.director.profile.full_name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#86868b",
                        fontWeight: 400,
                        fontSize: "1rem",
                      }}
                    >
                      {dataOfCompany.solo_data.director.profile.phone}
                    </Typography>
                    {dataOfCompany.solo_data.director.profile.gender && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#86868b",
                          fontWeight: 400,
                          fontSize: "0.95rem",
                        }}
                      >
                        {dataOfCompany.solo_data.director.profile.gender ===
                        "male"
                          ? t("company.gender.male")
                          : t("company.gender.female")}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

              {dataOfCompany.solo_data.parent && (
                <Box
                  sx={{
                    py: 3,
                    px: 3,
                    background: "#f5f5f7",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#86868b",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      display: "block",
                      mb: 2,
                    }}
                  >
                    {t("company.details.parent")}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#1d1d1f",
                        fontSize: "1.25rem",
                      }}
                    >
                      {dataOfCompany.solo_data.parent.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#86868b",
                        fontWeight: 400,
                        fontSize: "1rem",
                      }}
                    >
                      {dataOfCompany.solo_data.parent.company_name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#86868b",
                        fontWeight: 400,
                        fontSize: "1rem",
                      }}
                    >
                      {dataOfCompany.solo_data.parent.phone}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  py: 2.5,
                  px: 3,
                  background: "#f5f5f7",
                  borderRadius: 3,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: "#86868b", fontWeight: 400, fontSize: "1rem" }}
                >
                  {t("company.details.createdAt")}:{" "}
                  <Box
                    component="span"
                    sx={{ color: "#1d1d1f", fontWeight: 500 }}
                  >
                    {new Date(
                      dataOfCompany.solo_data.created_at,
                    ).toLocaleDateString(i18n.language, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Box>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "#86868b",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, fontSize: "1.25rem" }}
              >
                {t("defaults.no_data")}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 4, py: 3 }}>
          <Button
            onClick={() => setCompanyDetailsDialogModel(false)}
            variant="contained"
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 500,
              px: 5,
              py: 1.5,
              fontSize: "1rem",
              background: "#0d3cfe",
              boxShadow: "none",
              "&:hover": {
                background: "#0a2ed6",
                boxShadow: "none",
              },
            }}
            fullWidth
          >
            {t("defaults.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
