"use client"; // Error components must be Client Components

import Image from "next/image";

export default function Error() {
  return (
    <div className="flex flex-col justify-center place-content-center items-center">
      <h2 className="text-heading2-bold ">Oops! Something Went Wrong</h2>
      <p className="pt-4 pb-4">
        Unfortunately, we&apos;ve encountered a server error. We&apos;re working
        to resolve the issue as quickly as possible.
      </p>
      <p className="pb-4">
        While we fix this, you might want to head back to{" "}
        <a
          className="hover:underline underline-offset-2 text-base-regular-light text-primary-500"
          href="https://anandamasaj.ro/#contact-us"
        >
          anandamasaj.ro
        </a>{" "}
        and contact us for an appointment using one of our phone numbers
        (Whatsapp is best).
      </p>
      <Image src="/assets/500.png" alt="logo" width={500} height={500}></Image>
    </div>
  );
}
