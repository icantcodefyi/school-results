import { generate } from '@pdfme/generator';
import type { Template as TemplateType } from '@pdfme/common';
import { Template } from '@/template/template';

/**
 * Generates a PDF from the provided form data
 */
export async function generatePdf(formData: Record<string, string>): Promise<Uint8Array> {
  // Convert the template to the expected format
  const pdfTemplate: TemplateType = Template as unknown as TemplateType;
  
  // Create inputs array with the form data
  const inputs = [formData];
  
  // Generate the PDF
  const pdf = await generate({ template: pdfTemplate, inputs });
  
  return new Uint8Array(pdf.buffer);
}

/**
 * Creates a blob URL from PDF data
 */
export function createPdfBlobUrl(pdfData: Uint8Array): string {
  const blob = new Blob([pdfData], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

/**
 * Triggers a download of the PDF
 */
export function downloadPdf(pdfUrl: string, filename: string = 'school-result.pdf'): void {
  const a = document.createElement('a');
  a.href = pdfUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
} 