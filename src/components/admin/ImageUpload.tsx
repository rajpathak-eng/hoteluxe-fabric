 import { useState, useRef } from "react";
 import { Button } from "@/components/ui/button";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "@/hooks/use-toast";
 import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
 
 interface ImageUploadProps {
   value: string | null;
   onChange: (url: string | null) => void;
   folder?: string;
 }
 
 export function ImageUpload({ value, onChange, folder = "general" }: ImageUploadProps) {
   const [isUploading, setIsUploading] = useState(false);
   const inputRef = useRef<HTMLInputElement>(null);
 
   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
 
     // Validate file type
     if (!file.type.startsWith("image/")) {
       toast({
         title: "Gabim",
         description: "Ju lutem zgjidhni një imazh",
         variant: "destructive",
       });
       return;
     }
 
     // Validate file size (max 5MB)
     if (file.size > 5 * 1024 * 1024) {
       toast({
         title: "Gabim",
         description: "Imazhi duhet të jetë më i vogël se 5MB",
         variant: "destructive",
       });
       return;
     }
 
     setIsUploading(true);
 
     try {
       const fileExt = file.name.split(".").pop();
       const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
 
       const { error: uploadError } = await supabase.storage
         .from("cms-uploads")
         .upload(fileName, file);
 
       if (uploadError) throw uploadError;
 
       const { data: publicUrl } = supabase.storage
         .from("cms-uploads")
         .getPublicUrl(fileName);
 
       onChange(publicUrl.publicUrl);
       toast({
         title: "Sukses",
         description: "Imazhi u ngarkua me sukses",
       });
     } catch (error: any) {
       console.error("Upload error:", error);
       toast({
         title: "Gabim",
         description: error.message || "Nuk mund të ngarkohet imazhi",
         variant: "destructive",
       });
     } finally {
       setIsUploading(false);
       if (inputRef.current) {
         inputRef.current.value = "";
       }
     }
   };
 
   const handleRemove = () => {
     onChange(null);
   };
 
   return (
     <div className="space-y-2">
       {value ? (
         <div className="relative inline-block">
           <img
             src={value}
             alt="Uploaded"
             className="w-full max-w-xs h-40 object-cover rounded-md border border-border"
           />
           <Button
             type="button"
             variant="destructive"
             size="icon"
             className="absolute top-2 right-2 h-8 w-8"
             onClick={handleRemove}
           >
             <X className="h-4 w-4" />
           </Button>
         </div>
       ) : (
         <div
           className="border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
           onClick={() => inputRef.current?.click()}
         >
           {isUploading ? (
             <div className="flex flex-col items-center gap-2">
               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
               <span className="text-sm text-muted-foreground">Duke ngarkuar...</span>
             </div>
           ) : (
             <div className="flex flex-col items-center gap-2">
               <ImageIcon className="h-8 w-8 text-muted-foreground" />
               <span className="text-sm text-muted-foreground">
                 Klikoni për të ngarkuar imazh
               </span>
               <span className="text-xs text-muted-foreground">PNG, JPG, WEBP deri në 5MB</span>
             </div>
           )}
         </div>
       )}
       <input
         ref={inputRef}
         type="file"
         accept="image/*"
         className="hidden"
         onChange={handleUpload}
         disabled={isUploading}
       />
     </div>
   );
 }