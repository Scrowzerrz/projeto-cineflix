export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      episodios: {
        Row: {
          created_at: string | null
          descricao: string | null
          duracao: string | null
          id: string
          numero: number
          player_url: string | null
          temporada_id: string
          thumbnail_url: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          duracao?: string | null
          id?: string
          numero: number
          player_url?: string | null
          temporada_id: string
          thumbnail_url?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          duracao?: string | null
          id?: string
          numero?: number
          player_url?: string | null
          temporada_id?: string
          thumbnail_url?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "episodios_temporada_id_fkey"
            columns: ["temporada_id"]
            isOneToOne: false
            referencedRelation: "temporadas"
            referencedColumns: ["id"]
          },
        ]
      }
      favoritos: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          tipo: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      filmes: {
        Row: {
          ano: string
          avaliacao: string | null
          categoria: string | null
          created_at: string | null
          descricao: string | null
          destaque: boolean | null
          diretor: string | null
          duracao: string | null
          elenco: string | null
          generos: string[] | null
          id: string
          idioma: string | null
          player_url: string | null
          poster_url: string
          produtor: string | null
          qualidade: string | null
          tipo: string | null
          titulo: string
          trailer_url: string | null
          updated_at: string | null
        }
        Insert: {
          ano: string
          avaliacao?: string | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          destaque?: boolean | null
          diretor?: string | null
          duracao?: string | null
          elenco?: string | null
          generos?: string[] | null
          id?: string
          idioma?: string | null
          player_url?: string | null
          poster_url: string
          produtor?: string | null
          qualidade?: string | null
          tipo?: string | null
          titulo: string
          trailer_url?: string | null
          updated_at?: string | null
        }
        Update: {
          ano?: string
          avaliacao?: string | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          destaque?: boolean | null
          diretor?: string | null
          duracao?: string | null
          elenco?: string | null
          generos?: string[] | null
          id?: string
          idioma?: string | null
          player_url?: string | null
          poster_url?: string
          produtor?: string | null
          qualidade?: string | null
          tipo?: string | null
          titulo?: string
          trailer_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notificacoes: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          item_tipo: string
          lida: boolean | null
          mensagem: string
          tipo: string
          titulo: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          item_tipo: string
          lida?: boolean | null
          mensagem: string
          tipo: string
          titulo: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          item_tipo?: string
          lida?: boolean | null
          mensagem?: string
          tipo?: string
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          nome: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          nome?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          nome?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      series: {
        Row: {
          ano: string
          avaliacao: string | null
          categoria: string | null
          created_at: string | null
          descricao: string | null
          destaque: boolean | null
          diretor: string | null
          duracao: string | null
          elenco: string | null
          generos: string[] | null
          id: string
          idioma: string | null
          poster_url: string
          produtor: string | null
          qualidade: string | null
          tipo: string | null
          titulo: string
          titulo_original: string | null
          trailer_url: string | null
          updated_at: string | null
        }
        Insert: {
          ano: string
          avaliacao?: string | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          destaque?: boolean | null
          diretor?: string | null
          duracao?: string | null
          elenco?: string | null
          generos?: string[] | null
          id?: string
          idioma?: string | null
          poster_url: string
          produtor?: string | null
          qualidade?: string | null
          tipo?: string | null
          titulo: string
          titulo_original?: string | null
          trailer_url?: string | null
          updated_at?: string | null
        }
        Update: {
          ano?: string
          avaliacao?: string | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          destaque?: boolean | null
          diretor?: string | null
          duracao?: string | null
          elenco?: string | null
          generos?: string[] | null
          id?: string
          idioma?: string | null
          poster_url?: string
          produtor?: string | null
          qualidade?: string | null
          tipo?: string | null
          titulo?: string
          titulo_original?: string | null
          trailer_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      temporadas: {
        Row: {
          ano: string | null
          created_at: string | null
          id: string
          numero: number
          poster_url: string | null
          serie_id: string
          titulo: string | null
          updated_at: string | null
        }
        Insert: {
          ano?: string | null
          created_at?: string | null
          id?: string
          numero: number
          poster_url?: string | null
          serie_id: string
          titulo?: string | null
          updated_at?: string | null
        }
        Update: {
          ano?: string | null
          created_at?: string | null
          id?: string
          numero?: number
          poster_url?: string | null
          serie_id?: string
          titulo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "temporadas_serie_id_fkey"
            columns: ["serie_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
