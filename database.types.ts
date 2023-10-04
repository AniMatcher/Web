export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      auth: {
        Row: {
          email: string;
          password_hash: string;
          username: string | null;
          uuid: string;
        };
        Insert: {
          email: string;
          password_hash: string;
          username?: string | null;
          uuid?: string;
        };
        Update: {
          email?: string;
          password_hash?: string;
          username?: string | null;
          uuid?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          bio: string;
          gender: string;
          genre: string;
          id: number;
          sex_pref: string;
          username: string | null;
          uuid: string | null;
        };
        Insert: {
          bio: string;
          gender: string;
          genre: string;
          id?: never;
          sex_pref: string;
          username?: string | null;
          uuid?: string | null;
        };
        Update: {
          bio?: string;
          gender?: string;
          genre?: string;
          id?: never;
          sex_pref?: string;
          username?: string | null;
          uuid?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
