import { UserRole } from "@/utils/enum";

export interface UserAccountSliceParams {
  _id: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole | null;
}
