'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PdfViewerProps {
  pdfUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export default function PdfViewer({ pdfUrl, isOpen, onClose, onDownload }: PdfViewerProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Reset iframe loaded state when PDF URL changes
  useEffect(() => {
    setIframeLoaded(false);
  }, [pdfUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh]">
        <DialogHeader>
          <DialogTitle>PlayGroup Result Preview</DialogTitle>
          <DialogDescription>
            Preview the generated PDF result before downloading.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative flex-1 h-full min-h-[70vh]">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          
          {pdfUrl && (
            <iframe 
              src={`${pdfUrl}#toolbar=0`}
              className="w-full h-full rounded-md border border-border"
              style={{ visibility: iframeLoaded ? 'visible' : 'hidden' }}
              onLoad={() => setIframeLoaded(true)}
            />
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onDownload}>
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 