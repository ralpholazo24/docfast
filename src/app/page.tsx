'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentUpload } from '@/components/document-generator/document-upload';
import { DataUpload } from '@/components/document-generator/data-upload';
import { DataPreview } from '@/components/document-generator/data-preview';
import { GenerateButton } from '@/components/document-generator/generate-button';
import { UserGuide } from '@/components/shared/guide';
import type { CsvPreview } from '@/components/document-generator/types';

export default function Page() {
  const [document, setDocument] = useState<File | null>(null);
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<CsvPreview>({
    headers: [],
    rows: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    <div className="container mx-auto py-12 px-4 min-h-screen bg-background/50">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="space-y-4 pb-6">
          <CardTitle className="text-3xl font-medium font-bold">DocFast</CardTitle>
          <CardDescription className="text-base">
            Transform your document workflow in two simple steps
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-10">
          <DocumentUpload 
            document={document}
            onDocumentUpload={handleDocumentUpload}
          />
          
          <DataUpload 
            dataFile={dataFile}
            onDataFileUpload={handleDataFileUpload}
          />

          {csvPreview.headers.length > 0 && (
            <DataPreview
              csvPreview={csvPreview}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              setCurrentPage={setCurrentPage}
              isLoading={isGenerating}
            />
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 pt-6">
          {isGenerating && (
            <Progress value={33} className="w-full h-1 bg-primary/20" />
          )}
          <GenerateButton
            isGenerating={isGenerating}
            document={document}
            dataFile={dataFile}
            onGenerate={generateDocuments}
            onShowGuide={() => setShowGuide(true)}
          />
        </CardFooter>
      </Card>

      {showGuide && (
        <Dialog open={showGuide} onOpenChange={setShowGuide}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>How to Use DocFast</DialogTitle>
            </DialogHeader>
            <UserGuide />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}