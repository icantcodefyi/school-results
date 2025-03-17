import { generate } from '@pdfme/generator';
import type { Template as TemplateType } from '@pdfme/common';
import { Template } from '@/template/playschool';
import JSZip from 'jszip';

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
 * Generates a single PDF containing all student results
 */
export async function generateBulkPdf(formDataArray: Record<string, string>[]): Promise<Uint8Array> {
  console.log("generateBulkPdf called with", formDataArray.length, "records");
  
  if (!formDataArray || formDataArray.length === 0) {
    console.error("Empty form data array passed to generateBulkPdf");
    throw new Error("No student data provided for PDF generation");
  }
  
  try {
    // Convert the template to the expected format
    const pdfTemplate: TemplateType = Template as unknown as TemplateType;
    
    // Log the first record to help with debugging
    console.log("Sample record:", JSON.stringify(formDataArray[0]).substring(0, 100) + "...");
    
    // Generate all PDFs in a single document
    console.log(`Generating PDF with ${formDataArray.length} student records...`);
    const pdf = await generate({ 
      template: pdfTemplate, 
      inputs: formDataArray 
    });
    
    const resultPdf = new Uint8Array(pdf.buffer);
    console.log(`PDF generated successfully, size: ${Math.round(resultPdf.length / 1024)} KB`);
    
    return resultPdf;
  } catch (error) {
    console.error("Error in generateBulkPdf:", error);
    throw error;
  }
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
export function downloadPdf(pdfUrl: string, filename: string = 'playgroup-result.pdf'): void {
  const a = document.createElement('a');
  a.href = pdfUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Legacy functions kept for compatibility
/**
 * Generates multiple PDFs from an array of form data (deprecated)
 */
export async function generateBulkPdfs(formDataArray: Record<string, string>[]): Promise<Uint8Array[]> {
  console.warn("generateBulkPdfs is deprecated, use generateBulkPdf instead");
  const pdf = await generateBulkPdf(formDataArray);
  
  // For compatibility, return an array with a single PDF
  return [pdf];
}

/**
 * Creates a zip file containing multiple PDFs (deprecated)
 */
export async function createPdfZip(pdfDataArray: Uint8Array[], fileNames: string[]): Promise<Blob> {
  console.warn("createPdfZip is deprecated, use downloadPdf with the result of generateBulkPdf instead");
  const zip = new JSZip();
  
  // Add each PDF to the zip file
  pdfDataArray.forEach((pdfData, index) => {
    const fileName = fileNames[index] || `result-${index + 1}.pdf`;
    zip.file(fileName, pdfData);
  });
  
  // Generate the zip file
  return await zip.generateAsync({ type: 'blob' });
} 