import { Button } from "@/components/ui/button";
import type { PaginationControlsProps } from '@/components/document-generator/types';

export function PaginationControls({
  currentPage,
  totalPages,
  rowsPerPage,
  totalRows,
  onPageChange
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <p>
        Showing rows {(currentPage - 1) * rowsPerPage + 1} to{" "}
        {Math.min(currentPage * rowsPerPage, totalRows)} of{" "}
        {totalRows} total rows
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}