import { useState } from "react";
import { MessageSquare, Edit, Check, Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface HumanNotesUpdate {
  notes: string;
  lastUpdated: number;
  reviewer: string;
}

interface HumanNotesCardProps {
  notes?: string;
  onUpdate: (updatedData: HumanNotesUpdate) => void;
  isUpdated: boolean;
}

export default function HumanNotesCard({
  notes: initialNotes = "",
  onUpdate,
  isUpdated,
}: HumanNotesCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        const now = Date.now();
        const currentUser = "John Doe";

        onUpdate({
          notes,
          lastUpdated: now,
          reviewer: currentUser,
        });

        setIsLoading(false);
        setIsEditing(false);
        toast.success("Notes updated successfully");
      }, 1000);
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  return (
    <Card
      className={`border shadow-sm ${isUpdated ? "border-green-500 bg-green-50 dark:bg-green-900/10" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Your Notes
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEditToggle}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditing ? (
              <Check className="h-4 w-4" />
            ) : (
              <Edit className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Label htmlFor="notes">Review Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add your review notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              These notes will be combined with the AI analysis to generate a
              comprehensive escalation email.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes ? (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                {notes}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-500 italic">
                Add your review notes here...
              </div>
            )}
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                These notes will be combined with the AI analysis to generate a
                comprehensive escalation email.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
