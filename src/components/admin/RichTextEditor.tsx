 import { useEditor, EditorContent } from "@tiptap/react";
 import StarterKit from "@tiptap/starter-kit";
 import Image from "@tiptap/extension-image";
 import Link from "@tiptap/extension-link";
 import { Table } from "@tiptap/extension-table";
 import { TableRow } from "@tiptap/extension-table-row";
 import { TableCell } from "@tiptap/extension-table-cell";
 import { TableHeader } from "@tiptap/extension-table-header";
 import { Button } from "@/components/ui/button";
 import {
   Bold,
   Italic,
   List,
   ListOrdered,
   Heading1,
   Heading2,
   Heading3,
   Link as LinkIcon,
   Image as ImageIcon,
   Table as TableIcon,
   Undo,
   Redo,
   Quote,
 } from "lucide-react";
 import { useEffect } from "react";
 
 interface RichTextEditorProps {
   content: string;
   onChange: (content: string) => void;
   placeholder?: string;
 }
 
 export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
   const editor = useEditor({
     extensions: [
       StarterKit.configure({
         heading: {
           levels: [1, 2, 3],
         },
       }),
       Image.configure({
         HTMLAttributes: {
           class: "rounded-lg max-w-full",
         },
       }),
       Link.configure({
         openOnClick: false,
         HTMLAttributes: {
           class: "text-primary underline",
         },
       }),
       Table.configure({
         resizable: true,
       }),
       TableRow,
       TableCell,
       TableHeader,
     ],
     content,
     editorProps: {
       attributes: {
         class:
           "prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none border border-input rounded-b-md bg-background",
       },
     },
     onUpdate: ({ editor }) => {
       onChange(editor.getHTML());
     },
   });
 
   useEffect(() => {
     if (editor && content !== editor.getHTML()) {
       editor.commands.setContent(content);
     }
   }, [content, editor]);
 
   if (!editor) {
     return null;
   }
 
   const addImage = () => {
     const url = window.prompt("URL e imazhit:");
     if (url) {
       editor.chain().focus().setImage({ src: url }).run();
     }
   };
 
   const addLink = () => {
     const url = window.prompt("URL e linkut:");
     if (url) {
       editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
     }
   };
 
   const addTable = () => {
     editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
   };
 
   return (
     <div className="border border-input rounded-md overflow-hidden">
       {/* Toolbar */}
       <div className="flex flex-wrap gap-1 p-2 bg-muted/50 border-b border-input">
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().toggleBold().run()}
           className={editor.isActive("bold") ? "bg-muted" : ""}
         >
           <Bold className="h-4 w-4" />
         </Button>
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().toggleItalic().run()}
           className={editor.isActive("italic") ? "bg-muted" : ""}
         >
           <Italic className="h-4 w-4" />
         </Button>
         <div className="w-px h-6 bg-border mx-1" />
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
           className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
         >
           <Heading1 className="h-4 w-4" />
         </Button>
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
           className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
         >
           <Heading2 className="h-4 w-4" />
         </Button>
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
           className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
         >
           <Heading3 className="h-4 w-4" />
         </Button>
         <div className="w-px h-6 bg-border mx-1" />
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().toggleBulletList().run()}
           className={editor.isActive("bulletList") ? "bg-muted" : ""}
         >
           <List className="h-4 w-4" />
         </Button>
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().toggleOrderedList().run()}
           className={editor.isActive("orderedList") ? "bg-muted" : ""}
         >
           <ListOrdered className="h-4 w-4" />
         </Button>
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().toggleBlockquote().run()}
           className={editor.isActive("blockquote") ? "bg-muted" : ""}
         >
           <Quote className="h-4 w-4" />
         </Button>
         <div className="w-px h-6 bg-border mx-1" />
         <Button type="button" variant="ghost" size="sm" onClick={addLink}>
           <LinkIcon className="h-4 w-4" />
         </Button>
         <Button type="button" variant="ghost" size="sm" onClick={addImage}>
           <ImageIcon className="h-4 w-4" />
         </Button>
         <Button type="button" variant="ghost" size="sm" onClick={addTable}>
           <TableIcon className="h-4 w-4" />
         </Button>
         <div className="w-px h-6 bg-border mx-1" />
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().undo().run()}
           disabled={!editor.can().undo()}
         >
           <Undo className="h-4 w-4" />
         </Button>
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().redo().run()}
           disabled={!editor.can().redo()}
         >
           <Redo className="h-4 w-4" />
         </Button>
       </div>
       {/* Editor */}
       <EditorContent editor={editor} />
     </div>
   );
 }