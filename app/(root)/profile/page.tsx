import { ProfileForm } from "@/components/ProfileForm";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

const Page = async () => {
  const user = await currentUser();
  const { profile } = await fetchUser(user!.id);

  return (
    <section>
      <ProfileForm
        fullName={profile.fullName}
        email={profile.email}
        link={profile.link}
      ></ProfileForm>
    </section>
  );
};

export default Page;
