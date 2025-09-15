import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilePhoto } from "@/components/profile/ProfilePhoto";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { BusinessProfile } from "@/components/profile/BusinessProfile";
import { LeaderboardProfile } from "@/components/profile/LeaderboardProfile";
import { AccountSettings } from "@/components/profile/AccountSettings";
import { ProfileEditRequests } from "@/components/profile/ProfileEditRequests";
import { AffiliationCodeManager } from "@/components/profile/AffiliationCodeManager";

const Profile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Management</h1>
        <p className="text-muted-foreground">Manage your profile information and account settings</p>
      </div>

      <Tabs defaultValue="view" className="space-y-6">
        <TabsList>
          <TabsTrigger value="view">View Profile</TabsTrigger>
          <TabsTrigger value="affiliation">Affiliation Codes</TabsTrigger>
          <TabsTrigger value="requests">Edit Requests</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <ProfilePhoto />
            <div className="lg:col-span-2">
              <ProfileInfo />
            </div>
          </div>
          
          <BusinessProfile />
          <LeaderboardProfile />
        </TabsContent>

        <TabsContent value="affiliation" className="space-y-6">
          <AffiliationCodeManager />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <ProfileEditRequests />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;