import { getUserProfileData } from "@/actions/user";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const profile = await getUserProfileData();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and view your activity
        </p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
