"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfileValidation } from "@/lib/validations/profile";
import { saveProfile } from "@/lib/actions/user.actions";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";

interface ProfileFormProps {
  fullName: string;
  email: string;
  link: string;
  imageUrl?: string;
  businessLogoUrl?: string;
}

export const ProfileForm = ({
  fullName,
  email,
  link,
  imageUrl,
  businessLogoUrl,
}: ProfileFormProps) => {
  const form = useForm({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      fullName: fullName || "",
      email: email || "",
      link: link || "",
      imageUrl: imageUrl || "",
      businessLogoUrl: businessLogoUrl || "",
    },
  });

  const onSubmit = async (values: ProfileFormProps) => {
    await saveProfile(values);
    form.reset(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-xl"
      >
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <div className="flex flex-row gap-4">
                  <Image
                    src={field.value || "/assets/profile_placeholder.svg"}
                    alt="profile image"
                    className={`${
                      field.value ? "rounded-full" : ""
                    } object-cover h-24 w-24`}
                    width={96}
                    height={96}
                    priority
                  />
                  <UploadButton
                    endpoint="profileImage"
                    onClientUploadComplete={(res) => {
                      field.onChange(res[0].url);
                    }}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessLogoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Logo</FormLabel>
              <FormControl>
                <div className="flex flex-row gap-4">
                  <Image
                    src={field.value || "/assets/profile_placeholder.svg"}
                    alt="business logo"
                    className={` object-contain h-24 w-24`}
                    width={96}
                    height={96}
                    priority
                  />
                  <UploadButton
                    endpoint="businessLogo"
                    onClientUploadComplete={(res) => {
                      field.onChange(res[0].url);
                    }}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="Link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.isDirty && <Button type="submit">Save Changes</Button>}
      </form>
    </Form>
  );
};
