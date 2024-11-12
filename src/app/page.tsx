'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { DocumentData, GeneratedDocument } from '@/types/document-generator';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import * as XLSX from 'xlsx';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import JSZip from 'jszip';

const DocumentGenerator = () => {
  const [document, setDocument] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [dataMapping, setDataMapping] = useState<DocumentData>({});
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [csvPreview, setCsvPreview] = useState<{ headers: string[]; rows: string[][] }>({
    headers: [],
    rows: []
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setDocument(file);
    const reader = new FileReader();
    
    if (file.name.endsWith('.docx')) {
      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        setDocumentContent(result.value);
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = () => {
        const content = reader.result as string;
        setDocumentContent(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDataFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDataFile(file);
    const reader = new FileReader();

    if (file.name.endsWith('.csv')) {
      // Handle CSV
      reader.onload = () => {
        const content = reader.result as string;
        processCSVContent(content);
      };
      reader.readAsText(file);
    } else if (file.name.match(/\.(xlsx|xls)$/)) {
      // Handle Excel
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as string[][];
        
        setCsvPreview({ headers, rows });
        
        const mapping: DocumentData = {};
        rows.forEach(row => {
          headers.forEach((header, index) => {
            if (!mapping[header]) {
              mapping[header] = [];
            }
            mapping[header].push(row[index]?.toString() || '');
          });
        });
        
        setDataMapping(mapping);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Helper function to process CSV content
  const processCSVContent = (content: string) => {
    const rows = content.split('\n')
      .map(row => row.trim())
      .filter(Boolean)
      .map(row => row.split(',').map(cell => cell.trim()));
    
    const headers = rows[0];
    const data = rows.slice(1);
    
    setCsvPreview({ headers, rows: data });
    
    const mapping: DocumentData = {};
    data.forEach(row => {
      headers.forEach((header, index) => {
        if (!mapping[header]) {
          mapping[header] = [];
        }
        mapping[header].push(row[index] || '');
      });
    });
    
    setDataMapping(mapping);
  };

  const generatePersonalizedDocuments = async () => {
    try {
      setIsGenerating(true);

      if (!documentContent) {
        toast.error("Please upload a document first");
        return;
      }

      if (Object.keys(dataMapping).length === 0) {
        toast.error("Please upload a data file first");
        return;
      }

      const numDocuments = Object.values(dataMapping)[0].length;
      if (numDocuments === 0) {
        toast.error("No data rows found in the uploaded file");
        return;
      }

      const documents: GeneratedDocument[] = [];
      const zip = new JSZip();

      for (let i = 0; i < numDocuments; i++) {
        let content = documentContent;
        
        // Replace all placeholders for this row
        Object.entries(dataMapping).forEach(([key, values]) => {
          const placeholder = `\\[${key}\\]`; // Escape brackets for regex
          const regex = new RegExp(placeholder, 'g');
          content = content.replace(regex, values[i] || '');
        });

        // Create document with proper paragraph structure
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: content,
                  }),
                ],
              }),
            ],
          }],
        });

        const buffer = await Packer.toBuffer(doc);
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        
        const filename = `document_${i + 1}.docx`;
        documents.push({
          content,
          filename,
          blob
        });

        zip.file(filename, buffer);
      }
      
      setGeneratedDocuments(documents);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'documents.zip');
      toast.success(`Generated ${documents.length} documents successfully`);
    } catch (error) {
      console.error('Error generating documents:', error);
      toast.error('Failed to generate documents. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToText = () => {
    generatedDocuments.forEach((doc) => {
      saveAs(doc.blob!, doc.filename);
    });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Document Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <label htmlFor="document-upload" className="block font-medium mb-2">
            Upload Document
          </label>
          <input
            id="document-upload"
            type="file"
            onChange={handleDocumentUpload}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          />
        </div>

        <div>
          <label htmlFor="data-file-upload" className="block font-medium mb-2">
            Upload Data File (CSV)
          </label>
          <input
            id="data-file-upload"
            type="file"
            onChange={handleDataFileUpload}
            accept=".csv,.xlsx,.xls"
            className="block w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          />
        </div>

        {csvPreview.headers.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">CSV Preview</h3>
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
                  {csvPreview.rows.map((row, rowIndex) => (
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

        <div className="flex gap-4 mt-4">
          <Button
            onClick={generatePersonalizedDocuments}
            disabled={isGenerating || !document || !dataFile}
          >
            {isGenerating ? "Generating..." : "Generate Documents"}
          </Button>

          <Button
            onClick={exportToText}
            disabled={isGenerating || generatedDocuments.length === 0}
            variant="secondary"
          >
            Export to Text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentGenerator;