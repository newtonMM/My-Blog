export interface DBResponse {
  code: string;
  failed: boolean;
  message: string;
  rows: {
    affectedRows: number;
    length: number;
  };
}
