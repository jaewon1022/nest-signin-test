export type NonPWUser = {
  user_id: number;
  email: string;
  access_token?: string | null;
  refresh_token?: string | null;
  created_at: Date;
  updated_at: Date;
};
