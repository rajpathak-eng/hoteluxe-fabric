import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Menu, Layout, Info } from "lucide-react";
import { useHeaderSettings, useFooterSettings, useUpdateSiteSetting, NavLink } from "@/hooks/useSiteSettings";
import { ImageUpload } from "./ImageUpload";
import { MenuLinkEditor, MenuLink, convertToMenuLinks, convertToNavLinks } from "./MenuLinkEditor";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SiteSettingsEditor() {
  const { data: headerSettings, isLoading: loadingHeader } = useHeaderSettings();
  const { data: footerSettings, isLoading: loadingFooter } = useFooterSettings();
  const updateSetting = useUpdateSiteSetting();

  // Header state
  const [headerForm, setHeaderForm] = useState({
    logo_url: null as string | null,
    phone: "+355 68 600 0626",
    cta_text: "Kërko një ofertë",
    cta_url: "/merr-nje-oferte",
  });

  const [headerNavLinks, setHeaderNavLinks] = useState<MenuLink[]>([]);
  const [headerServiceLinks, setHeaderServiceLinks] = useState<MenuLink[]>([]);
  const [footerNavLinks, setFooterNavLinks] = useState<MenuLink[]>([]);
  const [footerServiceLinks, setFooterServiceLinks] = useState<MenuLink[]>([]);

  // Footer state
  const [footerForm, setFooterForm] = useState({
    company_description: "",
    phone: "+355 68 600 0626",
    email: "info@emahotelling.com",
    address: "Tiranë, Shqipëri",
    copyright: "© {year} EMA Hotelling. Të gjitha të drejtat e rezervuara.",
  });

  // Load header settings
  useEffect(() => {
    if (headerSettings) {
      setHeaderForm({
        logo_url: headerSettings.logo_url || null,
        phone: headerSettings.phone || "+355 68 600 0626",
        cta_text: headerSettings.cta_text || "Kërko një ofertë",
        cta_url: headerSettings.cta_url || "/merr-nje-oferte",
      });
      // Convert old format to new format with IDs
      if (headerSettings.nav_links) {
        const hasIds = headerSettings.nav_links.length > 0 && 'id' in headerSettings.nav_links[0];
        if (hasIds) {
          setHeaderNavLinks(headerSettings.nav_links as unknown as MenuLink[]);
        } else {
          setHeaderNavLinks(convertToMenuLinks(headerSettings.nav_links));
        }
      }
      if (headerSettings.service_links) {
        const hasIds = headerSettings.service_links.length > 0 && 'id' in headerSettings.service_links[0];
        if (hasIds) {
          setHeaderServiceLinks(headerSettings.service_links as unknown as MenuLink[]);
        } else {
          setHeaderServiceLinks(convertToMenuLinks(headerSettings.service_links));
        }
      } else {
        setHeaderServiceLinks([]);
      }
    }
  }, [headerSettings]);

  // Load footer settings
  useEffect(() => {
    if (footerSettings) {
      setFooterForm({
        company_description: footerSettings.company_description || "",
        phone: footerSettings.phone || "+355 68 600 0626",
        email: footerSettings.email || "info@emahotelling.com",
        address: footerSettings.address || "Tiranë, Shqipëri",
        copyright: footerSettings.copyright || "© {year} EMA Hotelling. Të gjitha të drejtat e rezervuara.",
      });
      // Convert old format to new format with IDs
      if (footerSettings.nav_links) {
        const hasIds = footerSettings.nav_links.length > 0 && 'id' in footerSettings.nav_links[0];
        if (hasIds) {
          setFooterNavLinks(footerSettings.nav_links as unknown as MenuLink[]);
        } else {
          setFooterNavLinks(convertToMenuLinks(footerSettings.nav_links));
        }
      }
      if (footerSettings.service_links) {
        const hasIds = footerSettings.service_links.length > 0 && 'id' in footerSettings.service_links[0];
        if (hasIds) {
          setFooterServiceLinks(footerSettings.service_links as unknown as MenuLink[]);
        } else {
          setFooterServiceLinks(convertToMenuLinks(footerSettings.service_links));
        }
      }
    }
  }, [footerSettings]);

  const handleSaveHeader = async () => {
    try {
      await updateSetting.mutateAsync({ 
        key: "header", 
        value: {
          ...headerForm,
          nav_links: headerNavLinks,
          service_links: headerServiceLinks,
        }
      });
      toast({ title: "Sukses", description: "Header u përditësua" });
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  const handleSaveFooter = async () => {
    try {
      await updateSetting.mutateAsync({ 
        key: "footer", 
        value: {
          ...footerForm,
          nav_links: footerNavLinks, // Save full format with id and isActive
          service_links: footerServiceLinks,
        }
      });
      toast({ title: "Sukses", description: "Footer u përditësua" });
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  if (loadingHeader || loadingFooter) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Rendisni faqet duke i tërhequr. Përdorni ikonën e syrit për të aktivizuar/çaktivizuar faqet pa i fshirë nga sistemi.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="header" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="header" className="gap-2">
            <Menu className="h-4 w-4" />
            Header
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-2">
            <Layout className="h-4 w-4" />
            Footer
          </TabsTrigger>
        </TabsList>

        {/* Header Settings */}
        <TabsContent value="header">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cilësimet e Header</CardTitle>
                <CardDescription>
                  Konfiguron logon, butonin CTA dhe informacionet bazë
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Logoja</Label>
                    <ImageUpload
                      value={headerForm.logo_url}
                      onChange={(url) => setHeaderForm({ ...headerForm, logo_url: url })}
                      folder="site-settings"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Numri i telefonit</Label>
                    <Input
                      value={headerForm.phone}
                      onChange={(e) => setHeaderForm({ ...headerForm, phone: e.target.value })}
                      placeholder="+355 68 600 0626"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Teksti i butonit CTA</Label>
                    <Input
                      value={headerForm.cta_text}
                      onChange={(e) => setHeaderForm({ ...headerForm, cta_text: e.target.value })}
                      placeholder="Kërko një ofertë"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL i butonit CTA</Label>
                    <Input
                      value={headerForm.cta_url}
                      onChange={(e) => setHeaderForm({ ...headerForm, cta_url: e.target.value })}
                      placeholder="/merr-nje-oferte"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Menu Kryesore (Header)</CardTitle>
                <CardDescription>
                  Menaxho linqet që shfaqen në navigimin kryesor të website-it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MenuLinkEditor
                  links={headerNavLinks}
                  onChange={setHeaderNavLinks}
                  title="Linqet e Navigimit"
                  description="Tërhiqni për të ndryshuar renditjen, klikoni syrin për të aktivizuar/çaktivizuar"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shërbimet (dropdown në header)</CardTitle>
                <CardDescription>
                  Vetëm faqet që shtoni këtu do të shfaqen në menynë Shërbimet. Faqe të reja nuk shtohen automatikisht.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MenuLinkEditor
                  links={headerServiceLinks}
                  onChange={setHeaderServiceLinks}
                  title="Linqet e Shërbimeve"
                  description="Shtoni vetëm shërbimet që dëshironi të shfaqen në header. Tërhiqni për renditje."
                />
              </CardContent>
            </Card>

            <Button onClick={handleSaveHeader} disabled={updateSetting.isPending} size="lg">
              {updateSetting.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Ruaj Header
            </Button>
          </div>
        </TabsContent>

        {/* Footer Settings */}
        <TabsContent value="footer">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cilësimet e Footer</CardTitle>
                <CardDescription>
                  Konfiguron informacionet e kontaktit dhe përshkrimin e kompanisë
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Përshkrimi i kompanisë</Label>
                  <Textarea
                    value={footerForm.company_description}
                    onChange={(e) => setFooterForm({ ...footerForm, company_description: e.target.value })}
                    rows={3}
                    placeholder="Furnitor i besueshëm i tekstileve premium..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Telefoni</Label>
                    <Input
                      value={footerForm.phone}
                      onChange={(e) => setFooterForm({ ...footerForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={footerForm.email}
                      onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Adresa</Label>
                    <Input
                      value={footerForm.address}
                      onChange={(e) => setFooterForm({ ...footerForm, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Teksti i Copyright</Label>
                  <Input
                    value={footerForm.copyright}
                    onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })}
                    placeholder="© {year} EMA Hotelling. Të gjitha të drejtat e rezervuara."
                  />
                  <p className="text-xs text-muted-foreground">
                    Përdorni {"{year}"} për të vendosur vitin aktual automatikisht
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Linqet e Navigimit (Footer)</CardTitle>
                <CardDescription>
                  Menaxho linqet që shfaqen në seksionin "Faqet" të footer-it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MenuLinkEditor
                  links={footerNavLinks}
                  onChange={setFooterNavLinks}
                  title="Faqet"
                  description="Tërhiqni për të ndryshuar renditjen, klikoni syrin për të aktivizuar/çaktivizuar"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Linqet e Shërbimeve (Footer)</CardTitle>
                <CardDescription>
                  Menaxho linqet që shfaqen në seksionin "Shërbimet" të footer-it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MenuLinkEditor
                  links={footerServiceLinks}
                  onChange={setFooterServiceLinks}
                  title="Shërbimet"
                  description="Tërhiqni për të ndryshuar renditjen, klikoni syrin për të aktivizuar/çaktivizuar"
                />
              </CardContent>
            </Card>

            <Button onClick={handleSaveFooter} disabled={updateSetting.isPending} size="lg">
              {updateSetting.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Ruaj Footer
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
