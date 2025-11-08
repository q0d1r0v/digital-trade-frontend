import { ActionDialog } from "@/components/ui/ActionDialog";
import { AutoComplete } from "@/components/ui/AutoComplete";
import { Dialog } from "@/components/ui/Dialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { Table } from "@/components/ui/Table";
import { API_ENDPOINTS } from "@/constants/api";
import { useSystemStore } from "@/store/useSystemStore";
import api from "@/utils/axios";
import { Loading } from "@/utils/loadingController";
import { Icon } from "@iconify/react";
import { Button, InputLabel, OutlinedInput, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface IRoleDataTypes {
  dialogModel: boolean;
  deleteDialogModel: boolean;
  roleID?: number | null;
  data: any[];
  pagination: {
    page: number;
    count: number;
  };
  name: string;
  type: string;
  description: string;
  permissions: string[];
}

export const SuperAdminUserRolesPage = () => {
  const { t } = useTranslation();

  const system = useSystemStore((state) => state.system);
  const [dataOfPermissions, setPermissionData] = useState<IRoleDataTypes>({
    dialogModel: false,
    deleteDialogModel: false,
    roleID: null,
    data: [],
    pagination: {
      page: 1,
      count: 1,
    },
    name: "",
    description: "",
    type: "",
    permissions: [],
  });

  // columns
  const roleColumns = [
    {
      label: t("role.table.header.ID"),
      value: (row: any) => <div>{row.id}</div>,
    },
    {
      label: t("role.table.header.name"),
      value: (row: any) => <div>{row.name}</div>,
    },
    {
      label: t("role.table.header.description"),
      value: (row: any) => <div>{row.description ?? "-"}</div>,
    },
    {
      label: t("role.table.header.type"),
      value: (row: any) => <div>{row.type}</div>,
    },
    {
      label: t("role.table.header.createdAt"),
      value: (row: any) => <div>{row.created_at}</div>,
    },
    {
      label: t("role.table.header.updatedAt"),
      value: (row: any) => <div>{row.updated_at}</div>,
    },
    {
      label: t("defaults.actions"),
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

  const changedPagination = (page: number) => {
    setPermissionData((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        page,
      },
    }));
  };
  const clearFormData = () => {
    setPermissionData((prev) => ({
      ...prev,
      roleID: null,
      name: "",
      description: "",
      type: "",
      permissions: [],
    }));
  };
  const showCreateForm = () => {
    clearFormData();
    setPermissionData((prev) => ({
      ...prev,
      dialogModel: true,
    }));
  };
  const loadRoles = async () => {
    try {
      Loading.show();
      const endpoint = API_ENDPOINTS.SUPER_ADMIN_ROLE.LOAD_ROLES;
      const { data } = await api.get(endpoint);
      setPermissionData((prev) => ({
        ...prev,
        data: data.data,
        pagination: {
          ...prev.pagination,
          count: data.meta.totalPage,
        },
      }));
    } catch (err: any) {
      toast.error(err.message ?? t("role.loadError"));
    } finally {
      Loading.hide();
    }
  };
  const deleteRole = async () => {
    try {
      Loading.show();
      const endpoint = API_ENDPOINTS.SUPER_ADMIN_ROLE.DELETE_ROLE(
        dataOfPermissions.roleID ?? NaN,
      );
      await api.delete(endpoint);
      toast.success(t("successDeletingRole"));
      setPermissionData((prev) => ({
        ...prev,
        roleID: null,
        deleteDialogModel: false,
      }));
      loadRoles();
    } catch (err: any) {
      toast.error(err.message ?? t("role.deleteErrorMessage"));
    } finally {
      Loading.hide();
    }
  };

  const showDeleteDialog = (id: number) => {
    setPermissionData((prev) => ({
      ...prev,
      roleID: id,
      deleteDialogModel: true,
    }));
  };
  const saveRole = async () => {
    try {
      Loading.show();
      if (dataOfPermissions.roleID) {
        const endpoint = API_ENDPOINTS.SUPER_ADMIN_ROLE.UPDATE_ROLE(
          dataOfPermissions.roleID,
        );
        await api.put(endpoint, {
          name: dataOfPermissions.name,
          type: dataOfPermissions.type,
          description: dataOfPermissions.description,
          permissions: dataOfPermissions.permissions,
        });
        toast.success(t("successUpdateRole"));
        setPermissionData((prev) => ({
          ...prev,
          roleID: null,
          dialogModel: false,
        }));
      } else {
        const endpoint = API_ENDPOINTS.SUPER_ADMIN_ROLE.CREATE_ROLE;
        await api.post(endpoint, {
          name: dataOfPermissions.name,
          type: dataOfPermissions.type,
          description: dataOfPermissions.description,
          permissions: dataOfPermissions.permissions,
        });
        toast.success(t("successCreateRole"));
        setPermissionData((prev) => ({
          ...prev,
          dialogModel: false,
        }));
      }
      loadRoles();
    } catch (err: any) {
      toast.error(
        err.message
          ? err.message
          : dataOfPermissions.roleID
            ? t("errorUpdateRole")
            : t("role.createErrorMessage"),
      );
    } finally {
      Loading.hide();
    }
  };
  const showEditDialog = async (id: number) => {
    try {
      Loading.show();
      const endpoint = API_ENDPOINTS.SUPER_ADMIN_ROLE.LOAD_ROLE(id);
      const { data } = await api.get(endpoint);
      setPermissionData((prev) => ({
        ...prev,
        roleID: id,
        name: data.data.name ?? "",
        type: data.data.type ?? "",
        description: data.data.description ?? "",
        permissions: data.data.permission ?? [],
        dialogModel: true,
      }));
    } catch (err: any) {
      toast.error(err.message ?? t("role.loadError"));
    } finally {
      Loading.hide();
    }
  };

  useEffect(() => {
    loadRoles();
  }, [dataOfPermissions.pagination.page]);
  useEffect(() => {
    loadRoles();
  }, []);
  return (
    <div>
      <PageHeader
        title={t("navBar.roles")}
        rightContent={
          <Button
            color="success"
            variant="outlined"
            size="large"
            onClick={() => showCreateForm()}
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

      <Table columns={roleColumns} rows={dataOfPermissions.data} />
      <div className="mt-6 flex justify-end">
        <Pagination
          onChange={(_, page) => changedPagination(page)}
          count={dataOfPermissions.pagination.count}
          page={dataOfPermissions.pagination.page}
          size="large"
          color="primary"
        />
      </div>
      <Dialog
        open={dataOfPermissions.dialogModel}
        onClose={() =>
          setPermissionData((prev) => ({
            ...prev,
            dialogModel: false,
          }))
        }
        width={800}
        title={
          dataOfPermissions.roleID ? t("defaults.edit") : t("defaults.create")
        }
        actions={
          <>
            <Button
              onClick={() =>
                setPermissionData((prev) => ({
                  ...prev,
                  dialogModel: false,
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
              onClick={() => saveRole()}
            >
              {t("defaults.save")}
            </Button>
          </>
        }
      >
        <div>
          <InputLabel>{t("user.form.fullName")}</InputLabel>
          <OutlinedInput
            fullWidth
            placeholder={t("role.table.header.name")}
            className="mb-4"
            value={dataOfPermissions.name}
            onChange={(e) =>
              setPermissionData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <InputLabel>{t("role.form.type")}</InputLabel>
          <AutoComplete
            clearable
            fullWidth
            label={t("role.form.type")}
            value={dataOfPermissions.type}
            items={
              system?.enums.UserTypeEnum
                ? Object.entries(system?.enums.UserTypeEnum).map(
                    ([key, value]) => ({
                      label: key,
                      value: value,
                    }),
                  )
                : []
            }
            onChange={(val) =>
              setPermissionData((prev) => ({
                ...prev,
                type: val as string,
              }))
            }
            itemKey="value"
            itemLabel="label"
          />
        </div>

        <div>
          <InputLabel>{t("role.table.header.description")}</InputLabel>
          <OutlinedInput
            fullWidth
            placeholder={t("role.table.header.description")}
            className="mb-4"
            value={dataOfPermissions.description}
            onChange={(e) =>
              setPermissionData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <InputLabel>{t("role.form.permissions")}</InputLabel>
          <AutoComplete
            clearable
            fullWidth
            multiple
            label={t("role.form.permissions")}
            value={dataOfPermissions.permissions}
            items={(system?.permissions.permissions ?? []).map((p) => ({
              label: p,
              value: p,
            }))}
            onChange={(val) => {
              setPermissionData((prev) => ({
                ...prev,
                permissions: val as string[],
              }));
            }}
            itemKey="value"
            itemLabel="label"
          />
        </div>
      </Dialog>
      <ActionDialog
        open={dataOfPermissions.deleteDialogModel}
        onClose={() =>
          setPermissionData((prev) => ({
            ...prev,
            deleteDialogModel: false,
          }))
        }
        title={t("delete.confirmation.title")}
        message={t("delete.roleConfirmation.message")}
        variant="danger"
        onOk={() => deleteRole()}
        onCancel={() =>
          setPermissionData((prev) => ({
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
