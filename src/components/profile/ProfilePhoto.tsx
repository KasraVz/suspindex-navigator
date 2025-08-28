import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from "lucide-react";

export function ProfilePhoto() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Avatar className="w-32 h-32">
            <AvatarImage src="/placeholder.svg" alt="Profile photo" />
            <AvatarFallback className="text-2xl">JD</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="space-y-2">
          <Button variant="outline" className="w-full">
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
          </Button>
          <Button variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>• Use a clear, professional photo</p>
          <p>• File size should be under 5MB</p>
          <p>• Supported formats: JPG, PNG</p>
        </div>
      </CardContent>
    </Card>
  );
}