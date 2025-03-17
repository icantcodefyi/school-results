'use client';

import PdfGenerator from "@/components/PlayGroup/PdfGenerator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileChartColumnIncreasing } from "lucide-react";
import { ChevronLeft } from "lucide-react";

export default function PlayGroupPage() {
  
  return (
    <div className="container mx-auto py-8">
      <Link href="/">
        <Button variant="ghost" size="sm" className="fixed top-4 left-4">
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <Link href="/playgroup/bulk">
        <Button variant="ghost" size="sm" className="fixed top-4 right-4">
          <FileChartColumnIncreasing className="h-4 w-4" />
          Bulk Generate Results
        </Button>
      </Link>
      
      <PdfGenerator />
    </div>
  );
} 