"use client";

import PdfGenerator from "@/components/KgClass/PdfGenerator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileChartColumnIncreasing } from "lucide-react";
import Link from "next/link";

export default function GeneratePage() {

  return (
    <div className="container mx-auto py-8">
      <Link href="/">
        <Button variant="ghost" size="sm" className="fixed top-4 left-4">
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <Link href="/kindergarden/bulk">
        <Button variant="ghost" size="sm" className="fixed top-4 right-4">
          <FileChartColumnIncreasing className="h-4 w-4" />
          Bulk Generate Results
        </Button>
      </Link>
      <PdfGenerator />
    </div>
  );
}
