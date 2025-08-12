"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { downloadFile } from "@/service/common";
import { useMutation } from "@tanstack/react-query";
import React from "react";

interface FileUploadSectionProps {
  files: (File | { fileName: string; filePath: string })[];
  onFilesChange: (files: (File | { fileName: string; filePath: string })[]) => void;
  onFileDelete?: (file: { fileName: string; filePath: string }) => void;
  uploadId: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
  accept?: string;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  onFilesChange,
  onFileDelete,
  uploadId,
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/pdf", // .pdf
    "application/zip", // .zip
    "application/x-rar-compressed", // .rar
    "application/vnd.rar", // .rar (alternative mime type)
    "image/png", // .png
    "image/jpeg", // .jpg, .jpeg
  ],
  allowedExtensions = ["docx", "xlsx", "pdf", "zip", "rar", "png", "jpg", "jpeg"],
  accept = ".docx,.xlsx,.pdf,.zip,.rar,.png,.jpg,.jpeg"
}) => {
  const downloadFileMutation = useMutation({
    mutationFn: downloadFile,
    onSuccess: (data, variables) => {
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = variables.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    const validFiles: File[] = [];

    selectedFiles.forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        alert(
          `File "${file.name}" vượt quá kích thước cho phép (${Math.round(maxSize / 1024 / 1024)}MB)`
        );
        return;
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        // Additional check for file extension if mime type is not recognized
        const extension = file.name.toLowerCase().split(".").pop();

        if (!extension || !allowedExtensions.includes(extension)) {
          alert(
            `File "${file.name}" không đúng định dạng cho phép (${allowedExtensions.join(", ").toUpperCase()})`
          );
          return;
        }
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      // Filter out any existing attachFile objects and keep only File objects when adding new files
      const existingFiles = files.filter((item: any) => 
        item instanceof File || item.fileName
      );
      onFilesChange([...existingFiles, ...validFiles]);
    }

    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleFileRemove = (index: number) => {
    const fileToRemove = files[index];
    
    // If it's an existing file (not a File object), notify parent for deletion tracking
    if (!(fileToRemove instanceof File) && fileToRemove.fileName && onFileDelete) {
      onFileDelete(fileToRemove);
    }

    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const handleFileClick = (file: File | { fileName: string; filePath: string }) => {
    // Only allow download for existing files with fileName
    if (!(file instanceof File) && file.fileName) {
      downloadFileMutation.mutate({
        fileName: file.fileName,
        filePath: file.filePath,
      });
    }
  };

  return (
    <FormItem className="min-w-50 flex flex-col items-center justify-center">
      {/* Display selected files */}
      {Array.isArray(files) && files.length > 0 && (
        <ul className="ml-2 text-xs">
          {files.map((file, idx) => (
            <li
              key={idx}
              className={cn(
                "flex items-center gap-1 text-default-blue",
                file instanceof File ? "cursor-auto" : "cursor-pointer"
              )}
              onClick={() => handleFileClick(file)}
            >
              {file instanceof File ? file.name : file.fileName}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="p-0 ml-1"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering download
                  handleFileRemove(idx);
                }}
                aria-label="Xóa file"
              >
                x
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* Upload button */}
      <FormLabel htmlFor={uploadId}>
        <Button type="button" variant="outline" asChild>
          <span>Upload file</span>
        </Button>
      </FormLabel>

      {/* Hidden file input */}
      <FormControl>
        <Input
          id={uploadId}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
      </FormControl>
    </FormItem>
  );
};

export default FileUploadSection;
