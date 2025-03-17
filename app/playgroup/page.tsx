'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Play Group Result Generator</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-lg mb-4">This feature is coming soon.</p>
          <p>The Play Group result generator is currently being developed and will be available in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
} 