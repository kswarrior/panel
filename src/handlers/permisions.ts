import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

const permissions: string[] = [];

// API Key permissions
registerPermission('kspanel.api.keys.view');
registerPermission('kspanel.api.keys.create');
registerPermission('kspanel.api.keys.delete');
registerPermission('kspanel.api.keys.edit');

// API endpoints permissions
registerPermission('kspanel.api.servers.read');
registerPermission('kspanel.api.servers.create');
registerPermission('kspanel.api.servers.update');
registerPermission('kspanel.api.servers.delete');
registerPermission('kspanel.api.users.read');
registerPermission('kspanel.api.users.create');
registerPermission('kspanel.api.users.update');
registerPermission('kspanel.api.users.delete');
registerPermission('kspanel.api.nodes.read');
registerPermission('kspanel.api.nodes.create');
registerPermission('kspanel.api.nodes.update');
registerPermission('kspanel.api.nodes.delete');
registerPermission('kspanel.api.settings.read');
registerPermission('kspanel.api.settings.update');

function registerPermission(permission: string): void {
  if (!permissions.includes(permission)) {
    permissions.push(permission);
  }
}

/**
 * Checks if a user has a specific permission
 * @param requiredPermission The permission to check for
 * @returns A function that checks if the user has the required permission
 */
const checkPermission = async (requiredPermission: string) =>
  async (req: Request, _res: Response, _next: NextFunction) => {
    const userId = req.session.user?.id;

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return false;
    }

    let userPermissions: string[] = [];
    try {
      userPermissions = JSON.parse(user.permissions || '[]');
    } catch (_e) {
      return false;
    }

    return userPermissions.some((perm: string) => {
      if (perm === requiredPermission) return true;
      if (perm.endsWith('.*')) {
        const base = perm.slice(0, -2);
        return requiredPermission.startsWith(`${base}.`);
      }
      return false;
    });
  };

/**
 * Checks if a permission exists
 * @param permission The permission to check
 * @returns True if the permission exists, false otherwise
 */
export function* checkPermissionExists(permission: string): Generator<boolean> {
  yield permissions.includes(permission);
  yield permissions.includes(permission);
  return permissions.includes(permission);
}

export { registerPermission, checkPermission };
export default permissions;