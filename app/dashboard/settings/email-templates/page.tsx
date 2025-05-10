/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, Pencil, Plus, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Template {
  _id: Id<"emailTemplates">;
  userId: Id<"users">;
  name: string;
  subject: string;
  action?: string;
  to: string;
  from: string;
  bcc?: string;
  cc?: string;
  company?: string;
  phone?: string;
  body: string;
}

interface NewTemplate {
  name: string;
  subject: string;
  action: string;
  to: string;
  from: string;
  bcc: string;
  cc: string;
  company: string;
  phone: string;
  body: string;
}

export default function EmailTemplatesTab() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [currentTemplate, setCurrentTemplate] = useState<NewTemplate>({
    name: "",
    subject: "",
    action: "",
    to: "",
    from: "",
    bcc: "",
    cc: "",
    company: "",
    phone: "",
    body: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTemplateId, setCurrentTemplateId] =
    useState<Id<"emailTemplates"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // For MVP, use the first user in the system
  const user = useQuery(api.myFunctions.getFirstUser);
  const userId = user?._id;

  // Get email templates
  const templates = useQuery(
    api.emailTemplates.listEmailTemplates,
    userId ? { userId } : "skip",
  );

  // Mutations
  const createTemplate = useMutation(api.emailTemplates.createEmailTemplate);
  const updateTemplate = useMutation(api.emailTemplates.updateEmailTemplate);
  const deleteTemplate = useMutation(api.emailTemplates.deleteEmailTemplate);

  // Loading states
  const isLoading = templates === undefined || user === undefined;

  const handleAddTemplate = () => {
    setIsEditing(false);
    setCurrentTemplateId(null);
    setCurrentTemplate({
      name: "",
      subject: "",
      action: "",
      to: "",
      from: "",
      bcc: "",
      cc: "",
      company: "",
      phone: "",
      body: "",
    });
    setIsAddDialogOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setIsEditing(true);
    setCurrentTemplateId(template._id);
    setCurrentTemplate({
      name: template.name,
      subject: template.subject,
      action: template.action || "",
      to: template.to,
      from: template.from,
      bcc: template.bcc || "",
      cc: template.cc || "",
      company: template.company || "",
      phone: template.phone || "",
      body: template.body,
    });
    setIsAddDialogOpen(true);
  };

  const handleDeleteTemplate = async (templateId: Id<"emailTemplates">) => {
    try {
      await deleteTemplate({ templateId });
      toast.success("Template deleted successfully");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template");
    }
  };

  const handleSaveTemplate = async () => {
    if (!userId) return;

    setIsSubmitting(true);

    try {
      if (isEditing && currentTemplateId) {
        // Update existing template
        await updateTemplate({
          templateId: currentTemplateId,
          name: currentTemplate.name,
          subject: currentTemplate.subject,
          action: currentTemplate.action || undefined,
          to: currentTemplate.to,
          from: currentTemplate.from,
          bcc: currentTemplate.bcc || undefined,
          cc: currentTemplate.cc || undefined,
          company: currentTemplate.company || undefined,
          phone: currentTemplate.phone || undefined,
          body: currentTemplate.body,
        });
        toast.success("Template updated successfully");
      } else {
        // Create new template
        await createTemplate({
          userId,
          name: currentTemplate.name,
          subject: currentTemplate.subject,
          action: currentTemplate.action || undefined,
          to: currentTemplate.to,
          from: currentTemplate.from,
          bcc: currentTemplate.bcc || undefined,
          cc: currentTemplate.cc || undefined,
          company: currentTemplate.company || undefined,
          phone: currentTemplate.phone || undefined,
          body: currentTemplate.body,
        });
        toast.success("Template created successfully");
      }
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCurrentTemplate((prev) => ({
      ...prev,
      [name as keyof NewTemplate]: value,
    }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Email Templates</CardTitle>
        <Button onClick={handleAddTemplate} variant="default" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Email Template
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="border border-gray-200">
                <CardHeader className="flex flex-row items-start justify-between p-4">
                  <Skeleton className="h-5 w-32" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3.5 w-5/6" />
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3.5 w-4/5" />
                    <Skeleton className="h-3.5 w-1/2" />
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <Skeleton className="h-12 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : templates && templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template._id} className="border border-gray-200">
                <CardHeader className="flex flex-row items-start justify-between p-4">
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {template.name}
                    </CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTemplate(template._id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditTemplate(template)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-xs">
                  <div className="space-y-1.5 text-muted-foreground">
                    {template.subject && (
                      <p>
                        <strong className="text-foreground">Subject:</strong>{" "}
                        {template.subject}
                      </p>
                    )}
                    {template.action && (
                      <p>
                        <strong className="text-foreground">Action:</strong>{" "}
                        {template.action}
                      </p>
                    )}
                    {template.to && (
                      <p>
                        <strong className="text-foreground">To:</strong>{" "}
                        {template.to}
                      </p>
                    )}
                    {template.from && (
                      <p>
                        <strong className="text-foreground">From:</strong>{" "}
                        {template.from}
                      </p>
                    )}
                    {template.bcc && (
                      <p>
                        <strong className="text-foreground">BCC:</strong>{" "}
                        {template.bcc}
                      </p>
                    )}
                    {template.cc && (
                      <p>
                        <strong className="text-foreground">CC:</strong>{" "}
                        {template.cc}
                      </p>
                    )}
                    {template.company && (
                      <p>
                        <strong className="text-foreground">Company:</strong>{" "}
                        {template.company}
                      </p>
                    )}
                    {template.phone && (
                      <p>
                        <strong className="text-foreground">Phone:</strong>{" "}
                        {template.phone}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs line-clamp-3 text-muted-foreground">
                      {template.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
              <Mail className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Email Templates</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create email templates to streamline your communication with
              vendors and clients.
            </p>
            <Button onClick={handleAddTemplate} variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Add Email Template
            </Button>
          </div>
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Email Template" : "Add Email Template"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter Template Name"
                  value={currentTemplate.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Subject"
                    value={currentTemplate.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action">Action</Label>
                  <Input
                    id="action"
                    name="action"
                    placeholder="Action"
                    value={currentTemplate.action}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    name="to"
                    placeholder="Recipient Email"
                    value={currentTemplate.to}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    name="from"
                    placeholder="Sender Email"
                    value={currentTemplate.from}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cc">CC</Label>
                  <Input
                    id="cc"
                    name="cc"
                    placeholder="CC Email"
                    value={currentTemplate.cc}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bcc">BCC</Label>
                  <Input
                    id="bcc"
                    name="bcc"
                    placeholder="BCC Email"
                    value={currentTemplate.bcc}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Company Name"
                    value={currentTemplate.company}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    value={currentTemplate.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Email Body</Label>
                <Textarea
                  id="body"
                  name="body"
                  placeholder="Enter email content here..."
                  value={currentTemplate.body}
                  onChange={handleInputChange}
                  rows={10}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSaveTemplate}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Template"
                    : "Create Template"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
