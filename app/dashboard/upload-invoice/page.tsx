"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress"; // Import Progress component

export default function Page() {
  const [isUploading, setIsUploading] = useState(false); // Add loading state
  const [uploadProgress, setUploadProgress] = useState(0); // Add progress state
  const router = useRouter(); // Initialize router

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    setIsUploading(true); // Set loading state
    setUploadProgress(0); // Reset progress

    // Simulate API call with progress
    const simulateUpload = () => {
      return new Promise<void>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10; // Increment progress
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            resolve();
          }
        }, 150); // Update progress every 150ms
      });
    };

    await simulateUpload();

    // Hardcoded ID for redirection
    const hardcodedInvoiceId = "INV-WFESCF";

    // Redirect to the invoice detail page
    router.push(`/dashboard/invoices/${hardcodedInvoiceId}`);
  };

  return (
    <div className="flex flex-1 flex-col p-6 space-y-6">
      <h1 className="text-2xl font-bold">Invoices</h1>

      {/* Always show the upload card */}
      <Card className="border-dashed border-2 border-muted-foreground p-6 flex flex-col items-center justify-center text-center space-y-4">
        <CardHeader className="text-center w-full">
          <CardTitle className="text-xl">Upload Invoice</CardTitle>{" "}
          {/* Centered and larger title */}
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 w-full">
          <Label
            htmlFor="file-upload"
            className={`cursor-pointer flex flex-col items-center space-y-2 w-full ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Input
              id="file-upload"
              type="file"
              accept=".pdf,.jpg,.png"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading} // Disable input while uploading
            />
            <div className="text-muted-foreground">
              {isUploading
                ? `Uploading... ${uploadProgress}%`
                : "Select a file or drag & drop your invoice here"}
            </div>
            {isUploading && (
              <Progress value={uploadProgress} className="w-full max-w-xs" />
            )}{" "}
            {/* Show progress bar */}
            {/* Button is now part of the label, clicking it triggers the file input */}
            <Button asChild variant="outline" disabled={isUploading}>
              <span>{isUploading ? "Processing..." : "Select File"}</span>
            </Button>
          </Label>
        </CardContent>
      </Card>
    </div>
  );
}
