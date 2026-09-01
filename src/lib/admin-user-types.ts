export type AdminUserRecord = {
  user_id: number;
  username: string;
  status: number;
  date_added: string;
  date_modified: string;
};

export const ADMIN_USER_STATUS_ACTIVE = 1;

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,32}$/;

export function validateAdminUsername(username: string) {
  const trimmed = username.trim();
  if (!trimmed) return "Username is required.";
  if (!USERNAME_PATTERN.test(trimmed)) {
    return "Username must be 3–32 characters: letters, numbers, underscore.";
  }
  return null;
}

export function validateAdminPassword(password: string) {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}
