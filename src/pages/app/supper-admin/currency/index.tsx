import { ActionDialog } from "@/components/ui/ActionDialog";
import { Dialog } from "@/components/ui/Dialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { Table } from "@/components/ui/Table";
import { API_ENDPOINTS } from "@/constants/api";
import api from "@/utils/axios";
import { Loading } from "@/utils/loadingController";
import { Icon } from "@iconify/react";
import { Button, InputLabel, OutlinedInput, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// types
interface ICurrencyDataTypes {
  pagination: {
    page: number;
    count: number;
  };
  data: any[];
  currencyID: number | null;
  deleteDialogModel: boolean;
  form: {
    dialogModel: boolean;
    code: string;
    country: string;
    symbol: string;
    is_main: boolean;
    round_mark: number | string;
  };
}

export const SuperAdminCurrencyPage = () => {
  const { t } = useTranslation();

  // columns
  const currencyColumns = [
    {
      label: t("user.table.header.ID"),
      value: (row: any) => <div>{row.id}</div>,
    },
    {
      label: t("currency.table.header.code"),
      value: (row: any) => <div>{row.code}</div>,
    },
    {
      label: t("currency.table.header.country"),
      value: (row: any) => <div>{row.country}</div>,
    },
    {
      label: t("currency.table.header.isMain"),
      value: (row: any) => <div>{String(row.is_main)}</div>,
    },
    {
      label: t("currency.table.header.roundMark"),
      value: (row: any) => <div>{row.round_mark}</div>,
    },
    {
      label: t("currency.table.header.symbol"),
      value: (row: any) => <div>{row.symbol}</div>,
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
            onClick={() => showFormDialog(row.id)}
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
            onClick={() => showDeleteCurrencyDialog(row.id)}
          >
            <Icon icon="ri-delete-bin-line" />
          </Button>
        </div>
      ),
    },
  ];

  // data
  const [dataOfCurrency, setDataOfCurrency] = useState<ICurrencyDataTypes>({
    pagination: {
      page: 1,
      count: 1,
    },
    data: [],
    currencyID: null,
    deleteDialogModel: false,
    form: {
      dialogModel: false,
      code: "",
      country: "",
      symbol: "",
      is_main: false,
      round_mark: "",
    },
  });

  // functions
  const loadCurrencies = async () => {
    try {
      Loading.show();
      const edpoint = API_ENDPOINTS.SUPER_ADMIN_CURRENCY.LOAD;
      const { data } = await api.get(edpoint, {
        params: {
          page: dataOfCurrency.pagination.page,
        },
      });
      setDataOfCurrency((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          count: data.meta.totalPage || 1,
        },
        data: data.data,
      }));
    } catch (error: any) {
      toast.error(error?.message || t("currency.message.error.load"));
    } finally {
      Loading.hide();
    }
  };
  const showDeleteCurrencyDialog = (id: number) => {
    setDataOfCurrency((prev) => ({
      ...prev,
      currencyID: id,
      deleteDialogModel: true,
    }));
  };
  const deleteCurrency = async () => {
    try {
      Loading.show();
      const endpoint = API_ENDPOINTS.SUPER_ADMIN_CURRENCY.DELETE_CURRENCY(
        dataOfCurrency.currencyID ?? NaN,
      );
      await api.delete(endpoint);
      toast.success(t("currency.message.success.delete"));
      setDataOfCurrency((prev) => ({
        ...prev,
        deleteDialogModel: false,
      }));
      loadCurrencies();
    } catch (err: any) {
      toast.error(err.message ?? t("currency.message.error.delete"));
    } finally {
      Loading.hide();
    }
  };
  const clearForm = () => {
    setDataOfCurrency((prev) => ({
      ...prev,
      currencyID: null,
      form: {
        ...prev.form,
        code: "",
        country: "",
        symbol: "",
        is_main: false,
        round_mark: "",
      },
    }));
  };
  const showFormDialog = (id?: number) => {
    if (!id) {
      clearForm();
      setDataOfCurrency((prev) => ({
        ...prev,
        form: {
          ...prev.form,
          dialogModel: true,
        },
      }));
    } else {
      loadEditData(id);
    }
  };
  const loadEditData = async (id: number) => {
    try {
      Loading.show();
      const endpoint = API_ENDPOINTS.SUPER_ADMIN_CURRENCY.LOAD_CURRRENCY_DATA(
        id ?? NaN,
      );
      const { data } = await api.get(endpoint);
      setDataOfCurrency((prev) => ({
        ...prev,
        currencyID: id,
        form: {
          ...prev.form,
          code: data?.data?.code,
          country: data?.data?.country,
          symbol: data?.data?.symbol,
          is_main: data?.data?.is_main,
          round_mark: data?.data?.round_mark,
          dialogModel: true,
        },
      }));
    } catch (err: any) {
      toast.error(err.message ?? t("currency.message.error.load"));
    } finally {
      Loading.hide();
    }
  };
  const sendForm = async () => {
    if (!dataOfCurrency.currencyID) {
      try {
        Loading.show();
        const edpoint = API_ENDPOINTS.SUPER_ADMIN_CURRENCY.CREATE;
        await api.post(edpoint, {
          code: dataOfCurrency.form.code,
          country: dataOfCurrency.form.country,
          symbol: dataOfCurrency.form.symbol,
          is_main: dataOfCurrency.form.is_main,
          round_mark: ~~dataOfCurrency.form.round_mark,
        });
        loadCurrencies();
        setDataOfCurrency((prev) => ({
          ...prev,
          form: {
            ...prev.form,
            dialogModel: false,
          },
        }));
        toast.success(t("currency.message.success.create"));
      } catch (error: any) {
        toast.error(error?.message || t("currency.message.error.create"));
      } finally {
        Loading.hide();
      }
    } else {
      try {
        Loading.show();
        const edpoint = API_ENDPOINTS.SUPER_ADMIN_CURRENCY.EDIT(
          dataOfCurrency.currencyID,
        );
        await api.put(edpoint, {
          code: dataOfCurrency.form.code,
          country: dataOfCurrency.form.country,
          symbol: dataOfCurrency.form.symbol,
          is_main: dataOfCurrency.form.is_main,
          round_mark: ~~dataOfCurrency.form.round_mark,
        });
        loadCurrencies();
        setDataOfCurrency((prev) => ({
          ...prev,
          form: {
            ...prev.form,
            dialogModel: false,
          },
        }));
        toast.success(t("currency.message.success.edit"));
      } catch (error: any) {
        toast.error(error?.message || t("currency.message.error.edit"));
      } finally {
        Loading.hide();
      }
    }
  };

  useEffect(() => {
    loadCurrencies();
  }, []);
  return (
    <div>
      <PageHeader
        title={t("navBar.currency")}
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
      <Table columns={currencyColumns} rows={dataOfCurrency.data} />

      <Dialog
        open={dataOfCurrency.form.dialogModel}
        onClose={() =>
          setDataOfCurrency((prev) => ({
            ...prev,
            form: {
              ...prev.form,
              dialogModel: false,
            },
          }))
        }
        title={
          dataOfCurrency.currencyID ? t("defaults.edit") : t("defaults.create")
        }
        height={700}
        width={1100}
        actions={
          <>
            <Button
              onClick={() =>
                setDataOfCurrency((prev) => ({
                  ...prev,
                  form: {
                    ...prev.form,
                    dialogModel: false,
                  },
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
              onClick={() => sendForm()}
            >
              {t("defaults.save")}
            </Button>
          </>
        }
      >
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="w-full">
              <InputLabel> {t("currency.table.header.code")} </InputLabel>
              <OutlinedInput
                fullWidth
                placeholder={t("currency.table.header.code")}
                value={dataOfCurrency.form.code}
                onChange={(e) =>
                  setDataOfCurrency((prev) => ({
                    ...prev,
                    form: {
                      ...prev.form,
                      code: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div className="w-full">
              <InputLabel> {t("currency.table.header.country")} </InputLabel>
              <OutlinedInput
                fullWidth
                placeholder={t("currency.table.header.country")}
                value={dataOfCurrency.form.country}
                onChange={(e) =>
                  setDataOfCurrency((prev) => ({
                    ...prev,
                    form: {
                      ...prev.form,
                      country: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="w-full">
              <InputLabel> {t("currency.table.header.symbol")} </InputLabel>
              <OutlinedInput
                fullWidth
                placeholder={t("currency.table.header.symbol")}
                value={dataOfCurrency.form.symbol}
                onChange={(e) =>
                  setDataOfCurrency((prev) => ({
                    ...prev,
                    form: {
                      ...prev.form,
                      symbol: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div className="w-full flex items-center">
              <div className="w-full">
                <InputLabel>{t("currency.table.header.roundMark")} </InputLabel>
                <OutlinedInput
                  fullWidth
                  placeholder={t("currency.table.header.roundMark")}
                  value={dataOfCurrency.form.round_mark}
                  onChange={(e) =>
                    setDataOfCurrency((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        round_mark: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <InputLabel>{t("currency.table.header.isMain")}</InputLabel>
            <div>
              <Switch
                value={dataOfCurrency.form.is_main}
                onChange={(e) => {
                  setDataOfCurrency((prev) => ({
                    ...prev,
                    form: {
                      ...prev.form,
                      is_main: e.target.checked,
                    },
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </Dialog>

      <ActionDialog
        open={dataOfCurrency.deleteDialogModel}
        onClose={() =>
          setDataOfCurrency((prev) => ({
            ...prev,
            deleteDialogModel: false,
          }))
        }
        title={t("delete.confirmation.title")}
        message={t("delete.currencyConfirmation.message")}
        variant="danger"
        onOk={() => deleteCurrency()}
        onCancel={() =>
          setDataOfCurrency((prev) => ({
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
