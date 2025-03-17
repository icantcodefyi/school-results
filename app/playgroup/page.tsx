'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlayGroupPage() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        className="fixed"
        onClick={() => router.push('/')}
      >
        ← Back to Class Selection
      </Button>
      
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