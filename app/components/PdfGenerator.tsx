'use client';

import { useState, useEffect } from 'react';
import { Template } from '../../template/template';
import { generate } from '@pdfme/generator';
import type { Template as TemplateType } from '@pdfme/common';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PdfGenerator() {
  const [formFields, setFormFields] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);



  
  useEffect(() => {
    // Extract field names from the template
    const fields: Record<string, string> = {};
    
    if (Template.schemas && Template.schemas.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Template.schemas[0].forEach((field: any) => {
        if (field.name) {
          fields[field.name] = '';
        }
      });
    }
    
    setFormFields(fields);
  }, []);
  
  const handleInputChange = (fieldName: string, value: string) => {
    setFormFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  const generatePdf = async () => {
    try {
      setIsGenerating(true);
      
      // Convert the template to the expected format
      const pdfTemplate: TemplateType = Template as unknown as TemplateType;
      
      // Create inputs array with the form data
      const inputs = [formFields];
      
      // Generate the PDF
      const pdf = await generate({ template: pdfTemplate, inputs });
      
      // Create a blob and save it for viewing
      const blob = new Blob([new Uint8Array(pdf.buffer)], { type: 'application/pdf' });
      
      // Create URL for the blob
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      
      // Open the viewer dialog
      setViewerOpen(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadPdf = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'school-results.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">School Results Generator</CardTitle>
          <CardDescription>
            Fill in the form fields to generate a PDF of school results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formFields).map((fieldName) => (
              <div key={fieldName} className="space-y-2">
                <Label htmlFor={fieldName}>
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')}
                </Label>
                <Input
                  id={fieldName}
                  value={formFields[fieldName]}
                  onChange={(e) => handleInputChange(fieldName, e.target.value)}
                  placeholder={`Enter ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={generatePdf}
            disabled={isGenerating}
            className="w-full md:w-auto"
          >
            {isGenerating ? 'Generating...' : 'Generate PDF'}
          </Button>
        </CardFooter>
      </Card>

      {/* PDF Viewer Dialog */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>PDF Preview</DialogTitle>
            <DialogDescription>
              Preview of your generated school results
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 mt-4">
            {pdfUrl && (
              <iframe 
                src={pdfUrl} 
                className="w-full h-full border-0 rounded-md"
                title="PDF Preview"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setViewerOpen(false)}>
              Close
            </Button>
            <Button onClick={downloadPdf}>
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 