"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormStore } from "@/store/PlayGroupStore";

interface PdfFormProps {
  onGenerate: (formData: Record<string, string>) => void;
  isGenerating: boolean;
}

export default function PdfForm({ onGenerate, isGenerating }: PdfFormProps) {
  const { formFields, setFormField } = useFormStore();

  // Define the grade options for select dropdowns
  const gradeOptions = ["A++", "A+", "A", "B+", "B", "C"];
  
  // Define the subject fields for the PlayGroup class
  const subjectFields = [
    "english-A-to-Z",
    "math-1-to-10",
    "hindi",
    "rhymes",
    "drawing",
    "fruits-and-vegetables",
    "bird-and-animals",
    "transport-and-flowers",
    "parts-of-body",
    "hygiene",
    "general-behavior",
    "confidence",
    "participation",
    "days-and-colours",
  ];
  
  const personalInfoFields = [
    { name: "name", label: "Student Name" },
    { name: "fathers", label: "Father's Name" },
    { name: "mothers", label: "Mother's Name" },
    { name: "height/weight", label: "Height/Weight" },
  ];
  
  const academicInfoFields = [
    { name: "class", label: "Class" },
    { name: "dob", label: "Date of Birth" },
    { name: "attendance", label: "Attendance" },
    { name: "scholar num", label: "Scholar Number" },
  ];

  const handleInputChange = (fieldName: string, value: string) => {
    setFormField(fieldName, value);
  };

  const handleGeneratePdf = () => {
    // Validate that required fields are filled
    if (!formFields.name) {
      alert("Please enter the student's name");
      return;
    }

    // Generate the PDF with the form data
    onGenerate(formFields);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">PlayGroup Result Generator</CardTitle>
        <CardDescription className="text-center">
          Fill in the student details and generate a result PDF
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="academic">Academic Info</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalInfoFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    value={formFields[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {academicInfoFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    value={formFields[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Subject Assessment</h3>
          <div className="grid grid-cols-2 gap-4">
            {subjectFields.map((subject) => (
              <div key={subject} className="space-y-2">
                <Label htmlFor={subject}>
                  {subject.charAt(0).toUpperCase() +
                    subject.slice(1).replace(/([A-Z])/g, " $1").replace(/-/g, " ")}
                </Label>
                <Select
                  value={formFields[subject] || ""}
                  onValueChange={(value) => handleInputChange(subject, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map((grade) => (
                      <SelectItem key={`${subject}-${grade}`} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button 
          onClick={handleGeneratePdf} 
          disabled={isGenerating}
          className="w-full max-w-xs"
        >
          {isGenerating ? "Generating..." : "Generate Result PDF"}
        </Button>
      </CardFooter>
    </Card>
  );
} 