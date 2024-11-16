import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUp } from 'lucide-react';
import type { DocumentUploadProps } from '@/components/document-generator/types';

export function DocumentUpload({ document, onDocumentUpload }: DocumentUploadProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          1
        </div>
        <Label className="text-lg font-medium">Upload Template</Label>
      </div>
      <Input
        id="document-upload"
        type="file"
        onChange={onDocumentUpload}
        accept=".docx"
        className="cursor-pointer file:bg-primary/10 file:text-primary file:border-0 file:rounded-md hover:file:bg-primary/20 transition-colors"
      />
      {document && (
        <Alert className="bg-primary/5 border-primary/20">
          <FileUp className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            {document.name}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}