'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Pencil, Plus } from 'lucide-react';

// Example templates data structure
const initialTemplates = [
  {
    id: '1',
    name: 'Tire Template',
    subject: 'Discrepancy Found in Tire Replacement Invoice',
    action: 'Required',
    to: 'accounts@example.com',
    from: 'support@windy-city-logistics.com',
    bcc: 'BCC1',
    cc: 'accounts@chicago.il',
    company: 'Windy City Logistics LLC',
    phone: '+1 (312) 555-4488',
    body: `Hello Team,
We hope this message finds you well.
Our automated systems have detected an invoice discrepancy. The records show we've been charged for a discrepancy line item attached that requires your attention.

Invoice Details:
- Invoice Number: [Insert #]
- Service Date: [Service Date]
- Amount Billed: $[Amount]
- Amount Disputed: $[Amount]

Thank you for your prompt attention to this matter.`
  },
  {
    id: '2',
    name: 'Cool Year Template',
    subject: 'Discrepancy Found in Tire Replacement Invoice',
    action: 'Required',
    to: 'accounts@example.com',
    from: 'support@windy-city-logistics.com',
    bcc: 'BCC1',
    cc: 'accounts@chicago.il',
    company: 'Windy City Logistics LLC',
    phone: '+1 (312) 555-4488',
    body: `Hello Team,
We hope this message finds you well.
Our automated systems have detected an invoice discrepancy. The records show we've been charged for a discrepancy line item attached that requires your attention.

Invoice Details:
- Invoice Number: [Insert #]
- Service Date: [Service Date]
- Amount Billed: $[Amount]
- Amount Disputed: $[Amount]

Thank you for your prompt attention to this matter.`
  }
];

interface Template {
  id: string;
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
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template>({
    id: '',
    name: '',
    subject: '',
    action: '',
    to: '',
    from: '',
    bcc: '',
    cc: '',
    company: '',
    phone: '',
    body: ''
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleAddTemplate = () => {
    setIsEditing(false);
    setCurrentTemplate({
      id: '',
      name: '',
      subject: '',
      action: '',
      to: '',
      from: '',
      bcc: '',
      cc: '',
      company: '',
      phone: '',
      body: ''
    });
    setIsAddDialogOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setIsEditing(true);
    setCurrentTemplate(template);
    setIsAddDialogOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  const handleSaveTemplate = () => {
    if (isEditing) {
      setTemplates(templates.map(template => 
        template.id === currentTemplate.id ? currentTemplate : template
      ));
    } else {
      const newTemplate = {
        ...currentTemplate,
        id: Date.now().toString()
      };
      setTemplates([...templates, newTemplate]);
    }
    setIsAddDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentTemplate(prev => ({
      ...prev,
      [name as keyof Template]: value
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
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-6">
              <img 
                src="/placeholder/300/200" 
                alt="No templates" 
                className="w-48 h-48 opacity-50" 
              />
            </div>
            <p className="text-center text-muted-foreground mb-6">There's no Templates yet</p>
            <Button onClick={handleAddTemplate} variant="default">
              Add Email Template
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="border border-gray-200">
                <CardHeader className="flex flex-row items-start justify-between p-4">
                  <div>
                    <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-xs">
                  <div className="space-y-1">
                    <p><strong>Subject:</strong> {template.subject}</p>
                    <p><strong>Action:</strong> {template.action}</p>
                    <p><strong>To:</strong> {template.to}</p>
                    <p><strong>From:</strong> {template.from}</p>
                    <p><strong>BCC:</strong> {template.bcc}</p>
                    <p><strong>CC:</strong> {template.cc}</p>
                    <p><strong>Company:</strong> {template.company}</p>
                    <p><strong>Phone:</strong> {template.phone}</p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs line-clamp-3">{template.body}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Email Template' : 'Add Email Template'}
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
                    placeholder="To" 
                    value={currentTemplate.to} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Input 
                    id="from" 
                    name="from" 
                    placeholder="From" 
                    value={currentTemplate.from} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bcc">BCC</Label>
                  <Input 
                    id="bcc" 
                    name="bcc" 
                    placeholder="BCC" 
                    value={currentTemplate.bcc} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cc">CC</Label>
                  <Input 
                    id="cc" 
                    name="cc" 
                    placeholder="CC" 
                    value={currentTemplate.cc} 
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
                    placeholder="Company" 
                    value={currentTemplate.company} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="Phone" 
                    value={currentTemplate.phone} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="body">Email Template</Label>
                <Textarea 
                  id="body" 
                  name="body" 
                  placeholder="Please type the email template" 
                  className="min-h-[200px]"
                  value={currentTemplate.body} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate}>Save Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}