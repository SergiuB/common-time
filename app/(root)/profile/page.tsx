import { ProfileForm } from "@/app/(root)/profile/components/ProfileForm";
import { fetchUserByAuthId } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

const Page = async () => {
  const user = await currentUser();
  const { profile } = await fetchUserByAuthId(user!.id);

  return (
    <section>
      <ProfileForm
        fullName={profile.fullName}
        email={profile.email}
        link={profile.link}
        imageUrl={profile.imageUrl || user?.imageUrl}
        businessLogoUrl={profile.businessLogoUrl}
      ></ProfileForm>
    </section>
  );
};

export default Page;
