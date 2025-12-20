export interface User {           
    email: string | null;
    avatar_url: string | null;
    status: "active" | "suspended" | "deleted";
    updated_at: Number;
  }