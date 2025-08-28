import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageSquare, Plus } from "lucide-react";

const existingTickets = [
  {
    id: "TKT001",
    subject: "Unable to access test results",
    status: "Open",
    priority: "High",
    lastUpdate: "2024-01-15",
  },
  {
    id: "TKT002",
    subject: "Payment issue with certification",
    status: "In Progress",
    priority: "Medium",
    lastUpdate: "2024-01-14",
  },
  {
    id: "TKT003",
    subject: "Profile photo upload error",
    status: "Resolved",
    priority: "Low",
    lastUpdate: "2024-01-10",
  },
];

export function TicketingSystem() {
  return (
    <Tabs defaultValue="new" className="space-y-6">
      <TabsList>
        <TabsTrigger value="new" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Ticket
        </TabsTrigger>
        <TabsTrigger value="existing" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          My Tickets
        </TabsTrigger>
      </TabsList>

      <TabsContent value="new">
        <Card>
          <CardHeader>
            <CardTitle>Submit New Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description of your issue" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="account">Account Management</SelectItem>
                    <SelectItem value="exams">Exams & Certifications</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Please provide a detailed description of your issue..."
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="existing">
        <Card>
          <CardHeader>
            <CardTitle>My Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {existingTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          ticket.status === "Open" ? "destructive" : 
                          ticket.status === "In Progress" ? "default" : 
                          "secondary"
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          ticket.priority === "High" || ticket.priority === "Critical" ? "destructive" :
                          ticket.priority === "Medium" ? "default" : 
                          "secondary"
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.lastUpdate}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}