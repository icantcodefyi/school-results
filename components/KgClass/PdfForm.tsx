"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { useFormStore } from "@/app/store/KgStore";
import { Template } from "@/template/template";

interface PdfFormProps {
  onGenerate: (formData: Record<string, string>) => void;
  isGenerating: boolean;
}

// Define grade options
const gradeOptions = ["A++", "A+", "A", "B+", "B", "C"];

export default function PdfForm({ onGenerate, isGenerating }: PdfFormProps) {
  const { formFields, setFormField, setMultipleFields } = useFormStore();
  const [activeTab, setActiveTab] = useState("personal");

  // State to store categorized fields
  const [personalFields, setPersonalFields] = useState<string[]>([]);
  const [subjectFields, setSubjectFields] = useState<string[]>([]);
  const [personalityFields, setPersonalityFields] = useState<string[]>([]);

  useEffect(() => {
    // Extract and categorize fields from the template
    if (Template.schemas && Template.schemas.length > 0) {
      const extractedPersonalFields: string[] = [];
      const extractedSubjects = new Set<string>();
      const extractedPersonalityTraits = new Set<string>();

      // Get current form fields and setter directly from the store
      const { formFields: currentFields, setMultipleFields: setFields } =
        useFormStore.getState();
      const fields: Record<string, string> = {};
      let needsInitialization = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Template.schemas[0].forEach((field: any) => {
        if (!field.name) return;

        const fieldName = field.name;

        // Initialize field if not already in store
        if (!currentFields[fieldName]) {
          fields[fieldName] = "";
          needsInitialization = true;
        }

        // Categorize fields based on naming patterns
        if (fieldName.includes("-")) {
          // This is either a subject or personality field
          const parts = fieldName.split("-");

          if (parts.length >= 2) {
            if (
              ["hygiene", "general", "confidence", "participation"].includes(
                parts[0]
              )
            ) {
              extractedPersonalityTraits.add(parts[0]);
            } else if (
              [
                "english",
                "math",
                "hindi",
                "englishrhymes",
                "hindirhymes",
                "evs",
                "drawing",
                "moral",
              ].includes(parts[0])
            ) {
              extractedSubjects.add(parts[0]);
            }
          }
        } else {
          // This is likely a personal field
          extractedPersonalFields.push(fieldName);
        }
      });

      // Update state with categorized fields
      setPersonalFields(extractedPersonalFields);
      setSubjectFields(Array.from(extractedSubjects));
      setPersonalityFields(Array.from(extractedPersonalityTraits));

      // Only update the store if there are fields that need initialization
      if (needsInitialization) {
        setFields(fields);
      }
    }
  }, []);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormField(fieldName, value);
  };

  const handleSubmit = () => {
    onGenerate(formFields);
  };

  // Add autofill functions
  const autofillTerm1Grades = (grade: string) => {
    const newFields: Record<string, string> = {};

    // Fill academic subjects for term 1
    subjectFields.forEach((subject) => {
      newFields[`${subject}-oral-term1`] = grade;
      newFields[`${subject}-written-term1`] = grade;
      newFields[`${subject}-total-term1`] = grade;
    });

    // Fill personality traits for term 1
    personalityFields.forEach((trait) => {
      newFields[`${trait}-term1`] = grade;
    });

    setMultipleFields(newFields);
  };

  const autofillTerm2Grades = (grade: string) => {
    const newFields: Record<string, string> = {};

    // Fill academic subjects for term 2
    subjectFields.forEach((subject) => {
      newFields[`${subject}-oral-term2`] = grade;
      newFields[`${subject}-written-term2`] = grade;
      newFields[`${subject}-total-term2`] = grade;
    });

    // Fill personality traits for term 2
    personalityFields.forEach((trait) => {
      newFields[`${trait}-term2`] = grade;
    });

    setMultipleFields(newFields);
  };

  const autofillFinalGrades = (grade: string) => {
    const newFields: Record<string, string> = {};

    // Fill final grades for subjects
    subjectFields.forEach((subject) => {
      newFields[`${subject}-total`] = grade;
    });

    // Fill final grades for personality traits
    personalityFields.forEach((trait) => {
      newFields[`${trait}-total`] = grade;
    });

    setMultipleFields(newFields);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">School Results Generator</CardTitle>
        <CardDescription>
          Fill in the form fields to generate a PDF of school results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="personal"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="term1">Term 1</TabsTrigger>
            <TabsTrigger value="term2">Term 2</TabsTrigger>
            <TabsTrigger value="totals">Final Results</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {personalFields.map((fieldName) => (
                <div key={fieldName} className="space-y-2">
                  <Label htmlFor={fieldName}>
                    {fieldName.charAt(0).toUpperCase() +
                      fieldName.slice(1).replace(/([A-Z])/g, " $1")}
                  </Label>
                  <Input
                    id={fieldName}
                    value={formFields[fieldName] || ""}
                    onChange={(e) =>
                      handleInputChange(fieldName, e.target.value)
                    }
                    placeholder={`Enter ${fieldName
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Term 1 */}
          <TabsContent value="term1">
            <div className="space-y-6">
              {/* Autofill section */}
              <div className="bg-muted p-4 rounded-lg mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="font-medium">Autofill all Term 1 grades:</div>
                  <div className="flex items-center gap-2">
                    <Select onValueChange={autofillTerm1Grades}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((grade) => (
                          <SelectItem
                            key={`autofill-term1-${grade}`}
                            value={grade}
                          >
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground">
                      This will override all current Term 1 grades
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Subjects */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Academic Subjects - Term 1
                </h3>
                <div className="grid grid-cols-4 gap-4 mb-2 font-medium">
                  <div>Subject</div>
                  <div>Oral</div>
                  <div>Written</div>
                  <div>Total</div>
                </div>
                <Separator className="mb-4" />

                {subjectFields.map((subject) => (
                  <div
                    key={`${subject}-term1`}
                    className="grid grid-cols-4 gap-4 mb-4 items-center"
                  >
                    <div className="font-medium">
                      {subject.charAt(0).toUpperCase() +
                        subject.slice(1).replace(/([A-Z])/g, " $1")}
                    </div>
                    <Select
                      value={formFields[`${subject}-oral-term1`] || ""}
                      onValueChange={(value) =>
                        handleInputChange(`${subject}-oral-term1`, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((grade) => (
                          <SelectItem
                            key={`${subject}-oral-term1-${grade}`}
                            value={grade}
                          >
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formFields[`${subject}-written-term1`] || ""}
                      onValueChange={(value) =>
                        handleInputChange(`${subject}-written-term1`, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((grade) => (
                          <SelectItem
                            key={`${subject}-written-term1-${grade}`}
                            value={grade}
                          >
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formFields[`${subject}-total-term1`] || ""}
                      onValueChange={(value) =>
                        handleInputChange(`${subject}-total-term1`, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((grade) => (
                          <SelectItem
                            key={`${subject}-total-term1-${grade}`}
                            value={grade}
                          >
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              {/* Personality Traits */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Personality Traits - Term 1
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {personalityFields.map((trait) => (
                    <div
                      key={`${trait}-term1`}
                      className="flex items-center gap-4"
                    >
                      <Label htmlFor={`${trait}-term1`} className="w-1/3">
                        {trait.charAt(0).toUpperCase() + trait.slice(1)}
                      </Label>
                      <Select
                        value={formFields[`${trait}-term1`] || ""}
                        onValueChange={(value) =>
                          handleInputChange(`${trait}-term1`, value)
                        }
                      >
                        <SelectTrigger className="w-2/3">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {gradeOptions.map((grade) => (
                            <SelectItem
                              key={`${trait}-term1-${grade}`}
                              value={grade}
                            >
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Term 2 */}
          <TabsContent value="term2">
            <div className="space-y-6">
              {/* Autofill section */}
              <div className="bg-muted p-4 rounded-lg mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="font-medium">Autofill all Term 2 grades:</div>
                  <div className="flex items-center gap-2">
                    <Select onValueChange={autofillTerm2Grades}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((grade) => (
                          <SelectItem
                            key={`autofill-term2-${grade}`}
                            value={grade}
                          >
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground">
                      This will override all current Term 2 grades
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Subjects */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Academic Subjects - Term 2
                </h3>
                <div className="grid grid-cols-4 gap-4 mb-2 font-medium">
                  <div>Subject</div>
                  <div>Oral</div>
                  <div>Written</div>
                  <div>Total</div>
                </div>
                <Separator className="mb-4" />

                {subjectFields.map((subject) => (
                  <div
                    key={`${subject}-term2`}
                    className="grid grid-cols-4 gap-4 mb-4 items-center"
                  >
                    <div className="font-medium">
                      {subject.charAt(0).toUpperCase() +
                        subject.slice(1).replace(/([A-Z])/g, " $1")}
                    </div>
                    <Select
                      value={formFields[`${subject}-oral-term2`] || ""}
                      onValueChange={(value) =>
                        handleInputChange(`${subject}-oral-term2`, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((grade) => (
                          <SelectItem
                            key={`${subject}-oral-term2-${grade}`}
                            value={grade}
                          >
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formFields[`${subject}-written-term2`] || ""}
                      onValueChange={(value) =>
                        handleInputChange(`${subject}-written-term2`, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((grade) => (
                          <SelectItem
                            key={`${subject}-written-term2-${grade}`}
                            value={grade}
                          >
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formFields[`${subject}-total-term2`] || ""}
                      onValueChange={(value) =>
                        handleInputChange(`${subject}-total-term2`, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((grade) => (
                          <SelectItem
                            key={`${subject}-total-term2-${grade}`}
                            value={grade}
                          >
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              {/* Personality Traits */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Personality Traits - Term 2
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {personalityFields.map((trait) => (
                    <div
                      key={`${trait}-term2`}
                      className="flex items-center gap-4"
                    >
                      <Label htmlFor={`${trait}-term2`} className="w-1/3">
                        {trait.charAt(0).toUpperCase() + trait.slice(1)}
                      </Label>
                      <Select
                        value={formFields[`${trait}-term2`] || ""}
                        onValueChange={(value) =>
                          handleInputChange(`${trait}-term2`, value)
                        }
                      >
                        <SelectTrigger className="w-2/3">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {gradeOptions.map((grade) => (
                            <SelectItem
                              key={`${trait}-term2-${grade}`}
                              value={grade}
                            >
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Final Results */}
          <TabsContent value="totals">
            <div className="space-y-6">
              {/* Autofill section */}
              <div className="bg-muted p-4 rounded-lg mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="font-medium">Autofill all Final grades:</div>
                  <div className="flex items-center gap-2">
                    <Select onValueChange={autofillFinalGrades}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((grade) => (
                          <SelectItem
                            key={`autofill-final-${grade}`}
                            value={grade}
                          >
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground">
                      This will override all current Final grades
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Subjects */}
              <div>
                <h3 className="text-lg font-medium mb-4">Final Results</h3>
                <div className="grid grid-cols-2 gap-4 mb-2 font-medium">
                  <div>Subject</div>
                  <div>Final Grade</div>
                </div>
                <Separator className="mb-4" />

                {subjectFields.map((subject) => (
                  <div
                    key={`${subject}-total`}
                    className="grid grid-cols-2 gap-4 mb-4 items-center"
                  >
                    <div className="font-medium">
                      {subject.charAt(0).toUpperCase() +
                        subject.slice(1).replace(/([A-Z])/g, " $1")}
                    </div>
                    <Select
                      value={formFields[`${subject}-total`] || ""}
                      onValueChange={(value) =>
                        handleInputChange(`${subject}-total`, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((grade) => (
                          <SelectItem
                            key={`${subject}-total-${grade}`}
                            value={grade}
                          >
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              {/* Personality Traits */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Final Personality Assessment
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {personalityFields.map((trait) => (
                    <div
                      key={`${trait}-total`}
                      className="flex items-center gap-4"
                    >
                      <Label htmlFor={`${trait}-total`} className="w-1/3">
                        {trait.charAt(0).toUpperCase() + trait.slice(1)}
                      </Label>
                      <Select
                        value={formFields[`${trait}-total`] || ""}
                        onValueChange={(value) =>
                          handleInputChange(`${trait}-total`, value)
                        }
                      >
                        <SelectTrigger className="w-2/3">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {gradeOptions.map((grade) => (
                            <SelectItem
                              key={`${trait}-total-${grade}`}
                              value={grade}
                            >
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {
              const tabOrder = ["personal", "term1", "term2", "totals"];
              const currentIndex = tabOrder.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabOrder[currentIndex - 1]);
              }
            }}
            disabled={activeTab === "personal"}
          >
            Previous
          </Button>

          <Button
            onClick={() => {
              const tabOrder = ["personal", "term1", "term2", "totals"];
              const currentIndex = tabOrder.indexOf(activeTab);
              if (currentIndex < tabOrder.length - 1) {
                setActiveTab(tabOrder[currentIndex + 1]);
              }
            }}
            disabled={activeTab === "totals"}
          >
            Next
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={isGenerating}
          className="w-full md:w-auto"
          size="lg"
        >
          {isGenerating ? "Generating..." : "Generate PDF"}
        </Button>
      </CardFooter>
    </Card>
  );
}
