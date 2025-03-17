'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import Papa from 'papaparse';
import { generateBulkPdf, createPdfBlobUrl, downloadPdf } from './pdfUtils';

interface BulkDataUploadProps {
  onProcessing?: (isProcessing: boolean) => void;
}

interface StudentData {
  name: string;
  [key: string]: string;
}

export default function BulkDataUpload({ onProcessing = () => {} }: BulkDataUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
  };

  const resetFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateData = (data: StudentData[]) => {
    if (data.length === 0) {
      throw new Error('CSV file is empty');
    }

    // Check if the CSV has the required fields (at minimum 'name')
    const firstRow = data[0];
    if (!firstRow.name) {
      throw new Error('CSV must contain a "name" column');
    }

    return data;
  };

  const processFile = async () => {
    if (!file) {
      setError('Please select a CSV file first');
      return;
    }

    try {
      setIsProcessing(true);
      setProcessedCount(0);
      setError(null);
      onProcessing(true);

      console.log("Starting file processing");

      // Parse CSV file
      const results = await new Promise<Papa.ParseResult<StudentData>>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: resolve,
          error: reject
        });
      });

      console.log("CSV parsing complete:", results.data.length, "records found");

      // Validate data
      const studentData = validateData(results.data);
      setTotalCount(studentData.length);
      
      console.log("Data validated:", studentData.length, "valid records");
      console.log("First record sample:", JSON.stringify(studentData[0]).substring(0, 100) + "...");

      try {
        // Generate a single PDF with all student results
        console.log("Starting PDF generation");
        const pdfData = await generateBulkPdf(studentData);
        console.log("PDF generation complete, size:", Math.round(pdfData.length / 1024), "KB");
        
        // Create a blob URL for the PDF
        const pdfUrl = createPdfBlobUrl(pdfData);
        console.log("PDF URL created");
        
        // Download the PDF
        console.log("Initiating download");
        downloadPdf(pdfUrl, 'all-playgroup-results.pdf');
        console.log("Download initiated");
        
        setProcessedCount(studentData.length);
      } catch (pdfError) {
        console.error("Error in PDF processing:", pdfError);
        setError(pdfError instanceof Error ? pdfError.message : 'Error generating PDF');
      }
    } catch (err) {
      console.error('Error processing CSV file:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsProcessing(false);
      onProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Bulk Generate Results</h2>
        <p className="text-sm text-gray-500">
          Upload a CSV file with student data to generate a PDF with all student results.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="csv-file">Upload CSV File</Label>
          <Input
            ref={fileInputRef}
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          <p className="text-xs text-gray-500 mt-1">
            CSV must have columns matching the form fields (name, fathers, etc.)
          </p>
        </div>

        {file && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Selected: {file.name}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFile}
              disabled={isProcessing}
            >
              Clear
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ 
                  width: totalCount ? `${(processedCount / totalCount) * 100}%` : '0%',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <p className="text-sm text-center">
              Processing {processedCount} of {totalCount} students...
            </p>
          </div>
        )}

        <Button 
          onClick={processFile} 
          disabled={!file || isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Processing...' : 'Generate Combined PDF'}
        </Button>
      </div>

      <div className="text-sm p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-2">CSV Format Guide</h3>
        <p className="mb-2">Your CSV should include columns for each field in the form:</p>
        <code className="block bg-gray-100 p-2 rounded text-xs overflow-x-auto whitespace-nowrap">
          name,fathers,mothers,height/weight,class,dob,attendance,scholar num,...
        </code>
        <p className="mt-2">
          <a 
            href="#" 
            className="text-primary underline" 
            onClick={(e) => {
              e.preventDefault();
              // Generate and download a template CSV with column headers
              const headers = [
                'name', 'fathers', 'mothers', 'height/weight', 'class', 'dob', 'attendance', 'scholar num',
                'english-A-to-Z', 'math-1-to-10', 'hindi', 'rhymes', 'drawing', 'fruits-and-vegetables',
                'bird-and-animals', 'transport-and-flowers', 'parts-of-body', 'hygiene', 'general-behavior',
                'confidence', 'participation', 'days-and-colours'
              ];
              
              // Create sample data - just two records for demonstration
              const sampleData = [
                {
                  'name': 'Ananya Sharma',
                  'fathers': 'Vikram Sharma',
                  'mothers': 'Neha Sharma',
                  'height/weight': '85cm/12kg',
                  'class': 'Play Group',
                  'dob': '12/05/2019',
                  'attendance': '92%',
                  'scholar num': 'PG2023-01',
                  'english-A-to-Z': 'A+',
                  'math-1-to-10': 'A',
                  'hindi': 'A+',
                  'rhymes': 'A+',
                  'drawing': 'A++',
                  'fruits-and-vegetables': 'A+',
                  'bird-and-animals': 'A',
                  'transport-and-flowers': 'A+',
                  'parts-of-body': 'A',
                  'hygiene': 'A+',
                  'general-behavior': 'A+',
                  'confidence': 'A',
                  'participation': 'A+',
                  'days-and-colours': 'A'
                },
                {
                  'name': 'Rohan Patel',
                  'fathers': 'Amit Patel',
                  'mothers': 'Priya Patel',
                  'height/weight': '83cm/11kg',
                  'class': 'Play Group',
                  'dob': '23/08/2019',
                  'attendance': '95%',
                  'scholar num': 'PG2023-02',
                  'english-A-to-Z': 'A',
                  'math-1-to-10': 'A+',
                  'hindi': 'A',
                  'rhymes': 'A+',
                  'drawing': 'A',
                  'fruits-and-vegetables': 'A+',
                  'bird-and-animals': 'A++',
                  'transport-and-flowers': 'A',
                  'parts-of-body': 'A+',
                  'hygiene': 'A',
                  'general-behavior': 'A+',
                  'confidence': 'A+',
                  'participation': 'A++',
                  'days-and-colours': 'A+'
                }
              ];
              
              // Generate CSV with headers and sample data
              const csv = Papa.unparse({
                fields: headers,
                data: sampleData
              });
              
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'playgroup-results-template.csv';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            Download Template CSV
          </a>
        </p>
      </div>
    </div>
  );
} 