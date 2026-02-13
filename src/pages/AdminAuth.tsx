 import { useState, useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import { useAuth } from "@/hooks/useAuth";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { toast } from "@/hooks/use-toast";
 import { z } from "zod";
 import { Loader2 } from "lucide-react";
 
 const authSchema = z.object({
   email: z.string().email("Email i pavlefshëm"),
   password: z.string().min(6, "Fjalëkalimi duhet të ketë të paktën 6 karaktere"),
 });
 
 export default function AdminAuth() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const { user, isLoading, isAdmin, signIn, signUp } = useAuth();
   const navigate = useNavigate();
 
   useEffect(() => {
     if (!isLoading && user && isAdmin) {
       navigate("/admin");
     }
   }, [user, isLoading, isAdmin, navigate]);
 
   const handleSignIn = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsSubmitting(true);
 
     try {
       const validated = authSchema.parse({ email, password });
       const { error } = await signIn(validated.email, validated.password);
 
       if (error) {
         toast({
           title: "Gabim",
           description: error.message === "Invalid login credentials" 
             ? "Email ose fjalëkalim i gabuar" 
             : error.message,
           variant: "destructive",
         });
       } else {
         toast({
           title: "Sukses",
           description: "U identifikuat me sukses",
         });
       }
     } catch (err) {
       if (err instanceof z.ZodError) {
         toast({
           title: "Gabim validimi",
           description: err.errors[0].message,
           variant: "destructive",
         });
       }
     } finally {
       setIsSubmitting(false);
     }
   };
 
   const handleSignUp = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsSubmitting(true);
 
     try {
       const validated = authSchema.parse({ email, password });
       const { error } = await signUp(validated.email, validated.password);
 
       if (error) {
         if (error.message.includes("already registered")) {
           toast({
             title: "Gabim",
             description: "Ky email është regjistruar tashmë",
             variant: "destructive",
           });
         } else {
           toast({
             title: "Gabim",
             description: error.message,
             variant: "destructive",
           });
         }
       } else {
         toast({
           title: "Sukses",
           description: "Regjistrimi u krye! Kontrolloni emailin për verifikim.",
         });
       }
     } catch (err) {
       if (err instanceof z.ZodError) {
         toast({
           title: "Gabim validimi",
           description: err.errors[0].message,
           variant: "destructive",
         });
       }
     } finally {
       setIsSubmitting(false);
     }
   };
 
   if (isLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
   }
 
   if (user && !isAdmin) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background p-4">
         <Card className="w-full max-w-md">
           <CardHeader className="text-center">
             <CardTitle className="font-serif text-2xl">Qasje e Kufizuar</CardTitle>
             <CardDescription>
               Llogaria juaj nuk ka qasje në panelin e administratorit.
             </CardDescription>
           </CardHeader>
           <CardContent>
             <Button onClick={() => navigate("/")} className="w-full">
               Kthehu në Faqen Kryesore
             </Button>
           </CardContent>
         </Card>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
       <Card className="w-full max-w-md">
         <CardHeader className="text-center">
           <CardTitle className="font-serif text-2xl">Admin Dashboard</CardTitle>
           <CardDescription>
             Identifikohuni për të hyrë në panelin e menaxhimit
           </CardDescription>
         </CardHeader>
         <CardContent>
           <Tabs defaultValue="login" className="w-full">
             <TabsList className="grid w-full grid-cols-2">
               <TabsTrigger value="login">Hyr</TabsTrigger>
               <TabsTrigger value="register">Regjistrohu</TabsTrigger>
             </TabsList>
             <TabsContent value="login">
               <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                 <div className="space-y-2">
                   <Label htmlFor="login-email">Email</Label>
                   <Input
                     id="login-email"
                     type="email"
                     placeholder="email@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="login-password">Fjalëkalimi</Label>
                   <Input
                     id="login-password"
                     type="password"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                   />
                 </div>
                 <Button type="submit" className="w-full" disabled={isSubmitting}>
                   {isSubmitting ? (
                     <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       Duke u identifikuar...
                     </>
                   ) : (
                     "Hyr"
                   )}
                 </Button>
               </form>
             </TabsContent>
             <TabsContent value="register">
               <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                 <div className="space-y-2">
                   <Label htmlFor="register-email">Email</Label>
                   <Input
                     id="register-email"
                     type="email"
                     placeholder="email@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="register-password">Fjalëkalimi</Label>
                   <Input
                     id="register-password"
                     type="password"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                   />
                 </div>
                 <Button type="submit" className="w-full" disabled={isSubmitting}>
                   {isSubmitting ? (
                     <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       Duke u regjistruar...
                     </>
                   ) : (
                     "Regjistrohu"
                   )}
                 </Button>
               </form>
             </TabsContent>
           </Tabs>
         </CardContent>
       </Card>
     </div>
   );
 }