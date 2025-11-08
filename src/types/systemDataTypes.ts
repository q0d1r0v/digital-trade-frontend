export type GenderEnum = "male" | "female";

export type UserTypeEnum = "admin" | "director" | "employee";

export type TestEnum = "one" | "two" | "three";

export type CompanyTypeEnum = "entity" | "physical";

export type Profile = {
  user_id: number;
  full_name: string;
  phone: string;
  gender: GenderEnum;
};

export type Role = {
  id: number;
  name: string;
  type: UserTypeEnum;
  description: string | null;
  permissions: string[];
};

export type PermissionsObject = {
  permissions: string[];
  tree: Record<string, any>;
  available: {
    permissions: string[];
    tree: Record<string, any>;
  };
};

export type User = {
  id: number;
  email: string;
  type: UserTypeEnum;
  deleted_at: string | null;
  profile: Profile;
  role: Role;
  updated_at: string;
  created_at: string;
};

export type SystemData = {
  enums: {
    TestEnum: TestEnum;
    GenderEnum: GenderEnum;
    UserTypeEnum: UserTypeEnum;
    CompanyTypeEnum: CompanyTypeEnum;
  };
  permissions: PermissionsObject;
};
