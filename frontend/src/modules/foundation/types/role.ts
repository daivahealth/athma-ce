export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  resource?: string | null;
  action?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermission {
  permission: Permission;
}

export interface Role {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description?: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  rolePermissions?: RolePermission[];
}
