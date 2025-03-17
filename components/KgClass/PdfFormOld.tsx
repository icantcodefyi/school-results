"use client";

import { useState, useEffect } from "react";
import { Template } from "@/template/template";
import { generate } from "@pdfme/generator";
import type { Template as TemplateType } from "@pdfme/common";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStore } from "@/store/KgStore";

interface PdfGeneratorProps {
  onGenerate?: (formData: Record<string, string>) => void;
  isGenerating?: boolean;
}

export default function PdfGenerator({
  onGenerate,
  isGenerating: externalIsGenerating,
}: PdfGeneratorProps) {
  const { formFields, setFormField } = useFormStore();
  const [localIsGenerating, setLocalIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [fieldNames, setFieldNames] = useState<string[]>([]);

  // Use external isGenerating state if provided, otherwise use local state
  const isGenerating =
    externalIsGenerating !== undefined
      ? externalIsGenerating
      : localIsGenerating;

  useEffect(() => {
    // Extract field names from the template and initialize if not already in store
    if (Template.schemas && Template.schemas.length > 0) {
      const { formFields: currentFields, setMultipleFields } =
        useFormStore.getState();
      const fields: Record<string, string> = {};
      let needsInitialization = false;
      const extractedFieldNames: string[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Template.schemas[0].forEach((field: any) => {
        if (field.name) {
          extractedFieldNames.push(field.name);
          if (!currentFields[field.name]) {
            fields[field.name] = "";
            needsInitialization = true;
          }
        }
      });

      setFieldNames(extractedFieldNames);

      if (needsInitialization) {
        setMultipleFields(fields);
      }
    }
  }, []);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormField(fieldName, value);
  };

  const generatePdf = async () => {
    // If external onGenerate is provided, use that
    if (onGenerate) {
      onGenerate(formFields);
      return;
    }

    // Otherwise, handle PDF generation internally
    try {
      setLocalIsGenerating(true);

      // Convert the template to the expected format
      const pdfTemplate: TemplateType = Template as unknown as TemplateType;

      // Create inputs array with the form data
      const inputs = [formFields];

      // Generate the PDF
      const pdf = await generate({ template: pdfTemplate, inputs });

      // Create a blob and save it for viewing
      const blob = new Blob([new Uint8Array(pdf.buffer)], {
        type: "application/pdf",
      });

      // Create URL for the blob
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      // Open the viewer dialog
      setViewerOpen(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please check console for details.");
    } finally {
      setLocalIsGenerating(false);
    }
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "school-results.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            School Results Generator (Simple View)
          </CardTitle>
          <CardDescription>
            Fill in the form fields to generate a PDF of school results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fieldNames.map((fieldName) => (
              <div key={fieldName} className="space-y-2">
                <Label htmlFor={fieldName}>
                  {fieldName.charAt(0).toUpperCase() +
                    fieldName
                      .slice(1)
                      .replace(/([A-Z])/g, " $1")
                      .replace(/-/g, " ")}
                </Label>
                <Input
                  id={fieldName}
                  value={formFields[fieldName] || ""}
                  onChange={(e) => handleInputChange(fieldName, e.target.value)}
                  placeholder={`Enter ${fieldName
                    .replace(/([A-Z])/g, " $1")
                    .replace(/-/g, " ")
                    .toLowerCase()}`}
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
            {isGenerating ? "Generating..." : "Generate PDF"}
          </Button>
        </CardFooter>
      </Card>

      {/* PDF Viewer Dialog - Only shown when using internal generation */}
      {!onGenerate && (
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
              <Button onClick={downloadPdf}>Download PDF</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
