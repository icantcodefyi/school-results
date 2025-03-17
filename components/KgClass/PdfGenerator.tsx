'use client';

import { useState } from 'react';
import PdfForm from './PdfForm';
import PdfFormOld from './PdfFormOld';
import PdfViewer from './PdfViewer';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { generatePdf, createPdfBlobUrl, downloadPdf } from './pdfUtils';
import { useFormStore } from '@/store/KgStore';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function PdfGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [useSimpleForm, setUseSimpleForm] = useState(false);
  const { formFields } = useFormStore();
  
  const handleGeneratePdf = async (formData: Record<string, string>) => {
    try {
      setIsGenerating(true);
      
      // Generate the PDF
      const pdfData = await generatePdf(formData);
      
      // Create URL for the blob
      const url = createPdfBlobUrl(pdfData);
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
  
  const handleDownloadPdf = () => {
    if (pdfUrl) {
      // Use student name for the filename if available
      const filename = formFields.name 
        ? `${formFields.name.trim().replace(/\s+/g, '-').toLowerCase()}-result.pdf`
        : 'school-result.pdf';
        
      downloadPdf(pdfUrl, filename);
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-end space-x-2 mb-4">
        <Label htmlFor="form-toggle" className="cursor-pointer">
          {useSimpleForm ? "Using Advanced Form" : "Using Simple Form"}
        </Label>
        <Switch
          id="form-toggle"
          checked={useSimpleForm}
          onCheckedChange={setUseSimpleForm}
        />
      </div>

      {useSimpleForm ? (
        <PdfFormOld 
          onGenerate={handleGeneratePdf}
          isGenerating={isGenerating}
        />
      ) : (
        <PdfForm 
          onGenerate={handleGeneratePdf}
          isGenerating={isGenerating}
        />
      )}

      <PdfViewer
        pdfUrl={pdfUrl}
        isOpen={viewerOpen}
        onOpenChange={setViewerOpen}
        onDownload={handleDownloadPdf}
      />
    </div>
  );
} 