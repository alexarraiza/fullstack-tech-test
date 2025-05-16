export type IngestionResponseDto = {
  success: boolean;
  message: string;
  error?: string;
  dbData?: any[];
};
