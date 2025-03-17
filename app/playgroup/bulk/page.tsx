"use client";

import { useState } from "react";
import BulkDataUpload from "@/components/PlayGroup/BulkDataUpload";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function BulkDataUploadPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="container mx-auto">
      <Link href="/playgroup">
        <Button variant="ghost" size="sm" className="fixed top-4 left-4" disabled={isProcessing}>
          <ChevronLeft className="h-4 w-4" />
          Back to Results
        </Button>
      </Link>

      <div className="max-w-3xl mx-auto h-screen flex items-center justify-center">
        <BulkDataUpload onProcessing={setIsProcessing} />
      </div>
    </div>
  );
} 