import type { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  title: z.string().nonempty({ message: "A title is required" }),
  description: z.string(),
  category: z.string(),
  image_url: z.string().optional(),
  conditionCategory: z.enum(["NFT", "OG"]),
  conditionAddress: z.string().optional(),
  conditionDate: z.string().optional(),
  blockchain: z.enum(["ethereum", "polygon"]).optional(),
});

type FormValues = z.infer<typeof schema>;

const CreateChannel: FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      conditionCategory: "NFT",
      conditionAddress: "",
      conditionDate: "",
      blockchain: undefined,
    },
  });

  const gatingCondition = form.watch("conditionCategory");

  const queryClient = useQueryClient();

  const sendForm = useMutation({
    mutationFn: async (values: FormValues) => {
      return fetch("/api/createChannel", {
        method: "POST",
        body: JSON.stringify(values),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      document.getElementById("closeDialog")?.click();
      queryClient.invalidateQueries(["discover"]);
    },
  });

  const onSubmit = async (data: FormValues) => {
    sendForm.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="ETH Global" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="A channel for hackers..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Event" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="image url (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="conditionCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gating Condition</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a gating condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="NFT">NFT</SelectItem>
                  <SelectItem value="OG">OG</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {gatingCondition === "NFT" && (
          <>
            <FormField
              control={form.control}
              name="blockchain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blockchain</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a blockchain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="conditionAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {gatingCondition === "OG" && (
          <FormField
            control={form.control}
            name="conditionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input placeholder="Date" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateChannel;
