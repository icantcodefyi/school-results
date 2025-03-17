import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MemoizedInputProps {
  fieldName: string;
  value: string;
  onChange: (fieldName: string, value: string) => void;
}

export const MemoizedInput = memo(function MemoizedInput({
  fieldName,
  value,
  onChange,
}: MemoizedInputProps) {
  const formattedLabel = fieldName.charAt(0).toUpperCase() +
    fieldName.slice(1).replace(/([A-Z])/g, " $1").replace(/-/g, " ");

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName}>{formattedLabel}</Label>
      <Input
        id={fieldName}
        value={value}
        onChange={(e) => onChange(fieldName, e.target.value)}
        placeholder={`Enter ${fieldName
          .replace(/([A-Z])/g, " $1")
          .replace(/-/g, " ")
          .toLowerCase()}`}
      />
    </div>
  );
}); 