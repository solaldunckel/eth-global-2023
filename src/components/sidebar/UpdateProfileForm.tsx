import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const schema = z.object({
  username: z.string().optional(),
  image: z.string().url().optional(),
});

type FormValues = z.infer<typeof schema>;

const UpdateProfileForm: FC = () => {
  const { update } = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const closeDialog = () => {
    document.getElementById("closeDialog")?.click();
  };

  function onSubmit(values: FormValues) {
    // todo
    console.log("values: ", values);

    update({
      ...values,
    }).then(() => {
      closeDialog();
    });
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update profile</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="@vitalik" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Url</FormLabel>
                <FormControl>
                  <Input placeholder="Image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpdateProfileForm;
