'use client';

import PdfGenerator from '@/components/KgClass/PdfGenerator';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GeneratePage() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        onClick={() => router.push('/')}
        className='fixed top-4 left-4'
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </Button>
      <PdfGenerator />
    </div>
  );
} 