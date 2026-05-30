import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailGateSchema = z.object({
  email: z.string().email("Enter a valid email to unlock your breakdown."),
});

type EmailGateValues = z.infer<typeof emailGateSchema>;

interface EmailGateProps {
  onUnlock: (email: string) => void;
}

export const EmailGate = ({ onUnlock }: EmailGateProps) => {
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
      <Label htmlFor={fieldId}>Email to unlock your full breakdown</Label>
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
        Unlock my breakdown
      </Button>
    </form>
  );
};
