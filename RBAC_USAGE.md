# Role-Based Access Control (RBAC) Implementation Guide

This document explains how to use the RBAC system implemented in HotelGo.

## Overview

The RBAC system controls:
1. **Route Access** - Which pages/users can access which routes
2. **Feature Permissions** - Which features/actions users can perform within pages

## Role Definitions

The following roles are available:
- `SuperAdmin` - Full access to everything
- `Manager` - Most access except some super admin features
- `FrontDesk` - Front desk operations, reservations, check-in/out
- `HouseKeeping` - Room maintenance and housekeeping operations
- `Kitchen` - Kitchen and restaurant operations
- `Maintenance` - Facility maintenance
- `Accounting` - Financial and accounting features
- `Security` - Security and access control
- `GuestServices` - Guest services and CRM

## Route Access

Routes are automatically protected based on the role. See `src/lib/rbac.ts` for route permissions.

### Example Route Permissions:
- `/dashboard` - All roles
- `/staff` - Only SuperAdmin and Manager
- `/kitchen` - SuperAdmin, Manager, Kitchen
- `/housekeeping` - SuperAdmin, Manager, HouseKeeping

## Using ProtectedRoute Component

Wrap pages or routes with `ProtectedRoute` to automatically check access:

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function StaffPage() {
  return (
    <ProtectedRoute>
      <div>Staff Management Page</div>
    </ProtectedRoute>
  );
}
```

The component will automatically:
- Redirect unauthorized users to dashboard
- Check route access based on current path
- Show access denied message if needed

## Using FeatureGuard Component

Use `FeatureGuard` to hide/show features within a page based on permissions:

```tsx
import FeatureGuard from '@/components/auth/FeatureGuard';

export default function UserManagementPage() {
  return (
    <div>
      <h1>User Management</h1>
      
      {/* Only show create button if user has permission */}
      <FeatureGuard permission="users.create">
        <button>Create User</button>
      </FeatureGuard>
      
      {/* Show edit button for users who can edit */}
      <FeatureGuard permission="users.edit">
        <button>Edit User</button>
      </FeatureGuard>
      
      {/* Show delete button only for super admins */}
      <FeatureGuard permission="users.delete">
        <button>Delete User</button>
      </FeatureGuard>
    </div>
  );
}
```

### FeatureGuard Props:
- `permission: string` - Required permission name
- `fallback?: ReactNode` - What to show if no access (default: nothing)
- `hideOnNoAccess?: boolean` - Hide component or show fallback (default: true)

## Using Permission Hooks

You can also use hooks to check permissions programmatically:

```tsx
import { useFeaturePermission, useFeaturePermissions } from '@/components/auth/FeatureGuard';

export default function MyComponent() {
  const canCreate = useFeaturePermission('users.create');
  const canEditOrDelete = useFeaturePermissions(['users.edit', 'users.delete']);
  
  return (
    <div>
      {canCreate && <button>Create</button>}
      {canEditOrDelete && <button>Edit/Delete</button>}
    </div>
  );
}
```

## Available Permissions

See `src/lib/rbac.ts` for the complete list of permissions. Common ones include:

### User Management
- `users.create`
- `users.edit`
- `users.delete`
- `users.view_all`

### Room Management
- `rooms.create`
- `rooms.edit`
- `rooms.delete`
- `rooms.view_pricing`

### Reservations/Stays
- `stays.create`
- `stays.edit`
- `stays.cancel`
- `stays.check_in`
- `stays.check_out`

### Financial
- `financials.view_all`
- `financials.edit`
- `payments.process`
- `payments.refund`

### Staff Management
- `staff.view_all`
- `staff.create`
- `staff.edit`
- `staff.delete`

### Kitchen Operations
- `kitchen.view_orders`
- `kitchen.update_order_status`

### Housekeeping
- `housekeeping.view_tasks`
- `housekeeping.update_status`

### Settings
- `settings.view`
- `settings.edit`
- `settings.delete`

### Reports & Analytics
- `reports.view_all`
- `reports.export`

## Navigation Filtering

Navigation items are automatically filtered based on user role. The `Navigation` component uses `getNavigationItems()` which filters items based on the current user's role.

## Customizing Permissions

To add or modify permissions:

1. Edit `src/lib/rbac.ts`
2. Add your permission to `featurePermissions` or route to `routePermissions`
3. Update navigation items in `navigationItems` array if needed

Example:
```typescript
// Add new permission
export const featurePermissions: Record<string, UserRole[]> = {
  // ... existing permissions
  'my_new_feature.use': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
};

// Add route permission
export const routePermissions: Record<string, UserRole[]> = {
  // ... existing routes
  '/my-new-page': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
};
```

## Best Practices

1. **Always use FeatureGuard for sensitive actions** - Don't rely on UI hiding alone
2. **Use ProtectedRoute for entire pages** - Let it handle redirects automatically
3. **Check permissions on the backend too** - Frontend protection is not enough
4. **Use descriptive permission names** - e.g., `users.delete` not just `delete`
5. **Group related permissions** - e.g., `financials.*` for all financial operations

## Troubleshooting

### User can't access a route
- Check `routePermissions` in `src/lib/rbac.ts`
- Verify user's role in Redux state
- Check if ProtectedRoute is properly wrapping the page

### Feature not showing/hiding
- Check `featurePermissions` in `src/lib/rbac.ts`
- Verify the permission name matches exactly
- Check if user role is correctly set in Redux state

### Navigation items missing
- Check `navigationItems` array in `src/lib/rbac.ts`
- Verify the `allowedRoles` array includes user's role
- Check if user role is correctly set in Redux state

