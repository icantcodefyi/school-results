'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useFormStore } from '@/app/store/KgStore';

export default function ClassSelector() {
  const router = useRouter();
  const { setFormField } = useFormStore();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const handleClassSelection = (classType: string) => {
    setSelectedClass(classType);
  };

  const handleContinue = () => {
    if (selectedClass) {
      if (selectedClass === 'Play Group') {
        // For Play Group, we'll navigate to a new component (to be created)
        router.push('/playgroup');
      } else {
        setFormField('class', selectedClass);
        router.push('/kindergarden');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-xl">Select Class for Result Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {['Play Group', 'Nursery', 'Junior KG', 'Senior KG'].map((classType) => (
              <Button 
                key={classType}
                variant={selectedClass === classType ? 'default' : 'outline'} 
                className="h-24 text-lg font-medium"
                onClick={() => handleClassSelection(classType)}
              >
                {classType}
              </Button>
            ))}
          </div>
          
          <Button 
            className="w-full mt-8" 
            disabled={!selectedClass}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 