export interface AuditEntity {
  created_at: Date;
  created_by: string;
  updated_at?: Date;
  updated_by?: string;
}

export interface BaseEntity extends AuditEntity {
  _id: string;
}
