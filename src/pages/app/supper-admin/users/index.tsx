import { Dialog } from "@/components/ui/Dialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { AutoComplete } from "@/components/ui/AutoComplete";
import { Table } from "@/components/ui/Table";
import { API_ENDPOINTS } from "@/constants/api";
import { useSystemStore } from "@/store/useSystemStore";
import api from "@/utils/axios";
import { Loading } from "@/utils/loadingController";
import { Icon } from "@iconify/react";
import { Button, InputLabel, OutlinedInput, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "@/components/ui/ActionDialog";
import { toast } from "react-toastify";

// types
interface UserDataTypes {
  id: number;
  email: string;
  type: string;
  created_at: string;
  updated_at: string;
}
interface IPaginationDataTypes {
  page: number;
  count: number;
}
interface CreateuserFormDataTypes {
  userID?: number | null;
  email: string;
  password: string;
  type: string;
  fullName: string;
  gender: string;
  phone: string;
  roles: {
    value: string | number;
    data: any[];
  };
}

export const SuperAdminUsersPage = () => {
  const { t } = useTranslation();

  // columns
  const userColumns = [
    {
      label: t("user.table.header.ID"),
      value: (row: any) => <div>{row.id}</div>,
    },
    {
      label: t("user.table.header.email"),
      value: (row: any) => <div>{row.email}</div>,
    },
    {
      label: t("user.table.header.type"),
      value: (row: any) => <div>{row.type}</div>,
    },
    {
      label: t("user.table.header.createdAt"),
      value: (row: any) => <div>{row.created_at}</div>,
    },
    {
      label: t("user.table.header.updatedAt"),
      value: (row: any) => <div>{row.updated_at}</div>,
    },
    {
      label: t("user.table.header.actions"),
      value: (row: UserDataTypes) => (
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
            onClick={() => showEditUserDialog(row)}
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
            onClick={() => showDeleteUserDialog(row.id)}
          >
            <Icon icon="ri-delete-bin-line" />
          </Button>
        </div>
      ),
    },
  ];

  // data
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const system = useSystemStore((state) => state.system);
  const [pagination, setPagination] = useState<IPaginationDataTypes>({
    page: 1,
    count: 1,
  });
  const [users, setUsers] = useState<UserDataTypes[]>([]);
  const [createDialogModel, setCreateDialogModel] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateuserFormDataTypes>(
    {
      userID: null,
      email: "",
      password: "",
      type: "",
      fullName: "",
      gender: "",
      phone: "",
      roles: {
        value: "",
        data: [],
      },
    },
  );

  // functions
  const clearUserFormData = () => {
    setCreateFormData((prev) => ({
      ...prev,
      userID: null,
      email: "",
      password: "",
      type: "",
      fullName: "",
      gender: "",
      phone: "",
      roles: {
        ...prev.roles,
        value: "",
      },
    }));
  };
  const showCreateUserDialog = async () => {
    await loadRoles();
    clearUserFormData();
    setCreateDialogModel(true);
  };
  const loadUsers = async () => {
    try {
      Loading.show();
      const edpoint = API_ENDPOINTS.SUPER_ADMIN_USER.LOAD_USERS;
      const { data } = await api.get(edpoint, {
        params: {
          page: pagination.page,
          includes: "profile",
        },
      });
      setUsers(data.data || []);
      setPagination((prev) => ({
        ...prev,
        count: data.meta.totalPage || 1,
      }));
    } catch (error: any) {
      toast.error(error?.message || t("errorLoadingUsers"));
    } finally {
      Loading.hide();
    }
  };
  const changedPagination = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };
  const createUser = async () => {
    try {
      Loading.show();
      if (createFormData.userID) {
        const edpoint = API_ENDPOINTS.SUPER_ADMIN_USER.UPDATE_USER(
          createFormData.userID,
        );
        await api.put(edpoint, {
          email: createFormData.email,
          type: createFormData.type,
          password: createFormData.password,
          role_id: createFormData.roles.value,
          profile: {
            full_name: createFormData.fullName,
            gender: createFormData.gender,
            phone: createFormData.phone,
          },
        });
        toast.success(t("successUpdateUserMessage"));
      } else {
        const edpoint = API_ENDPOINTS.SUPER_ADMIN_USER.CREATE_USER;
        await api.post(edpoint, {
          email: createFormData.email,
          type: createFormData.type,
          password: createFormData.password,
          role_id: createFormData.roles.value,
          profile: {
            full_name: createFormData.fullName,
            gender: createFormData.gender,
            phone: createFormData.phone,
          },
        });
        toast.success(t("successCreatingUser"));
      }
      setCreateDialogModel(false);
      loadUsers();
    } catch (error: any) {
      toast.error(error?.message || t("errorCreatingUser"));
    } finally {
      Loading.hide();
    }
  };
  const showEditUserDialog = async (user: UserDataTypes) => {
    try {
      Loading.show();
      await loadRoles();
      const edpoint = API_ENDPOINTS.SUPER_ADMIN_USER.LOAD_USER(user.id);
      const { data } = await api.get(edpoint, {
        params: {
          includes: "profile",
        },
      });
      setCreateFormData((prev) => ({
        ...prev,
        userID: user.id,
        fullName: data.data.profile.full_name ?? "",
        email: data.data.email ?? "",
        phone: data.data.profile.phone ?? "",
        type: data.data.type ?? "",
        gender: data.data.profile.gender ?? "",
        roles: {
          ...prev.roles,
          value: data.data.role_id ?? "",
        },
        password: "",
      }));
      setCreateDialogModel(true);
    } catch (error: any) {
      toast.error(error?.message || t("errorLoadingUserDetails"));
    } finally {
      Loading.hide();
    }
  };
  const deleteUser = async () => {
    try {
      Loading.show();
      if (!createFormData.userID) {
        toast.error(t("errorNoUserSelected"));
        return;
      }
      const endpoint = API_ENDPOINTS.SUPER_ADMIN_USER.DELETE_USER(
        createFormData.userID,
      );
      await api.delete(endpoint);
      toast.success(t("successDeletingUser"));
      setDeleteDialog(false);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.message || t("errorDeletingUser"));
    } finally {
      Loading.hide();
    }
  };
  const showDeleteUserDialog = (userID: number) => {
    setCreateFormData((prev) => ({
      ...prev,
      userID,
    }));
    setDeleteDialog(true);
  };
  const loadRoles = async () => {
    try {
      Loading.show();
      const endpoint = API_ENDPOINTS.SUPER_ADMIN_ROLE.LOAD_ROLE_FOR_SELECT;
      const { data } = await api.get(endpoint);
      setCreateFormData((prev) => ({
        ...prev,
        roles: {
          ...prev.roles,
          data: data.data,
        },
      }));
    } catch (err: any) {
      toast.error(err.message ?? t("role.loadError"));
    } finally {
      Loading.hide();
    }
  };

  // effects
  useEffect(() => {
    loadUsers();
  }, [pagination.page]);
  useEffect(() => {
    loadUsers();
  }, []);
  return (
    <div>
      <PageHeader
        title={t("users.title")}
        rightContent={
          <Button
            color="success"
            variant="outlined"
            size="large"
            onClick={() => showCreateUserDialog()}
          >
            <div className="flex items-center gap-2">
              <div> {t("user.addUser")} </div>
              <div>
                <Icon icon="ri-add-line" className="text-lg" />
              </div>
            </div>
          </Button>
        }
      />
      <Table columns={userColumns} rows={users} />
      <div className="mt-6 flex justify-end">
        <Pagination
          onChange={(_, page) => changedPagination(page)}
          count={pagination.count}
          page={pagination.page}
          size="large"
          color="primary"
        />
      </div>

      <Dialog
        open={createDialogModel}
        onClose={() => setCreateDialogModel(false)}
        title={createFormData.userID ? t("defaults.edit") : t("user.addUser")}
        width={800}
        actions={
          <>
            <Button
              onClick={() => setCreateDialogModel(false)}
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
                !createFormData.fullName ||
                !createFormData.email ||
                !createFormData.phone ||
                !createFormData.type ||
                !createFormData.gender
              }
              onClick={() => createUser()}
            >
              {t("defaults.save")}
            </Button>
          </>
        }
      >
        <div>
          <InputLabel htmlFor="FullName-input">
            {t("user.form.fullName")}
          </InputLabel>
          <OutlinedInput
            fullWidth
            id="FullName-input"
            placeholder={t("user.form.fullName")}
            className="mb-4"
            value={createFormData.fullName}
            onChange={(e) =>
              setCreateFormData((prev) => ({
                ...prev,
                fullName: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <InputLabel htmlFor="email-input">{t("user.form.email")}</InputLabel>
          <OutlinedInput
            fullWidth
            id="email-input"
            placeholder={t("user.form.email")}
            className="mb-4"
            value={createFormData.email}
            onChange={(e) =>
              setCreateFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <InputLabel htmlFor="Phone-input">{t("user.form.phone")}</InputLabel>
          <OutlinedInput
            fullWidth
            id="Phone-input"
            placeholder={t("user.form.phone")}
            className="mb-4"
            value={createFormData.phone}
            onChange={(e) =>
              setCreateFormData((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex gap-4 mb-4">
          <AutoComplete
            clearable
            value={createFormData.roles.value}
            items={createFormData.roles.data}
            itemLabel="name"
            itemKey="id"
            onChange={(val) => {
              setCreateFormData((prev) => ({
                ...prev,
                roles: {
                  ...prev.roles,
                  value: val as number,
                },
              }));
            }}
            label={t("user.form.role")}
            fullWidth
          />
        </div>

        <div>
          <InputLabel htmlFor="Password-input">
            {t("user.form.password")}
          </InputLabel>
          <OutlinedInput
            fullWidth
            id="Password-input"
            placeholder={t("user.form.password")}
            className="mb-4"
            type="password"
            value={createFormData.password}
            onChange={(e) =>
              setCreateFormData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex gap-4 mb-4">
          <AutoComplete
            clearable
            value={createFormData.type}
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
            itemLabel="label"
            itemKey="value"
            onChange={(val) =>
              setCreateFormData((prev) => ({
                ...prev,
                type: val as string,
              }))
            }
            label={t("user.form.type")}
            fullWidth
          />
        </div>

        <div className="flex gap-4">
          <AutoComplete
            clearable
            value={createFormData.gender}
            items={
              system?.enums.GenderEnum
                ? Object.entries(system?.enums.GenderEnum).map(
                    ([key, value]) => ({
                      label: key,
                      value: value,
                    }),
                  )
                : []
            }
            itemLabel="label"
            itemKey="value"
            onChange={(val) =>
              setCreateFormData((prev) => ({
                ...prev,
                gender: val as string,
              }))
            }
            label={t("user.form.gender")}
            fullWidth
          />
        </div>
      </Dialog>

      <ActionDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        title={t("delete.confirmation.title")}
        message={t("delete.confirmation.message")}
        variant="danger"
        onOk={() => deleteUser()}
        onCancel={() => setDeleteDialog(false)}
        okText={t("delete.confirmation.confirm")}
        cancelText={t("delete.confirmation.cancel")}
      />
    </div>
  );
};
