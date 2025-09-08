import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProfileUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateProfile: () => void;
  onKeepCurrent: () => void;
  changes: string[];
}

export function ProfileUpdateDialog({
  open,
  onOpenChange,
  onUpdateProfile,
  onKeepCurrent,
  changes
}: ProfileUpdateDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Business Profile?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>You've selected different values for:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
            <p>Would you like to update your Business Profile with these new values?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onKeepCurrent}>
            Keep Current Profile
          </AlertDialogCancel>
          <AlertDialogAction onClick={onUpdateProfile}>
            Update Profile
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}