"use client";

import BulkDataUpload from "@/components/KgClass/BulkDataUpload";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function BulkDataUploadPage() {
  return (
    <div className="container mx-auto">
      <Link href="/kindergarden">
        <Button variant="ghost" size="sm" className="fixed top-4 left-4">
          <ChevronLeft className="h-4 w-4" />
          Back to Results
        </Button>
      </Link>

      <div className="max-w-3xl mx-auto h-screen flex items-center justify-center">
        <BulkDataUpload />
      </div>
    </div>
  );
}
