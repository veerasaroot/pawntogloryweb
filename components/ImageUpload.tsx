"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  defaultImage?: string;
  className?: string;
}

export function ImageUpload({
  onUpload,
  defaultImage,
  className,
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(defaultImage);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();
  const { t } = useLanguage();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("images").getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
      onUpload(data.publicUrl);
    } catch (error: any) {
      alert(t("upload.error") + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl(undefined);
    onUpload("");
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {imageUrl ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border group">
          <Image
            src={imageUrl}
            alt={t("upload.image_alt")}
            fill
            className="object-cover"
          />
          <button
            onClick={removeImage}
            type="button"
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors border-border">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <Loader2 className="w-8 h-8 mb-4 text-muted-foreground animate-spin" />
              ) : (
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
              )}
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">{t("upload.click")}</span>{" "}
                {t("upload.drag")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("upload.hint")}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
