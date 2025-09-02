import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Edit, Trash2 } from "lucide-react";

interface DraftScholarshipsProps {
  onEditDraft: (draft: any) => void;
}

export function DraftScholarships({ onEditDraft }: DraftScholarshipsProps) {
  const draftApplications = [
    {
      id: "DRAFT001",
      scholarshipType: "General Scholarship",
      requestedAmount: 5000,
      lastModified: "2024-01-15",
      completionStatus: 75
    },
    {
      id: "DRAFT002", 
      scholarshipType: "Women Entrepreneurs",
      requestedAmount: 3000,
      lastModified: "2024-01-10",
      completionStatus: 45
    },
    {
      id: "DRAFT003",
      scholarshipType: "Technology Innovation",
      requestedAmount: 7500,
      lastModified: "2024-01-08",
      completionStatus: 90
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Draft Scholarship Applications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {draftApplications.map((draft) => (
            <div key={draft.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{draft.scholarshipType}</h3>
                  <Badge variant="secondary">Draft</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  ID: {draft.id}
                </div>
              </div>
              
              <div className="grid gap-2 md:grid-cols-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">${draft.requestedAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Last modified: {draft.lastModified}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Completion:</span>
                  <span className="font-medium">{draft.completionStatus}%</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => onEditDraft(draft)}
                >
                  <Edit className="w-4 h-4" />
                  Continue Editing
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="w-4 h-4" />
                  Delete Draft
                </Button>
              </div>
            </div>
          ))}

          {draftApplications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No draft applications found</p>
              <p className="text-sm">Start a new scholarship application to see drafts here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}