import { NextRequest, NextResponse } from "next/server";
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const templateFile = formData.get('template') as File;
    const dataFile = formData.get('dataFile') as File;

    if (!templateFile || !dataFile) {
      return NextResponse.json(
        { error: 'Missing required files' },
        { status: 400 }
      );
    }

    // Read template content
    const templateBuffer = await templateFile.arrayBuffer();
    
    // Process data file
    const dataBuffer = await dataFile.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(dataBuffer), { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
      raw: false,
      defval: ''
    });

    // Generate documents
    const outputZip = new JSZip();

    for (const [index, rowData] of Object.entries(jsonData)) {
      try {
        // Create a new instance for each document
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          nullGetter: () => ''
        });

        // Transform the data to match the template placeholders
        const templateData = Object.fromEntries(
          Object.entries(rowData as Record<string, unknown>).map(([key, value]) => [
            key.trim().replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(),
            value?.toString().trim() || ''
          ])
        );

        // Log for debugging
        console.log(`Processing document ${index} with data:`, templateData);

        // Set the data and render
        doc.setData(templateData);
        doc.render();

        const buffer = doc.getZip().generate({
          type: 'nodebuffer',
          compression: 'DEFLATE'
        });

        outputZip.file(`document_${parseInt(index) + 1}.docx`, buffer);
      } catch (error: any) {
        console.error(`Error processing document ${index}:`, error);
        if (error.properties && error.properties.errors) {
          console.error('Template Error:', error.properties.errors);
        }
        throw error;
      }
    }

    const zipBuffer = await outputZip.generateAsync({ type: 'blob' });
    
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=documents.zip',
      },
    });
  } catch (error) {
    console.error('Error generating documents:', error);
    return NextResponse.json(
      { error: 'Failed to generate documents' },
      { status: 500 }
    );
  }
} 