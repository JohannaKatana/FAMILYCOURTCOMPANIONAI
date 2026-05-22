import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";

type Props = {
  onFileSelected?: (file: File) => void;
  accept?: string;
  label?: string;
  description?: string;
};

export function UploadCard({ onFileSelected, accept = ".pdf,.doc,.docx,.txt,.jpg,.png", label = "Choose File", description = "PDF, DOC, DOCX, TXT, JPG, PNG" }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelected?.(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected?.(file);
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      data-testid="upload-card"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          {isDragging ? <FileText className="h-7 w-7 text-primary" /> : <Upload className="h-7 w-7 text-primary" />}
        </div>
        <div>
          <p className="font-medium text-sm">{isDragging ? "Drop your file here" : "Drag and drop a file here"}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <label className="cursor-pointer">
          <Button type="button" variant="outline" size="sm" className="pointer-events-none" data-testid="button-choose-file">
            {label}
          </Button>
          <input type="file" className="hidden" accept={accept} onChange={handleChange} />
        </label>
      </div>
    </div>
  );
}
