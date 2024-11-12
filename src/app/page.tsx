'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUp, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

const DocumentGenerator = () => {
  const [document, setDocument] = useState<File | null>(null);
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<{ headers: string[]; rows: string[][] }>({
    headers: [],
    rows: []
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocument(file);
  };

  const handleDataFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDataFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      
      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1) as string[][];
      
      setCsvPreview({ headers, rows });
    };
    reader.readAsArrayBuffer(file);
  };

  const generateDocuments = async () => {
    try {
      if (!document || !dataFile) {
        toast.error("Please upload both template and data files");
        return;
      }

      setIsGenerating(true);
      const formData = new FormData();
      formData.append('template', document);
      formData.append('dataFile', dataFile);

      console.log('Template file:', document);
      console.log('Data file:', dataFile);

      const response = await fetch('/api/generate-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate documents');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = globalThis.document.createElement('a');
      a.href = url;
      a.download = 'documents.zip';
      a.click();

      toast.success('Documents generated successfully');
    } catch (error) {
      console.error('Error generating documents:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate documents');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Document Generator</CardTitle>
          <CardDescription>
            Upload a template document and data file to generate multiple documents automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="document-upload">Template Document</Label>
              <div className="grid w-full gap-2">
                <Input
                  id="document-upload"
                  type="file"
                  onChange={handleDocumentUpload}
                  accept=".docx"
                  className="cursor-pointer"
                />
                {document && (
                  <Alert>
                    <FileUp className="h-4 w-4" />
                    <AlertDescription>
                      Uploaded: {document.name}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-file-upload">Data File (Excel)</Label>
              <div className="grid w-full gap-2">
                <Input
                  id="data-file-upload"
                  type="file"
                  onChange={handleDataFileUpload}
                  accept=".xlsx,.xls"
                  className="cursor-pointer"
                />
                {dataFile && (
                  <Alert>
                    <Upload className="h-4 w-4" />
                    <AlertDescription>
                      Uploaded: {dataFile.name}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          {csvPreview.headers.length > 0 && (
            <div className="space-y-2">
              <Label>Data Preview</Label>
              <ScrollArea className="h-[300px] border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {csvPreview.headers.map((header, index) => (
                        <TableHead key={index} className="bg-muted/50">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvPreview.rows.slice(0, 5).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              <p className="text-sm text-muted-foreground">
                Showing first 5 rows of {csvPreview.rows.length} total rows
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          {isGenerating && <Progress value={33} className="w-full" />}
          <Button
            onClick={generateDocuments}
            disabled={isGenerating || !document || !dataFile}
            className="w-full"
          >
            {isGenerating ? "Generating Documents..." : "Generate Documents"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DocumentGenerator;