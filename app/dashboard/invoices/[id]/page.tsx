'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, ChevronDown, ChevronUp, Clipboard, Edit, FileText, Mail, RefreshCw, AlertCircle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

// Mock user data - replace with actual user data in production
const currentUser = {
  name: "John Doe",
  id: "user123"
};

// Status definitions
const statuses = [
  { text: "Pending", variant: "secondary" },
  { text: "Approved", variant: "success" },
  { text: "Rejected", variant: "destructive" },
  { text: "Escalated", variant: "warning" },
] as const;

interface InvoiceItem {
  description: string;
  type: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

interface InvoiceAnalysis {
  businessRule: string;
  escalationReason: string;
  issues: string[];
  description?: string;
  items?: Array<{ description: string }>;
}

interface InvoiceDetails {
  id: string;
  vendorName: string;
  truckId: string;
  assignedDriver: string;
  issueDate: string;
  fuelType: string;
  mileage: string;
  totalPrice: string;
  partsAndLabor: InvoiceItem[];
  analysis: InvoiceAnalysis;
  escalationEmail: {
    body: string;
    signature: string;
  };
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;

  // Fetch invoice data from Convex
  const invoice = useQuery(api.invoices.getInvoiceById, { invoiceId });

  // State for invoice details
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null);
  const [editableBasicInfo, setEditableBasicInfo] = useState<InvoiceDetails | null>(null);
  const [editablePartsLabor, setEditablePartsLabor] = useState<InvoiceItem[]>([]);
  const [isEscalationEmailExpanded, setIsEscalationEmailExpanded] = useState(true);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('Choose Template');
  const [isBasicInfoEditing, setIsBasicInfoEditing] = useState(false);
  const [isPartsLaborEditing, setIsPartsLaborEditing] = useState(false);
  const [isHumanNotesEditing, setIsHumanNotesEditing] = useState(false);
  const [humanNotes, setHumanNotes] = useState('');
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [reviewer, setReviewer] = useState<string | null>(null);

  // Update local state when invoice data is fetched
  useEffect(() => {
    if (invoice) {
      const details = {
        id: invoice.invoiceEid,
        vendorName: "Vendor", // You might want to fetch vendor details separately
        truckId: invoice.truckId,
        assignedDriver: "Driver", // You might want to fetch driver details separately
        issueDate: new Date(invoice.dateIssued).toISOString().split('T')[0],
        fuelType: "Diesel", // This might come from a different table
        mileage: "N/A", // This might come from a different table
        totalPrice: `$${invoice.totalAmount.toFixed(2)}`,
        partsAndLabor: invoice.items.map(item => ({
          description: item.description,
          type: "Part", // You might want to add a type field to your items
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost: item.total
        })),
        analysis: invoice.analysis ? {
          businessRule: "Over Budget",
          escalationReason: invoice.analysis.description,
          issues: invoice.analysis.items.map(item => item.description)
        } : {
          businessRule: "Needs Review",
          escalationReason: "Invoice needs initial review",
          issues: []
        },
        escalationEmail: {
          body: `Dear Vendor Team,\n\nPlease review the attached invoice ${invoice.invoiceEid}. The total cost appears to be higher than our standard rates for the services provided.\n\nCould you please provide clarification or adjust the invoice accordingly?\n\nThank you,`,
          signature: "Procurement Team\nExample Company"
        }
      };
      setInvoiceDetails(details);
      setEditableBasicInfo(details);
      setEditablePartsLabor(details.partsAndLabor);
    }
  }, [invoice]);

  // Find the index for 'Escalated' status
  const escalatedStatusIndex = statuses.findIndex(status => status.text === 'Escalated');

  const handleBadgeClick = () => {
    setCurrentStatusIndex((prevIndex) => (prevIndex + 1) % statuses.length);
  };

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
    // Add logic here to update the email body based on the selected template if needed
    console.log(`Template selected: ${templateName}`);
  };

  const handleCopyToClipboard = () => {
    if (!invoiceDetails) return;
    
    // Combine AI analysis and human notes
    const aiAnalysis = invoiceDetails.analysis?.description || 'No AI analysis available';
    const aiIssues = invoiceDetails.analysis?.items.map(item => `- ${item.description}`).join('\n') || '';
    const humanReview = humanNotes ? `\n\nHuman Review Notes:\n${humanNotes}` : '';
    const reviewerInfo = reviewer ? `\nReviewed by: ${reviewer}` : '';
    
    const emailText = `Dear Vendor Team,\n\nregarde Invoice ${invoiceDetails.id}:\n\nAI Analysis:\n${aiAnalysis}\n\nIdentified Issues:\n${aiIssues}${humanReview}${reviewerInfo}\n\n${invoiceDetails.escalationEmail.signature}`;
    
    navigator.clipboard.writeText(emailText).then(() => {
      setCurrentStatusIndex(escalatedStatusIndex); // Change status to 'Escalated'
      toast('Email copied to clipboard and invoice state changed to Escalated!'); // Trigger toast on success
    }).catch(err => {
      console.error('Failed to copy email: ', err);
      toast.error('Failed to copy email.'); // Optional: Show error toast
    });
  };

  // Handlers for basic info editing
  const handleBasicInfoEditToggle = () => {
    if (isBasicInfoEditing && editableBasicInfo) {
      // Save changes (update main state)
      setInvoiceDetails(prev => prev ? { ...prev, ...editableBasicInfo } : editableBasicInfo);
      // Potentially make API call here to save changes
      toast('Basic info updated.');
    }
    setIsBasicInfoEditing(!isBasicInfoEditing);
  };

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableBasicInfo(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  // Handlers for parts & labor editing
  const handlePartsLaborEditToggle = () => {
    if (isPartsLaborEditing) {
      // Save changes (update main state)
      // Recalculate totalCost for each item if quantity or unitCost changed
      const updatedPartsLabor = editablePartsLabor.map(item => ({
        ...item,
        totalCost: item.quantity * item.unitCost
      }));
      setInvoiceDetails(prev => prev ? { ...prev, partsAndLabor: updatedPartsLabor } : null);
      setEditablePartsLabor(updatedPartsLabor); // Update editable state with calculated totals
      // Potentially make API call here to save changes
      toast('Parts and Labor updated.');
    }
    setIsPartsLaborEditing(!isPartsLaborEditing);
  };

  const handlePartsLaborChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedPartsLabor = [...editablePartsLabor];
    const parsedValue = (field === 'quantity' || field === 'unitCost') ? parseFloat(value as string) || 0 : value;
    updatedPartsLabor[index] = { ...updatedPartsLabor[index], [field]: parsedValue };

    if (field === 'quantity' || field === 'unitCost') {
      updatedPartsLabor[index].totalCost = updatedPartsLabor[index].quantity * updatedPartsLabor[index].unitCost;
    }

    setEditablePartsLabor(updatedPartsLabor);
  };

  // Calculate totals based on the *current* invoiceDetails state
  const partsTotal = invoiceDetails?.partsAndLabor
    .filter((item: InvoiceItem) => item.type === 'Part' || item.type === 'Labor')
    .reduce((sum: number, item: InvoiceItem) => sum + item.totalCost, 0) ?? 0;
  const taxTotal = invoiceDetails?.partsAndLabor
    .filter((item: InvoiceItem) => item.type === 'Tax')
    .reduce((sum: number, item: InvoiceItem) => sum + item.totalCost, 0) ?? 0;
  const grandTotal = partsTotal + taxTotal;

  if (!invoice) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Basic Info Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {Array(7).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </CardContent>
        </Card>

        {/* Parts and Labor Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>

        {/* Escalation Email Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/invoices">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4 cursor-pointer" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold md:text-2xl">Invoice {invoiceDetails?.id} Details</h1>
        </div>
        <Badge
          variant={statuses[currentStatusIndex].variant as "secondary" | "destructive" | "default" | "outline"}
          onClick={handleBadgeClick}
          className="cursor-pointer select-none"
        >
          {statuses[currentStatusIndex].text}
        </Badge>
      </div>

      {/* Basic Info Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Basic Info</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={handleBasicInfoEditToggle} className="cursor-pointer">
            {isBasicInfoEditing ? <Check className="h-4 w-4 text-green-500" /> : <Edit className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {isBasicInfoEditing && editableBasicInfo ? (
            <>
              <div>
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Input id="vendorName" name="vendorName" value={editableBasicInfo.vendorName} onChange={handleBasicInfoChange} />
              </div>
              <div>
                <Label htmlFor="truckId">Truck ID</Label>
                <Input id="truckId" name="truckId" value={editableBasicInfo.truckId} onChange={handleBasicInfoChange} />
              </div>
              <div>
                <Label htmlFor="assignedDriver">Assigned Driver</Label>
                <Input id="assignedDriver" name="assignedDriver" value={editableBasicInfo.assignedDriver} onChange={handleBasicInfoChange} />
              </div>
              <div>
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input id="issueDate" name="issueDate" type="date" value={editableBasicInfo.issueDate} onChange={handleBasicInfoChange} />
              </div>
              <div>
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Input id="fuelType" name="fuelType" value={editableBasicInfo.fuelType} onChange={handleBasicInfoChange} />
              </div>
              <div>
                <Label htmlFor="mileage">Mileage</Label>
                <Input id="mileage" name="mileage" value={editableBasicInfo.mileage} onChange={handleBasicInfoChange} />
              </div>
              <div>
                <Label htmlFor="totalPrice">Total Price</Label>
                <Input id="totalPrice" name="totalPrice" value={editableBasicInfo.totalPrice} onChange={handleBasicInfoChange} />
              </div>
            </>
          ) : (
            <>
              <div><span className="font-medium">Vendor Name:</span> {invoiceDetails?.vendorName}</div>
              <div><span className="font-medium">Truck ID:</span> {invoiceDetails?.truckId}</div>
              <div><span className="font-medium">Assigned Driver:</span> {invoiceDetails?.assignedDriver}</div>
              <div><span className="font-medium">Issue Date:</span> {invoiceDetails?.issueDate}</div>
              <div><span className="font-medium">Fuel Type:</span> {invoiceDetails?.fuelType}</div>
              <div><span className="font-medium">Mileage:</span> {invoiceDetails?.mileage}</div>
              <div><span className="font-medium">Total Price:</span> {invoiceDetails?.totalPrice}</div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Parts and Labor Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Parts and Labor</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={handlePartsLaborEditToggle} className="cursor-pointer">
             {isPartsLaborEditing ? <Check className="h-4 w-4 text-green-500" /> : <Edit className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit cost</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isPartsLaborEditing ? editablePartsLabor : invoiceDetails?.partsAndLabor)?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {isPartsLaborEditing ? (
                      <Input
                        value={item.description}
                        onChange={(e) => handlePartsLaborChange(index, 'description', e.target.value)}
                        className="min-w-[150px]"
                      />
                    ) : (
                      item.description
                    )}
                  </TableCell>
                  <TableCell>
                    {isPartsLaborEditing ? (
                      <Input
                        value={item.type}
                        onChange={(e) => handlePartsLaborChange(index, 'type', e.target.value)}
                        className="min-w-[80px]"
                      />
                    ) : (
                      item.type
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isPartsLaborEditing ? (
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handlePartsLaborChange(index, 'quantity', e.target.value)}
                        className="w-20 text-right"
                      />
                    ) : (
                      item.quantity
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isPartsLaborEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitCost}
                        onChange={(e) => handlePartsLaborChange(index, 'unitCost', e.target.value)}
                        className="w-24 text-right"
                      />
                    ) : (
                      `$${item.unitCost.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {`$${item.totalCost.toFixed(2)}`}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium">Total:</TableCell>
                <TableCell className="text-right font-medium">${grandTotal.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Analysis Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle>AI Analysis</CardTitle>
          </div>
          <Badge variant="secondary">{invoiceDetails?.analysis.businessRule}</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{invoiceDetails?.analysis.escalationReason}</p>
          {invoiceDetails?.analysis.issues.map((issue, index) => (
            <div key={index} className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{issue}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Human Notes Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Human Notes</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsHumanNotesEditing(!isHumanNotesEditing)} className="cursor-pointer">
            {isHumanNotesEditing ? <Check className="h-4 w-4 text-green-500" /> : <Edit className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="humanNotes">Review Notes</Label>
            <Textarea
              id="humanNotes"
              value={humanNotes}
              onChange={(e) => setHumanNotes(e.target.value)}
              placeholder="Add your review notes here..."
              className="min-h-[100px]"
              disabled={!isHumanNotesEditing}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Not yet reviewed'}</p>
            <p>Reviewer: {reviewer || 'N/A'}</p>
          </div>
          <CardDescription>
            These notes will be combined with the AI analysis to generate a comprehensive escalation email.
          </CardDescription>
        </CardContent>
      </Card>

      {/* Escalation Email Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => setIsEscalationEmailExpanded(!isEscalationEmailExpanded)}>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Escalation Email</CardTitle>
          </div>
          <Button variant="ghost" size="icon">
            {isEscalationEmailExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {isEscalationEmailExpanded && invoiceDetails?.escalationEmail && (
          <CardContent className="flex flex-col gap-4">
            <Textarea
              readOnly
              value={`${invoiceDetails.escalationEmail.body}\n\n${invoiceDetails.escalationEmail.signature}`}
              className="min-h-[150px] bg-gray-50 dark:bg-gray-800/50"
            />
            <div className="flex gap-2">
              <Button variant="default" size="sm" onClick={handleCopyToClipboard} className="cursor-pointer">
                <Clipboard className="mr-2 h-4 w-4" /> Copy to clipboard
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    {selectedTemplate}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleTemplateSelect('Template 1')}>Template 1</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTemplateSelect('Template 2')}>Template 2</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTemplateSelect('Template 3')}>Template 3</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTemplateSelect('Template 4')}>Template 4</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}