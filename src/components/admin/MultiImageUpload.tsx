 import { useState, useRef } from "react";
 import { Button } from "@/components/ui/button";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "@/hooks/use-toast";
 import { Plus, X, Loader2, GripVertical } from "lucide-react";
 
 interface MultiImageUploadProps {
   value: string[];
   onChange: (urls: string[]) => void;
   folder?: string;
   maxImages?: number;
 }
 
 export function MultiImageUpload({
   value = [],
   onChange,
   folder = "products",
   maxImages = 5,
 }: MultiImageUploadProps) {
   const [isUploading, setIsUploading] = useState(false);
   const inputRef = useRef<HTMLInputElement>(null);
 
   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files;
     if (!files || files.length === 0) return;
 
     if (value.length + files.length > maxImages) {
       toast({
         title: "Gabim",
         description: `Mund të ngarkoni maksimumi ${maxImages} imazhe`,
         variant: "destructive",
       });
       return;
     }
 
     setIsUploading(true);
     const newUrls: string[] = [];
 
     try {
       for (const file of Array.from(files)) {
         if (!file.type.startsWith("image/")) continue;
         if (file.size > 5 * 1024 * 1024) continue;
 
         const fileExt = file.name.split(".").pop();
         const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
 
         const { error: uploadError } = await supabase.storage
           .from("cms-uploads")
           .upload(fileName, file);
 
         if (uploadError) throw uploadError;
 
         const { data: publicUrl } = supabase.storage
           .from("cms-uploads")
           .getPublicUrl(fileName);
 
         newUrls.push(publicUrl.publicUrl);
       }
 
       onChange([...value, ...newUrls]);
       toast({
         title: "Sukses",
         description: `${newUrls.length} imazhe u ngarkuan`,
       });
     } catch (error: any) {
       console.error("Upload error:", error);
       toast({
         title: "Gabim",
         description: error.message || "Nuk mund të ngarkohen imazhet",
         variant: "destructive",
       });
     } finally {
       setIsUploading(false);
       if (inputRef.current) {
         inputRef.current.value = "";
       }
     }
   };
 
   const handleRemove = (index: number) => {
     const newValue = [...value];
     newValue.splice(index, 1);
     onChange(newValue);
   };
 
   const moveImage = (fromIndex: number, toIndex: number) => {
     if (toIndex < 0 || toIndex >= value.length) return;
     const newValue = [...value];
     const [moved] = newValue.splice(fromIndex, 1);
     newValue.splice(toIndex, 0, moved);
     onChange(newValue);
   };
 
   return (
     <div className="space-y-4">
       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
         {value.map((url, index) => (
           <div key={index} className="relative group">
             <img
               src={url}
               alt={`Image ${index + 1}`}
               className="w-full h-32 object-cover rounded-md border border-border"
             />
             <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center gap-2">
               <Button
                 type="button"
                 variant="secondary"
                 size="icon"
                 className="h-8 w-8"
                 onClick={() => moveImage(index, index - 1)}
                 disabled={index === 0}
               >
                 ←
               </Button>
               <Button
                 type="button"
                 variant="secondary"
                 size="icon"
                 className="h-8 w-8"
                 onClick={() => moveImage(index, index + 1)}
                 disabled={index === value.length - 1}
               >
                 →
               </Button>
               <Button
                 type="button"
                 variant="destructive"
                 size="icon"
                 className="h-8 w-8"
                 onClick={() => handleRemove(index)}
               >
                 <X className="h-4 w-4" />
               </Button>
             </div>
             <span className="absolute top-2 left-2 bg-background/80 text-xs px-2 py-1 rounded">
               {index + 1}
             </span>
           </div>
         ))}
 
         {value.length < maxImages && (
           <div
             className="border-2 border-dashed border-border rounded-md h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
             onClick={() => inputRef.current?.click()}
           >
             {isUploading ? (
               <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
             ) : (
               <>
                 <Plus className="h-6 w-6 text-muted-foreground" />
                 <span className="text-xs text-muted-foreground mt-1">Shto imazh</span>
               </>
             )}
           </div>
         )}
       </div>
 
       <input
         ref={inputRef}
         type="file"
         accept="image/*"
         multiple
         className="hidden"
         onChange={handleUpload}
         disabled={isUploading}
       />
 
       <p className="text-xs text-muted-foreground">
         {value.length}/{maxImages} imazhe. Hover mbi imazh për të rirenditur ose fshirë.
       </p>
     </div>
   );
 }