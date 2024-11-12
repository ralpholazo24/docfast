'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DocumentData, GeneratedDocument } from '@/types/document-generator';
import * as XLSX from 'xlsx';

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
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Document Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label htmlFor="document-upload" className="block font-medium mb-2">
              Upload Template Document
            </label>
            <input
              id="document-upload"
              type="file"
              onChange={handleDocumentUpload}
              accept=".docx"
              className="block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="data-file-upload" className="block font-medium mb-2">
              Upload Data File
            </label>
            <input
              id="data-file-upload"
              type="file"
              onChange={handleDataFileUpload}
              accept=".xlsx,.xls"
              className="block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {csvPreview.headers.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Data Preview</h3>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {csvPreview.headers.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
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
              </div>
            </div>
          )}

          <Button
            onClick={generateDocuments}
            disabled={isGenerating || !document || !dataFile}
          >
            {isGenerating ? "Generating..." : "Generate Documents"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentGenerator;