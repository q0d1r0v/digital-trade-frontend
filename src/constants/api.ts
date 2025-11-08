export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/common/auth/login",
    REFRESH: "/common/auth/refresh",
  },
  USER: {
    ME: "/common/auth/auth-user",
  },
  ADMIN_USER: {
    LOAD_USERS: "/company/user/user",
    CREATE_USER: "/company/user/user",
    UPDATE_USER: (id: number) => `/company/user/user/${id}`,
    LOAD_USER: (id: number) => `/company/user/user/${id}`,
    DELETE_USER: (id: number) => `/company/user/user/${id}`,
  },
  SUPER_ADMIN_USER: {
    LOAD_USERS: "/admin/user/user",
    CREATE_USER: "/admin/user/user",
    UPDATE_USER: (id: number) => `/admin/user/user/${id}`,
    LOAD_USER: (id: number) => `/admin/user/user/${id}`,
    DELETE_USER: (id: number) => `/admin/user/user/${id}`,
  },
  SUPER_ADMIN_ROLE: {
    LOAD_ROLES: "/admin/user/role",
    CREATE_ROLE: "/admin/user/role",
    LOAD_ROLE_FOR_SELECT: "/common/public/records/role?page=1&perPage=1000",
    LOAD_ROLE: (id: number) => `/admin/user/role/${id}`,
    UPDATE_ROLE: (id: number) => `/admin/user/role/${id}`,
    DELETE_ROLE: (id: number) => `/admin/user/role/${id}`,
  },
  SUPER_ADMIN_COMPANY: {
    CREATE_COMPANY: "/admin/company/company",
    LOAD_COMPANIES: "/admin/company/company",
    LOAD_COMPANY_DATA: (id: number) => `/admin/company/company/${id}`,
    LOAD_COMPANIES_FOR_SELECT: "/common/public/records/company",
    EDIT_COMPANY: (id: number) => `/admin/company/company/${id}`,
    DELETE_COMPANY: (id: number) => `/admin/company/company/${id}`,
  },
  SUPER_ADMIN_CURRENCY: {
    CREATE: "/admin/system/currency",
    LOAD: "/admin/system/currency",
    LOAD_CURRRENCY_DATA: (id: number) => `/admin/system/currency/${id}`,
    EDIT: (id: number) => `/admin/system/currency/${id}`,
    DELETE_CURRENCY: (id: number) => `/admin/system/currency/${id}`,
  },
  ADMIN_COMPANY: {
    LOAD_COMPANIES: "/company/company/company",
    GET_COMPANY_DETAILS: (id: number) => `/company/company/company/${id}`,
  },
  SYSTEM: {
    INFO: "/common/system",
  },
} as const;
