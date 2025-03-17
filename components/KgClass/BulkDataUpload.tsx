'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import Papa from 'papaparse';
import { generateBulkPdf, createPdfBlobUrl, downloadPdf } from './pdfUtils';

interface BulkDataUploadProps {
  onProcessing: (isProcessing: boolean) => void;
}

interface StudentData {
  name: string;
  [key: string]: string;
}

export default function BulkDataUpload({ onProcessing }: BulkDataUploadProps) {
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
        downloadPdf(pdfUrl, 'all-student-results.pdf');
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
                'english-oral-term1', 'math-oral-term1', 'hindi-oral-term1', 'englishrhymes-oral-term1',
                'hindirhymes-oral-term1', 'evs-oral-term1', 'drawing-oral-term1', 'moral-oral-term1',
                'english-written-term1', 'math-written-term1', 'hindi-written-term1', 'englishrhymes-written-term1',
                'hindirhymes-written-term1', 'evs-written-term1', 'drawing-written-term1', 'moral-written-term1',
                'english-total-term1', 'math-total-term1', 'hindi-total-term1', 'englishrhymes-total-term1',
                'hindirhymes-total-term1', 'evs-total-term1', 'drawing-total-term1', 'moral-total-term1',
                'english-oral-term2', 'math-oral-term2', 'hindi-oral-term2', 'englishrhymes-oral-term2',
                'hindirhymes-oral-term2', 'evs-oral-term2', 'drawing-oral-term2', 'moral-oral-term2',
                'english-written-term2', 'math-written-term2', 'hindi-written-term2', 'englishrhymes-written-term2',
                'hindirhymes-written-term2', 'evs-written-term2', 'drawing-written-term2', 'moral-written-term2',
                'english-total-term2', 'math-total-term2', 'hindi-total-term2', 'englishrhymes-total-term2',
                'hindirhymes-total-term2', 'evs-total-term2', 'drawing-total-term2', 'moral-total-term2',
                'english-total', 'math-total', 'hindi-total', 'englishrhymes-total', 'hindirhymes-total',
                'evs-total', 'drawing-total', 'moral-total', 
                'hygiene-term1', 'general-term1', 'confidence-term1', 'participation-term1',
                'hygiene-term2', 'general-term2', 'confidence-term2', 'participation-term2',
                'hygiene-total', 'general-total', 'confidence-total', 'participation-total'
              ];
              
              // Create sample data - just two records for demonstration
              const sampleData = [
                {
                  'name': 'Ananya Sharma',
                  'fathers': 'Vikram Sharma',
                  'mothers': 'Neha Sharma',
                  'height/weight': '95cm/15kg',
                  'class': 'Senior KG',
                  'dob': '12/05/2017',
                  'attendance': '92%',
                  'scholar num': 'SKG2023-01',
                  'english-oral-term1': 'A+',
                  'math-oral-term1': 'A',
                  'hindi-oral-term1': 'A+',
                  // Fill in all other fields with sample data
                  'englishrhymes-oral-term1': 'A++',
                  'hindirhymes-oral-term1': 'A+',
                  'evs-oral-term1': 'A',
                  'drawing-oral-term1': 'A++',
                  'moral-oral-term1': 'A+',
                  'english-written-term1': 'A',
                  'math-written-term1': 'A+',
                  'hindi-written-term1': 'A',
                  'englishrhymes-written-term1': 'A+',
                  'hindirhymes-written-term1': 'A',
                  'evs-written-term1': 'A++',
                  'drawing-written-term1': 'A+',
                  'moral-written-term1': 'A',
                  'english-total-term1': 'A+',
                  'math-total-term1': 'A+',
                  'hindi-total-term1': 'A',
                  'englishrhymes-total-term1': 'A++',
                  'hindirhymes-total-term1': 'A+',
                  'evs-total-term1': 'A+',
                  'drawing-total-term1': 'A++',
                  'moral-total-term1': 'A+',
                  'english-oral-term2': 'A++',
                  'math-oral-term2': 'A+',
                  'hindi-oral-term2': 'A+',
                  'englishrhymes-oral-term2': 'A+',
                  'hindirhymes-oral-term2': 'A++',
                  'evs-oral-term2': 'A',
                  'drawing-oral-term2': 'A+',
                  'moral-oral-term2': 'A++',
                  'english-written-term2': 'A+',
                  'math-written-term2': 'A',
                  'hindi-written-term2': 'A+',
                  'englishrhymes-written-term2': 'A+',
                  'hindirhymes-written-term2': 'A+',
                  'evs-written-term2': 'A+',
                  'drawing-written-term2': 'A++',
                  'moral-written-term2': 'A+',
                  'english-total-term2': 'A+',
                  'math-total-term2': 'A+',
                  'hindi-total-term2': 'A+',
                  'englishrhymes-total-term2': 'A++',
                  'hindirhymes-total-term2': 'A+',
                  'evs-total-term2': 'A+',
                  'drawing-total-term2': 'A++',
                  'moral-total-term2': 'A+',
                  'english-total': 'A+',
                  'math-total': 'A+',
                  'hindi-total': 'A+',
                  'englishrhymes-total': 'A++',
                  'hindirhymes-total': 'A+',
                  'evs-total': 'A+',
                  'drawing-total': 'A++',
                  'moral-total': 'A+',
                  'hygiene-term1': 'A+',
                  'general-term1': 'A+',
                  'confidence-term1': 'A+',
                  'participation-term1': 'A++',
                  'hygiene-term2': 'A+',
                  'general-term2': 'A+',
                  'confidence-term2': 'A+',
                  'participation-term2': 'A+',
                  'hygiene-total': 'A+',
                  'general-total': 'A+',
                  'confidence-total': 'A+',
                  'participation-total': 'A+'
                },
                {
                  'name': 'Rohan Patel',
                  'fathers': 'Amit Patel',
                  'mothers': 'Priya Patel',
                  'height/weight': '93cm/14kg',
                  'class': 'Senior KG',
                  'dob': '23/08/2017',
                  'attendance': '95%',
                  'scholar num': 'SKG2023-02',
                  'english-oral-term1': 'A',
                  'math-oral-term1': 'A+',
                  'hindi-oral-term1': 'A',
                  'englishrhymes-oral-term1': 'A+',
                  'hindirhymes-oral-term1': 'A',
                  'evs-oral-term1': 'A+',
                  'drawing-oral-term1': 'A',
                  'moral-oral-term1': 'A',
                  'english-written-term1': 'A+',
                  'math-written-term1': 'A',
                  'hindi-written-term1': 'A+',
                  'englishrhymes-written-term1': 'A',
                  'hindirhymes-written-term1': 'A++',
                  'evs-written-term1': 'A',
                  'drawing-written-term1': 'A+',
                  'moral-written-term1': 'A+',
                  'english-total-term1': 'A+',
                  'math-total-term1': 'A',
                  'hindi-total-term1': 'A+',
                  'englishrhymes-total-term1': 'A+',
                  'hindirhymes-total-term1': 'A+',
                  'evs-total-term1': 'A',
                  'drawing-total-term1': 'A+',
                  'moral-total-term1': 'A+',
                  'english-oral-term2': 'A+',
                  'math-oral-term2': 'A++',
                  'hindi-oral-term2': 'A',
                  'englishrhymes-oral-term2': 'A+',
                  'hindirhymes-oral-term2': 'A+',
                  'evs-oral-term2': 'A+',
                  'drawing-oral-term2': 'A++',
                  'moral-oral-term2': 'A+',
                  'english-written-term2': 'A',
                  'math-written-term2': 'A+',
                  'hindi-written-term2': 'A',
                  'englishrhymes-written-term2': 'A+',
                  'hindirhymes-written-term2': 'A+',
                  'evs-written-term2': 'A',
                  'drawing-written-term2': 'A++',
                  'moral-written-term2': 'A+',
                  'english-total-term2': 'A+',
                  'math-total-term2': 'A++',
                  'hindi-total-term2': 'A',
                  'englishrhymes-total-term2': 'A++',
                  'hindirhymes-total-term2': 'A+',
                  'evs-total-term2': 'A+',
                  'drawing-total-term2': 'A+',
                  'moral-total-term2': 'A++',
                  'english-total': 'A+',
                  'math-total': 'A+',
                  'hindi-total': 'A+',
                  'englishrhymes-total': 'A+',
                  'hindirhymes-total': 'A+',
                  'evs-total': 'A+',
                  'drawing-total': 'A+',
                  'moral-total': 'A++',
                  'hygiene-term1': 'A',
                  'general-term1': 'A+',
                  'confidence-term1': 'A+',
                  'participation-term1': 'A+',
                  'hygiene-term2': 'A',
                  'general-term2': 'A+',
                  'confidence-term2': 'A+',
                  'participation-term2': 'A+',
                  'hygiene-total': 'A+',
                  'general-total': 'A+',
                  'confidence-total': 'A+',
                  'participation-total': 'A+'
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
              a.download = 'school-results-template.csv';
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