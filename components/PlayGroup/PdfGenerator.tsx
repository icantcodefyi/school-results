'use client';

import { useState } from 'react';
import PdfForm from './PdfForm';
import PdfFormOld from './PdfFormOld';
import PdfViewer from './PdfViewer';
import { generatePdf, createPdfBlobUrl, downloadPdf } from './pdfUtils';
import { useFormStore } from '@/store/PlayGroupStore';
import { Switch } from '@/components/ui/switch';

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
        ? `${formFields.name.trim().replace(/\s+/g, '-').toLowerCase()}-playgroup-result.pdf`
        : 'playgroup-result.pdf';
        
      downloadPdf(pdfUrl, filename);
    }
  };
  
  const handleCloseViewer = () => {
    setViewerOpen(false);
  };

  return (
    <div className="container mx-auto py-4">
      <div className="mb-4 flex justify-end items-center max-w-5xl gap-2">
        <span className="text-sm text-gray-500">Simple View</span>
        <Switch 
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
        onClose={handleCloseViewer}
        onDownload={handleDownloadPdf}
      />
    </div>
  );
} 