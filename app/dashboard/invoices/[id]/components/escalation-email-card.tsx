import { useState, useEffect } from "react";
import {
  MailWarning,
  ChevronUp,
  ChevronDown,
  Copy,
  RefreshCcw,
  Loader2,
  FileWarning,
  ClipboardEdit,
  Clock,
  Pickaxe,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

interface EscalationEmailCardProps {
  invoiceId: string;
  escalationEmail?: {
    body: string;
    signature: string;
  };
  onEscalate: () => void;
  onUpdate: (updatedData: {
    escalationEmail: { body: string; signature: string };
  }) => void;
  isUpdated: boolean;
}

// Template interface for future backend integration
interface EmailTemplate {
  id: string;
  name: string;
  content: string;
}

export default function EscalationEmailCard({
  invoiceId,
  escalationEmail: initialEmail,
  onEscalate,
  onUpdate,
  isUpdated,
}: EscalationEmailCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [escalationEmail, setEscalationEmail] = useState(
    initialEmail || {
      body: "",
      signature:
        "Best regards,\nThe SmartFreight Team\nsupport@smartfreight.com\n1-800-FREIGHT",
    },
  );

  // Mock templates data - would be fetched from backend in real implementation
  const emailTemplates: EmailTemplate[] = [
    {
      id: "pricing",
      name: "Pricing Discrepancy",
      content: `Subject: Invoice Pricing Discrepancy - Invoice #${invoiceId}\n\nDear Vendor,\n\nWe are writing to address a pricing discrepancy on your recent invoice. Our records indicate that the agreed-upon pricing for the services rendered differs from what was billed. Specifically, the preventive maintenance costs exceed our contracted rates.\n\nPlease review and provide clarification on this matter at your earliest convenience.`,
    },
    {
      id: "frequency",
      name: "Maintenance Frequency",
      content: `Subject: Maintenance Frequency Concern - Invoice #${invoiceId}\n\nDear Vendor,\n\nWe are writing regarding your recent invoice for preventive maintenance services. According to our records, similar maintenance was performed just 45 days ago, whereas our policy requires a 90-day interval between such services.\n\nPlease provide clarification on the necessity of this maintenance interval.`,
    },
    {
      id: "unauthorized",
      name: "Unauthorized Services",
      content: `Subject: Unauthorized Services on Invoice #${invoiceId}\n\nDear Vendor,\n\nWe have received your invoice that includes services which were not pre-authorized according to our agreement. Specifically, the additional services beyond basic maintenance were not approved in advance as required by our service contract.\n\nPlease provide documentation of the pre-approval for these services or issue a revised invoice.`,
    },
  ];

  // Fetch email data if needed
  const emailData = useQuery(
    api.invoices.getEscalationEmail,
    invoiceId && !initialEmail ? { invoiceId } : "skip",
  );

  // If we have data from API and no initial email, use it
  if (!initialEmail && emailData && !escalationEmail.body) {
    setEscalationEmail(emailData);
  }

  // Simulate fetching templates from backend
  useEffect(() => {
    // This would be replaced with a real API call in the future
    // For now, we're just using the mock data defined above
    // Example of future implementation:
    // const fetchTemplates = async () => {
    //   const templates = await api.emailTemplates.list();
    //   setEmailTemplates(templates);
    // };
    // fetchTemplates();
  }, []);

  const handleCopyToClipboard = async () => {
    try {
      const fullEmail = `${escalationEmail.body}\n\n${escalationEmail.signature}`;
      await navigator.clipboard.writeText(fullEmail);
      toast.success("Email copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find((t) => t.id === templateId);

    if (!template) {
      toast.error("Template not found");
      return;
    }

    const updatedEmail = {
      ...escalationEmail,
      body: template.content,
    };

    setEscalationEmail(updatedEmail);
    setSelectedTemplate(templateId);

    // Update parent component with correct type
    onUpdate({ escalationEmail: updatedEmail });

    toast.success(`"${template.name}" template applied`);
  };

  const handleEscalate = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onEscalate();
      setIsLoading(false);
      toast.success("Escalation email sent successfully");
    }, 1500);
  };

  const handleEmailChange = (value: string) => {
    setEscalationEmail((prev) => ({
      ...prev,
      body: value,
    }));
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRefreshEmail = () => {
    setIsLoading(true);

    // Simulate API call to generate email based on AI analysis and human notes
    setTimeout(() => {
      const newEmail = {
        body: `Subject: Invoice #${invoiceId} - Maintenance Frequency Concern\n\nDear Vendor,\n\nWe are reviewing your recent invoice #${invoiceId} and have identified a potential issue with the maintenance frequency. According to our records, a similar preventive maintenance service was performed just 45 days ago, which is sooner than our standard 90-day interval policy.\n\nOur AI system has flagged this as a violation of Rule T-103 regarding preventive maintenance scheduling. Could you please provide clarification on why this maintenance was necessary outside of our regular schedule?\n\nWe value our partnership and look forward to resolving this matter promptly.`,
        signature: escalationEmail.signature,
      };

      setEscalationEmail(newEmail);
      setSelectedTemplate(null);
      onUpdate({ escalationEmail: newEmail });
      setIsLoading(false);
      toast.success("Email refreshed based on latest analysis and notes");
    }, 1500);
  };

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case "pricing":
        return <FileWarning className="h-4 w-4 mr-2" />;
      case "frequency":
        return <Clock className="h-4 w-4 mr-2" />;
      case "unauthorized":
        return <ClipboardEdit className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const getSelectedTemplateName = () => {
    if (!selectedTemplate) return "Select Template";
    const template = emailTemplates.find((t) => t.id === selectedTemplate);
    return template ? template.name : "Select Template";
  };

  if (isLoading && !escalationEmail.body) {
    return (
      <Card className="border shadow-sm col-span-2">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium flex items-center">
              <MailWarning className="h-5 w-5 mr-2" />
              Escalation Email
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleExpanded}>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="flex justify-end gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <Card
      className={`border shadow-sm col-span-2 ${isUpdated ? "border-green-500 bg-green-50 dark:bg-green-900/10" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <MailWarning className="h-5 w-5 mr-2" />
            Escalation Email
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefreshEmail}
              disabled={isLoading}
            >
              <RefreshCcw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleExpanded}>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Email Content</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {getSelectedTemplateName()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {emailTemplates.map((template) => (
                    <DropdownMenuItem
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      {getTemplateIcon(template.id)}
                      {template.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Textarea
              value={escalationEmail.body}
              onChange={(e) => handleEmailChange(e.target.value)}
              rows={8}
              className="font-mono text-sm resize-none"
              placeholder="Email content will be generated based on AI analysis and your notes..."
            />

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm font-mono">
              {escalationEmail.signature}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-2 pb-4">
            <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>

            <Button
              disabled={isLoading || !escalationEmail.body}
              onClick={handleEscalate}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Pickaxe className="h-4 w-4 mr-2" />
                  Generate Escalation
                </>
              )}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
