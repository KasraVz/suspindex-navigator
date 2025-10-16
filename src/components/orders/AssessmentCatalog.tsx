import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileQuestion, CheckCircle2, Plus } from "lucide-react";

export interface AssessmentType {
  code: string;
  title: string;
  description: string;
  duration: string;
  questions: string;
  requiredFields: string[];
  price: number;
  colorClass: string;
}

export const assessmentTypes: Record<string, AssessmentType> = {
  FPA: {
    code: "FPA",
    title: "Founder Public Awareness",
    description: "Evaluates your public visibility and market recognition as a founder.",
    duration: "45-60 minutes",
    questions: "80-120 questions",
    requiredFields: ["Stage", "Industry"],
    price: 50,
    colorClass: "bg-accent"
  },
  GEB: {
    code: "GEB",
    title: "General Entrepreneur Behavior",
    description: "Assesses your entrepreneurial mindset, decision-making, and leadership capabilities.",
    duration: "30-45 minutes",
    questions: "60-80 questions",
    requiredFields: ["Stage"],
    price: 60,
    colorClass: "bg-primary"
  },
  EEA: {
    code: "EEA",
    title: "Ecosystem Environment Assessment",
    description: "Analyzes your startup ecosystem engagement and environmental factors.",
    duration: "50-70 minutes",
    questions: "90-130 questions",
    requiredFields: ["Stage", "Industry", "Ecosystem"],
    price: 75,
    colorClass: "bg-tertiary"
  },
  BUNDLE: {
    code: "BUNDLE",
    title: "Complete Assessment Bundle",
    description: "Get all three assessments (FPA + GEB + EEA) together and save $20!",
    duration: "2.5-3.5 hours total",
    questions: "230-330 questions",
    requiredFields: ["Stage", "Industry", "Ecosystem"],
    price: 165,
    colorClass: "bg-gradient-to-br from-accent via-primary to-tertiary"
  }
};

interface AssessmentCatalogProps {
  selectedAssessments: string[];
  onAddAssessment: (assessment: string) => void;
  lockedAssessments?: string[];
}

export function AssessmentCatalog({ 
  selectedAssessments, 
  onAddAssessment,
  lockedAssessments = []
}: AssessmentCatalogProps) {
  const isSelected = (code: string) => selectedAssessments.includes(code);
  const isLocked = (code: string) => lockedAssessments.includes(code);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Assessment Catalog</h2>
        <p className="text-sm text-muted-foreground">
          Select the assessments you'd like to take
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(assessmentTypes).map(([key, type]) => {
          const selected = isSelected(key);
          const locked = isLocked(key);
          
          // Special rendering for BUNDLE tile
          if (key === "BUNDLE") {
            return (
              <Card
                key={key}
                onClick={() => !selected && onAddAssessment(key)}
                className={`relative overflow-hidden transition-all duration-200 ${
                  selected ? 'ring-2 ring-success shadow-lg' : 'hover:scale-105 hover:shadow-lg cursor-pointer'
                }`}
              >
                <div className="absolute top-0 right-0 bg-success text-white px-3 py-1 text-xs font-bold rounded-bl-lg pointer-events-none">
                  BEST VALUE
                </div>
                <CardContent className="p-5 space-y-3 bg-gradient-to-br from-accent/10 via-primary/10 to-tertiary/10">
                  <div className="flex items-start justify-between">
                    <Badge className="bg-success text-white font-bold px-3 py-1">
                      SAVE $20
                    </Badge>
                    {selected && (
                      <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-xs font-medium">Added</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg mb-1">{type.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{type.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {type.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileQuestion className="w-4 h-4" />
                      {type.questions}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <Badge className="bg-accent text-white text-xs">FPA</Badge>
                    <Badge className="bg-primary text-white text-xs">GEB</Badge>
                    <Badge className="bg-tertiary text-white text-xs">EEA</Badge>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg line-through text-muted-foreground">$185</span>
                      <span className="text-2xl font-bold text-success">${type.price}</span>
                    </div>
                    
                    <Button
                      size="sm"
                      variant={selected ? "ghost" : "default"}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!selected) onAddAssessment(key);
                      }}
                      disabled={selected}
                      className={!selected ? "bg-success hover:bg-success/90" : ""}
                    >
                      {selected ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Bundle
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          // Regular individual assessment tiles
          return (
            <Card
              key={key}
              onClick={() => !selected && !locked && onAddAssessment(key)}
              className={`transition-all duration-200 ${
                locked ? 'opacity-60' : 'hover:scale-105 hover:shadow-lg cursor-pointer'
              } ${
                selected ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <Badge className={`${type.colorClass} text-white`}>
                    {type.code}
                  </Badge>
                  {selected && (
                    <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="text-xs font-medium">Added</span>
                    </div>
                  )}
                  {locked && (
                    <Badge variant="secondary" className="text-xs">
                      Partner Request
                    </Badge>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-base mb-1">{type.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{type.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {type.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileQuestion className="w-4 h-4" />
                    {type.questions}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {type.requiredFields.map(field => (
                    <Badge key={field} variant="secondary" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>

                <div className="pt-3 border-t flex items-center justify-between">
                  <span className="text-xl font-bold">${type.price}</span>
                  
                  {!locked && (
                    <Button
                      size="sm"
                      variant={selected ? "ghost" : "default"}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!selected) onAddAssessment(key);
                      }}
                      disabled={selected}
                    >
                      {selected ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
