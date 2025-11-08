import { ActionDialog } from "@/components/ui/ActionDialog";
import { AutoComplete } from "@/components/ui/AutoComplete";
import { Dialog } from "@/components/ui/Dialog";
import { FilePicker } from "@/components/ui/FilePicker";
import { PageHeader } from "@/components/ui/PageHeader";
import { Table } from "@/components/ui/Table";
import { API_ENDPOINTS } from "@/constants/api";
import { useSystemStore } from "@/store/useSystemStore";
import api from "@/utils/axios";
import { Loading } from "@/utils/loadingController";
import { Icon } from "@iconify/react";
import {
  Button,
  InputLabel,
  OutlinedInput,
  Pagination,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface ICompanyDataTypes {
  companyID?: number | null;
  formDialog: boolean;
  deleteDialogModel: boolean;
  pagination: {
    page: number;
    count: number;
  };
  data: any[];
  form: {
    name: string;
    company_name: string;
    file: any;
    fileURL: string;
    companies: {
      value: string | number;
      data: any[];
    };
    directors: {
      value: string | number;
      data: any[];
    };
    parent_companies: {
      value: string | number;
      data: any[];
    };
    director: {
      value: string | number;
      data: any[];
    };
    type: string;
    phoneNumber: string;
    address: string;
  };
}

export const SuperAdminCompanyPage = () => {
  const { t } = useTranslation();

  // store
  const system = useSystemStore((state) => state.system);

  // data
  const [dataOfCompany, setDataOfCompany] = useState<ICompanyDataTypes>({
    pagination: {
      page: 1,
      count: 1,
    },
    formDialog: false,
    deleteDialogModel: false,
    data: [],
    companyID: null,
    form: {
      name: "",
      company_name: "",
      file: null,
      fileURL: "",
      companies: {
        value: "",
        data: [],
      },
      directors: {
        value: "",
        data: [],
      },
      type: "",
      phoneNumber: "",
      address: "",
      parent_companies: {
        value: "",
        data: [],
      },
      director: {
        value: "",
        data: [],
      },
    },
  });

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
      label: t("company.column.type"),
      value: (row: any) => <div>{row.type}</div>,
    },
    {
      label: t("user.table.header.createdAt"),
      value: (row: any) => <div>{row.created_at.split("T")[0]}</div>,
    },
    {
      label: t("user.table.header.updatedAt"),
      value: (row: any) => <div>{row.updated_at.split("T")[0]}</div>,
    },
    {
      label: t("user.table.header.actions"),
      value: (row: { id: number }) => (
        <div className="flex gap-2">
          <Button
            size="small"
            variant="outlined"
            color="warning"
            sx={{
              minWidth: "auto",
              padding: "12px",
              borderRadius: 10,
            }}
            onClick={() => showEditDialog(row.id)}
          >
            <Icon icon="ri-pencil-line" />
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            sx={{
              minWidth: "auto",
              padding: "12px",
              borderRadius: 10,
            }}
            onClick={() => showDeleteDialog(row.id)}
          >
            <Icon icon="ri-delete-bin-line" />
          </Button>
        </div>
      ),
    },
  ];

  // methods
  const showEditDialog = async (id: number) => {
    try {
      await loadDirectors();
      await loadCompaniesForSelect();
      Loading.show();
      const endpoint = API_ENDPOINTS.SUPER_ADMIN_COMPANY.LOAD_COMPANY_DATA(id);
      const { data } = await api.get(endpoint);
      setDataOfCompany((prev) => ({
        ...prev,
        companyID: id,
        form: {
          ...prev.form,
          name: data?.data?.name,
          company_name: data?.data?.company_name,
          fileURL: data?.data?.logo,
          parent_companies: {
            ...prev.form.parent_companies,
            value: data?.data?.parent_id,
          },
          directors: {
            ...prev.form.directors,
            value: data?.data?.director_id,
          },
          type: data?.data?.type,
          phoneNumber: data?.data?.phone,
          address: data?.data?.address,
        },
        formDialog: true,
      }));
    } catch (err: any) {
      toast.error(err.message ?? t("company.load.errorMessage"));
    } finally {
      Loading.hide();
    }
  };
  const showDeleteDialog = (id: number) => {
    setDataOfCompany((prev) => ({
      ...prev,
      companyID: id,
      deleteDialogModel: true,
    }));
  };
  const clearForm = () => {
    setDataOfCompany((prev) => ({
      ...prev,
      companyID: null,
      form: {
        ...prev.form,
        name: "",
        company_name: "",
        file: null,
        fileURL: "",
        parent_companies: {
          ...prev.form.parent_companies,
          value: "",
        },
        directors: {
          ...prev.form.directors,
          value: "",
        },
        type: "",
        phoneNumber: "",
        address: "",
      },
    }));
  };
  const loadCompanies = async () => {
    try {
      Loading.show();
      const endpoint = API_ENDPOINTS.SUPER_ADMIN_COMPANY.LOAD_COMPANIES;
      const { data } = await api.get(endpoint);
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
  const showFormDialog = async () => {
    clearForm();
    await loadDirectors();
    await loadCompaniesForSelect();
    setDataOfCompany((prev) => ({
      ...prev,
      formDialog: true,
    }));
  };
  const loadCompaniesForSelect = async () => {
    try {
      Loading.show();
      const endpoint =
        API_ENDPOINTS.SUPER_ADMIN_COMPANY.LOAD_COMPANIES_FOR_SELECT;
      const { data } = await api.get(endpoint);
      setDataOfCompany((prev) => ({
        ...prev,
        form: {
          ...prev.form,
          parent_companies: {
            ...prev.form.parent_companies,
            data: data.data,
          },
        },
      }));
    } catch (err: any) {
      toast.error(err.message ?? t("company.load.errorMessage"));
    } finally {
      Loading.hide();
    }
  };
  const deleteCompany = async () => {
    try {
      Loading.show();
      const endpoint = API_ENDPOINTS.SUPER_ADMIN_COMPANY.DELETE_COMPANY(
        dataOfCompany.companyID ?? NaN,
      );
      await api.delete(endpoint);
      toast.success(t("company.delete.successMessage"));
      setDataOfCompany((prev) => ({
        ...prev,
        deleteDialogModel: false,
      }));
      loadCompanies();
    } catch (err: any) {
      toast.error(err.message ?? t("company.delete.errorMessage"));
    } finally {
      Loading.hide();
    }
  };
  const loadDirectors = async () => {
    try {
      Loading.show();
      const { data } = await api.get("/common/public/records/user", {
        params: {
          search: "",
          type: "director",
        },
      });
      setDataOfCompany((prev) => ({
        ...prev,
        form: {
          ...prev.form,
          directors: {
            ...prev.form.directors,
            data: data.data,
          },
        },
      }));
    } catch (err: any) {
      toast.error(err.message ?? t("company.load.director.errorMessage"));
    } finally {
      Loading.hide();
    }
  };
  const sendForm = async () => {
    if (!dataOfCompany.companyID) {
      try {
        Loading.show();
        const endpoint = API_ENDPOINTS.SUPER_ADMIN_COMPANY.CREATE_COMPANY;
        const formData = new FormData();

        // form data
        formData.append("name", dataOfCompany.form.name);
        formData.append("company_name", dataOfCompany.form.company_name);
        formData.append(
          "parent_id",
          dataOfCompany.form.parent_companies?.value?.toString(),
        );
        formData.append(
          "director_id",
          dataOfCompany.form.directors?.value?.toString(),
        );
        formData.append("type", dataOfCompany.form.type);
        formData.append("phone", dataOfCompany.form.phoneNumber);
        formData.append("address", dataOfCompany.form.address);
        formData.append("logo", dataOfCompany.form.file);

        await api.post(endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(t("company.create.successMessage"));
        setDataOfCompany((prev) => ({
          ...prev,
          formDialog: false,
        }));
        loadCompanies();
      } catch (err: any) {
        toast.error(err.message ?? t("company.create.errorMessage"));
      } finally {
        Loading.hide();
      }
    } else {
      try {
        Loading.show();
        const endpoint = API_ENDPOINTS.SUPER_ADMIN_COMPANY.EDIT_COMPANY(
          dataOfCompany.companyID,
        );
        const formData = new FormData();

        // form data
        formData.append("company_id", dataOfCompany.companyID?.toString());
        formData.append("name", dataOfCompany.form.name);
        formData.append("company_name", dataOfCompany.form.company_name);
        formData.append(
          "parent_id",
          dataOfCompany.form.parent_companies.value?.toString(),
        );
        formData.append(
          "director_id",
          dataOfCompany.form.directors.value?.toString(),
        );
        formData.append("type", dataOfCompany.form.type);
        formData.append("phone", dataOfCompany.form.phoneNumber);
        formData.append("address", dataOfCompany.form.address);
        formData.append("logo", dataOfCompany.form.file);

        await api.put(endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(t("company.edit.successMessage"));
        setDataOfCompany((prev) => ({
          ...prev,
          formDialog: false,
        }));
        loadCompanies();
      } catch (err: any) {
        toast.error(err.message ?? t("company.edit.errorMessage"));
      } finally {
        Loading.hide();
      }
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [dataOfCompany.pagination.page]);
  useEffect(() => {
    loadCompanies();
  }, []);

  return (
    <div>
      <PageHeader
        title={t("company.title")}
        rightContent={
          <Button
            color="success"
            variant="outlined"
            size="large"
            onClick={() => showFormDialog()}
          >
            <div className="flex items-center gap-2">
              <div> {t("defaults.create")} </div>
              <div>
                <Icon icon="ri-add-line" className="text-lg" />
              </div>
            </div>
          </Button>
        }
      />
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
        open={dataOfCompany.formDialog}
        onClose={() =>
          setDataOfCompany((prev) => ({
            ...prev,
            formDialog: false,
          }))
        }
        title={
          dataOfCompany.companyID ? t("defaults.edit") : t("defaults.create")
        }
        height={700}
        width={1100}
        actions={
          <>
            <Button
              onClick={() =>
                setDataOfCompany((prev) => ({
                  ...prev,
                  formDialog: false,
                }))
              }
              size="large"
              color="error"
              variant="outlined"
            >
              {t("defaults.cancel")}
            </Button>
            <Button
              variant="outlined"
              size="large"
              color="success"
              disabled={
                !dataOfCompany.form.name ||
                !dataOfCompany.form.company_name ||
                !dataOfCompany.form.directors.value ||
                !dataOfCompany.form.type ||
                !dataOfCompany.form.phoneNumber ||
                !dataOfCompany.form.address
              }
              onClick={() => sendForm()}
            >
              {t("defaults.save")}
            </Button>
          </>
        }
      >
        <div>
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="w-full">
                <InputLabel> {t("company.form.name")} </InputLabel>
                <OutlinedInput
                  fullWidth
                  placeholder={t("company.form.name")}
                  value={dataOfCompany.form.name}
                  onChange={(e) =>
                    setDataOfCompany((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        name: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className="w-full">
                <InputLabel>{t("company.form.company_name")}</InputLabel>
                <OutlinedInput
                  fullWidth
                  placeholder={t("company.form.company_name")}
                  value={dataOfCompany.form.company_name}
                  onChange={(e) =>
                    setDataOfCompany((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        company_name: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div>
              {dataOfCompany.form.fileURL && (
                <img
                  src={
                    import.meta.env.VITE_API_FILE_URL +
                    dataOfCompany.form.fileURL
                  }
                  alt="logo"
                  width={60}
                />
              )}
            </div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="w-full">
                <InputLabel>{t("company.form.logo")}</InputLabel>
                <FilePicker
                  onChange={(e) => {
                    setDataOfCompany((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        file: e,
                      },
                    }));
                  }}
                  fullWidth
                  value={dataOfCompany.form.file}
                />
              </div>

              <div className="w-full">
                <InputLabel>{t("company.form.parent_company")}</InputLabel>
                <div className="flex gap-4 w-full">
                  <AutoComplete
                    searchable
                    clearable
                    value={dataOfCompany.form.parent_companies.value}
                    items={dataOfCompany.form.parent_companies.data}
                    itemLabel="name"
                    itemKey="id"
                    onChange={(val) => {
                      setDataOfCompany((prev) => ({
                        ...prev,
                        form: {
                          ...prev.form,
                          parent_companies: {
                            ...prev.form.parent_companies,
                            value: val as number,
                          },
                        },
                      }));
                    }}
                    label={t("company.form.parent_company")}
                    fullWidth
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="w-full">
                <InputLabel>{t("company.form.director")}</InputLabel>
                <div className="flex gap-4 mb-4">
                  <AutoComplete
                    searchable
                    clearable
                    value={dataOfCompany.form.directors.value}
                    items={dataOfCompany.form.directors.data}
                    itemLabel="profile.full_name"
                    itemKey="profile.user_id"
                    onChange={(val) => {
                      setDataOfCompany((prev) => ({
                        ...prev,
                        form: {
                          ...prev.form,
                          directors: {
                            ...prev.form.directors,
                            value: val as number,
                          },
                        },
                      }));
                    }}
                    label={t("company.form.director")}
                    fullWidth
                  />
                </div>
              </div>

              <div className="w-full">
                <InputLabel>{t("company.form.type")}</InputLabel>
                <div className="flex gap-4 mb-4">
                  <AutoComplete
                    clearable
                    value={dataOfCompany.form.type}
                    items={
                      system?.enums.GenderEnum
                        ? Object.entries(system?.enums.CompanyTypeEnum).map(
                            ([key, value]) => ({
                              label: key,
                              value: value,
                            }),
                          )
                        : []
                    }
                    itemLabel="label"
                    itemKey="value"
                    onChange={(val) => {
                      setDataOfCompany((prev) => ({
                        ...prev,
                        form: {
                          ...prev.form,
                          type: val as string,
                        },
                      }));
                    }}
                    label={t("company.form.type")}
                    fullWidth
                  />
                </div>
              </div>
            </div>

            <div>
              <InputLabel>{t("company.form.phone_number")}</InputLabel>
              <OutlinedInput
                fullWidth
                placeholder={t("company.form.phone_number")}
                className="mb-4"
                value={dataOfCompany.form.phoneNumber}
                onChange={(e) =>
                  setDataOfCompany((prev) => ({
                    ...prev,
                    form: {
                      ...prev.form,
                      phoneNumber: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div>
              <InputLabel>{t("company.form.address")}</InputLabel>
              <TextField
                fullWidth
                placeholder={t("company.form.address")}
                className="mb-4"
                value={dataOfCompany.form.address}
                minRows={4}
                maxRows={10}
                multiline
                onChange={(e) =>
                  setDataOfCompany((prev) => ({
                    ...prev,
                    form: {
                      ...prev.form,
                      address: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>
      </Dialog>

      <ActionDialog
        open={dataOfCompany.deleteDialogModel}
        onClose={() =>
          setDataOfCompany((prev) => ({
            ...prev,
            deleteDialogModel: false,
          }))
        }
        title={t("delete.confirmation.title")}
        message={t("delete.roleConfirmation.message")}
        variant="danger"
        onOk={() => deleteCompany()}
        onCancel={() =>
          setDataOfCompany((prev) => ({
            ...prev,
            deleteDialogModel: false,
          }))
        }
        okText={t("delete.confirmation.confirm")}
        cancelText={t("delete.confirmation.cancel")}
      />
    </div>
  );
};
