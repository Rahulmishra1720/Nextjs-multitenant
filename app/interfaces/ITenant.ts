export interface ITenant {
	id?: number;
	tenant_id?: string | null;
	created_at?: Date;
	tenant_name?: string | null;
	tenant_email?: string | null;
	role: string | null;
}
