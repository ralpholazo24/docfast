export interface CsvPreview {
    headers: string[];
    rows: string[][];
  }
  
  export interface DocumentUploadProps {
    document: File | null;
    onDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export interface DataUploadProps {
    dataFile: File | null;
    onDataFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export interface DataPreviewProps {
    csvPreview: CsvPreview;
    currentPage: number;
    rowsPerPage: number;
    setRowsPerPage: (value: number) => void;
    setCurrentPage: (value: number) => void;
    isLoading?: boolean;
  }
  
  export interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    rowsPerPage: number;
    totalRows: number;
    onPageChange: (page: number) => void;
  }
  
  export interface GenerateButtonProps {
    isGenerating: boolean;
    document: File | null;
    dataFile: File | null;
    onGenerate: () => void;
    onShowGuide: () => void;
  }