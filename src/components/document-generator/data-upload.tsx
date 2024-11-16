import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload } from 'lucide-react';
import type { DataUploadProps } from '@/components/document-generator/types';

export function DataUpload({ dataFile, onDataFileUpload }: DataUploadProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          2
        </div>
        <Label className="text-lg font-medium">Upload Data</Label>
      </div>
      <Input
        id="data-file-upload"
        type="file"
        onChange={onDataFileUpload}
        accept=".xlsx,.xls"
        className="cursor-pointer file:bg-primary/10 file:text-primary file:border-0 file:rounded-md hover:file:bg-primary/20 transition-colors"
      />
      {dataFile && (
        <Alert className="bg-primary/5 border-primary/20">
          <Upload className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            {dataFile.name}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}