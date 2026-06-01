import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailGateSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type EmailGateValues = z.infer<typeof emailGateSchema>;

interface EmailGateProps {
  kitName: string;
  onUnlock: (email: string) => void;
}

export const EmailGate = ({ kitName, onUnlock }: EmailGateProps) => {
  const fieldId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailGateValues>({
    resolver: zodResolver(emailGateSchema),
    mode: "onSubmit",
  });

  const submit = handleSubmit((values) => onUnlock(values.email));

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <Label htmlFor={fieldId}>Email for your {kitName}</Label>
      <Input
        id={fieldId}
        type="email"
        placeholder="you@example.com"
        aria-invalid={errors.email ? "true" : "false"}
        {...register("email")}
      />
      {errors.email && (
        <p role="alert" className="text-sm text-destructive">
          {errors.email.message}
        </p>
      )}
      <Button type="submit" className="w-full">
        Send me the {kitName}
      </Button>
    </form>
  );
};
