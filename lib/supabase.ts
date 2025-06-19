import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          title: string | null;
          bio: string | null;
          avatar_url: string | null;
          phone: string | null;
          location: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          location?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          location?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          user_id: string;
          degree: string;
          institution: string;
          start_date: string | null;
          end_date: string | null;
          description: string | null;
          gpa: string | null;
          achievements: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          degree: string;
          institution: string;
          start_date?: string | null;
          end_date?: string | null;
          description?: string | null;
          gpa?: string | null;
          achievements?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          degree?: string;
          institution?: string;
          start_date?: string | null;
          end_date?: string | null;
          description?: string | null;
          gpa?: string | null;
          achievements?: string[] | null;
          created_at?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          company: string;
          start_date: string | null;
          end_date: string | null;
          description: string | null;
          technologies: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          company: string;
          start_date?: string | null;
          end_date?: string | null;
          description?: string | null;
          technologies?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          company?: string;
          start_date?: string | null;
          end_date?: string | null;
          description?: string | null;
          technologies?: string[] | null;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          technologies: string[] | null;
          github_url: string | null;
          demo_url: string | null;
          image_url: string | null;
          featured: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          technologies?: string[] | null;
          github_url?: string | null;
          demo_url?: string | null;
          image_url?: string | null;
          featured?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          technologies?: string[] | null;
          github_url?: string | null;
          demo_url?: string | null;
          image_url?: string | null;
          featured?: boolean | null;
          created_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          name: string;
          level: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          name: string;
          level?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          name?: string;
          level?: number | null;
          created_at?: string;
        };
      };
      certifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          issuer: string;
          issue_date: string | null;
          credential_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          issuer: string;
          issue_date?: string | null;
          credential_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          issuer?: string;
          issue_date?: string | null;
          credential_url?: string | null;
          created_at?: string;
        };
      };
      interests: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
      };
    };
  };
};