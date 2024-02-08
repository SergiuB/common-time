import { ClientSelector } from "@/app/(client)/components/ClientSelector";
import { UserDataProvider } from "@/app/(client)/components/UserDataProvider";
import { getUserDataFromLinkOrId } from "@/lib/actions/user.actions";
import Image from "next/image";

interface Props {
  params: {
    slug: string;
  };
}

const BookingPage = async ({ params: { slug } }: Props) => {
  const { userData, eventTypes, busyIntervals, schedules } =
    await getUserDataFromLinkOrId(slug);
  if (!userData) {
    // TOFO: 404 page
    return <div>Not found</div>;
  }

  const selectedEventTypeId = eventTypes[0].id;

  return (
    <UserDataProvider userData={userData}>
      <div className="mb-4">
        <div className="flex justify-between mb-4">
          {userData.imageUrl && (
            <Image
              src={userData.imageUrl}
              alt="profile image"
              className="rounded-full"
              width={96}
              height={96}
              priority
            />
          )}
          {userData.businessLogoUrl && (
            <Image
              src={userData.businessLogoUrl}
              alt="business logo"
              width={108}
              height={96}
              style={{ objectFit: "contain" }}
              priority
            />
          )}
        </div>
        <p className="text-small-regular">
          Hi! I am {userData.fullName.split(" ")[0]}, welcome to my scheduling
          page!
          <br />
          Please use this form to add an event in my calendar.
        </p>
      </div>
      <ClientSelector
        busyIntervals={busyIntervals}
        eventTypes={eventTypes}
        defaultEventTypeId={selectedEventTypeId}
        schedules={schedules}
      />
    </UserDataProvider>
  );
};

export default BookingPage;
