'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PdfViewerProps {
  pdfUrl: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
}

export default function PdfViewer({ pdfUrl, isOpen, onOpenChange, onDownload }: PdfViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col">
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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