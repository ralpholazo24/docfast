import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaginationControls } from '@/components/document-generator/pagination-control';
import type { DataPreviewProps } from '@/components/document-generator/types';
import { Skeleton } from "@/components/ui/skeleton";

export function DataPreview({ 
  csvPreview, 
  currentPage, 
  rowsPerPage, 
  setRowsPerPage, 
  setCurrentPage,
  isLoading = false
}: DataPreviewProps) {
  const paginatedRows = csvPreview.rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(csvPreview.rows.length / rowsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          3
        </div>
        <div className="flex items-center justify-between w-full">
          <Label className="text-lg font-medium">Preview Data</Label>
          <Select
            defaultValue={String(rowsPerPage)}
            value={String(rowsPerPage)}
            onValueChange={(value) => {
              const newValue = Number(value);
              setRowsPerPage(newValue);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[100px] bg-primary/5 border-0">
              <SelectValue placeholder={`${rowsPerPage} rows`} />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" align="end">
              {[10, 25, 50, 100].map((value) => (
                <SelectItem key={value} value={String(value)} onClick={() => {
                  setRowsPerPage(value);
                  setCurrentPage(1);
                }}>
                  {value} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[300px] rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {isLoading ? (
                <TableHead className="bg-muted/50">
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              ) : (
                csvPreview.headers.map((header, index) => (
                  <TableHead key={index} className="bg-muted/50">
                    {header}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: csvPreview.headers.length || 3 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              paginatedRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalRows={csvPreview.rows.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}