import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, CheckCircle } from "lucide-react";
import { useState } from "react";

// Mock data for referring partners and their test requests
const referringPartners = [
  { id: "techcorp", name: "TechCorp Academy" },
  { id: "digital", name: "Digital Learning Hub" },
  { id: "professional", name: "Professional Development Center" },
  { id: "skills", name: "Skills Training Institute" }
];

const partnerTestRequests = {
  techcorp: [
    { id: "1", testName: "FPA Certification", requestDate: "2024-12-15", isCompleted: true, completedDate: "2024-12-20" },
    { id: "2", testName: "GEB Assessment", requestDate: "2024-12-18", isCompleted: true, completedDate: "2024-12-22" },
    { id: "3", testName: "EEA Evaluation", requestDate: "2024-12-20", isCompleted: false },
    { id: "4", testName: "Risk Management", requestDate: "2024-12-22", isCompleted: false },
    { id: "5", testName: "Compliance Test", requestDate: "2024-12-25", isCompleted: false }
  ],
  digital: [
    { id: "6", testName: "Digital Skills Assessment", requestDate: "2024-12-10", isCompleted: true, completedDate: "2024-12-15" },
    { id: "7", testName: "Tech Proficiency", requestDate: "2024-12-12", isCompleted: false },
    { id: "8", testName: "Cybersecurity Basics", requestDate: "2024-12-14", isCompleted: false }
  ],
  professional: [
    { id: "9", testName: "Leadership Assessment", requestDate: "2024-12-08", isCompleted: true, completedDate: "2024-12-12" },
    { id: "10", testName: "Project Management", requestDate: "2024-12-10", isCompleted: true, completedDate: "2024-12-14" },
    { id: "11", testName: "Communication Skills", requestDate: "2024-12-12", isCompleted: true, completedDate: "2024-12-16" },
    { id: "12", testName: "Strategic Planning", requestDate: "2024-12-15", isCompleted: false }
  ],
  skills: [
    { id: "13", testName: "Technical Skills", requestDate: "2024-12-05", isCompleted: true, completedDate: "2024-12-10" },
    { id: "14", testName: "Soft Skills Evaluation", requestDate: "2024-12-07", isCompleted: false },
    { id: "15", testName: "Industry Knowledge", requestDate: "2024-12-09", isCompleted: false },
    { id: "16", testName: "Problem Solving", requestDate: "2024-12-11", isCompleted: false },
    { id: "17", testName: "Analytical Thinking", requestDate: "2024-12-13", isCompleted: false },
    { id: "18", testName: "Creative Solutions", requestDate: "2024-12-15", isCompleted: false }
  ]
};

export function ReferringPartnerCard() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("techcorp");
  
  const selectedPartner = referringPartners.find(p => p.id === selectedPartnerId);
  const tests = partnerTestRequests[selectedPartnerId as keyof typeof partnerTestRequests] || [];
  const completedTests = tests.filter(test => test.isCompleted);
  const completionPercentage = tests.length > 0 ? Math.round((completedTests.length / tests.length) * 100) : 0;

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
        <CardTitle className="text-sm font-medium">Partner Progress</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        {/* Partner Selection */}
        <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select referring partner" />
          </SelectTrigger>
          <SelectContent>
            {referringPartners.map((partner) => (
              <SelectItem key={partner.id} value={partner.id}>
                {partner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-brand-green" />
              <span className="text-xs text-muted-foreground">
                {completedTests.length} of {tests.length}
              </span>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="text-xs text-center text-muted-foreground">
            {completionPercentage}% Complete
          </div>
        </div>

        {/* Test Requests List */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          <div className="text-xs font-medium text-muted-foreground mb-2">Requested Tests</div>
          {tests.map((test) => (
            <div key={test.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors">
              <Checkbox 
                checked={test.isCompleted}
                disabled
                className="mt-0.5 h-3 w-3"
              />
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium ${test.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                  {test.testName}
                </div>
                <div className="text-xs text-muted-foreground">
                  Requested: {new Date(test.requestDate).toLocaleDateString()}
                  {test.isCompleted && test.completedDate && (
                    <span className="ml-2 text-brand-green">
                      ✓ Shared: {new Date(test.completedDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}