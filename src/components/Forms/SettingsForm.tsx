"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock } from "lucide-react";

type EmailValues = {
  email: string;
  confirmEmail: string;
};

type PasswordValues = {
  password: string;
  confirmPassword: string;
};

type SettingsFormProps = {
  user?: {
    role?: string;
    email?: string;
  };
};

export default function SettingsForm({ user }: SettingsFormProps) {
  const emailForm = useForm<EmailValues>({
    defaultValues: {
      email: user?.email ?? "",
      confirmEmail: user?.email ?? "",
    },
    mode: "onTouched",
  });

  const passwordForm = useForm<PasswordValues>({
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  function onSubmitEmail(data: EmailValues) {
    // frontend-only placeholder: you can wire this to an API later
    alert(`E-post uppdaterad till ${data.email} (frontend-only)`);
    emailForm.reset({ email: data.email, confirmEmail: data.email });
  }

  function onSubmitPassword() {
    // frontend-only placeholder
    alert("Lösenord uppdaterat (frontend-only)");
    passwordForm.reset();
  }

  const {
    register: regEmail,
    handleSubmit: handleEmail,
    getValues: getEmailValues,
    formState: emailState,
  } = emailForm;
  const {
    register: regPassword,
    handleSubmit: handlePassword,
    getValues: getPasswordValues,
    formState: passwordState,
  } = passwordForm;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User size={18} /> Min profil
          {user?.role === "admin" && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Admin
            </span>
          )}
        </h3>

        {/* Sparad e-post (vi sparar bara e-post/lösenord enligt önskemål) */}
        {user?.email && (
          <div className="bg-muted/10 p-3 rounded-md border border-muted-foreground/10">
            <p className="text-sm font-medium">Sparad profil</p>
            <div className="text-sm text-muted-foreground mt-1">
              {user.email}
            </div>
          </div>
        )}

        {/* Ändra e-post */}
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lock size={18} /> Byt E-POST
        </h3>
        <form
          onSubmit={handleEmail(onSubmitEmail)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <label className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Ny e-post
            </span>
            <Input
              {...regEmail("email", {
                required: "E-post krävs",
                pattern: { value: /^\S+@\S+$/i, message: "Ogiltig e-post" },
              })}
              type="email"
            />
            {emailState.errors.email && (
              <p className="text-xs text-destructive mt-1">
                {String(emailState.errors.email?.message)}
              </p>
            )}
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Bekräfta e-post
            </span>
            <Input
              {...regEmail("confirmEmail", {
                required: "Bekräfta e-post",
                validate: (v) =>
                  v === getEmailValues("email") ||
                  "E-post adresserna matchar inte",
              })}
              type="email"
            />
            {emailState.errors.confirmEmail && (
              <p className="text-xs text-destructive mt-1">
                {String(emailState.errors.confirmEmail?.message)}
              </p>
            )}
          </label>

          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit">Uppdatera e-post</Button>
            <Button variant="outline" onClick={() => emailForm.reset()}>
              Avbryt
            </Button>
          </div>
        </form>
      </section>

      {/* Ändra lösenord */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lock size={18} /> Byt lösenord{" "}
        </h3>
        <form
          onSubmit={handlePassword(onSubmitPassword)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <label className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Nytt lösenord
            </span>
            <Input
              {...regPassword("password", {
                required: "Lösenord krävs",
                minLength: { value: 8, message: "Minst 8 tecken" },
              })}
              type="password"
              placeholder="Minst 8 tecken"
            />
            {passwordState.errors.password && (
              <p className="text-xs text-destructive mt-1">
                {String(passwordState.errors.password?.message)}
              </p>
            )}
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Bekräfta lösenord
            </span>
            <Input
              {...regPassword("confirmPassword", {
                required: "Bekräfta lösenord",
                validate: (v) =>
                  v === getPasswordValues("password") ||
                  "Lösenorden matchar inte",
              })}
              type="password"
            />
            {passwordState.errors.confirmPassword && (
              <p className="text-xs text-destructive mt-1">
                {String(passwordState.errors.confirmPassword?.message)}
              </p>
            )}
          </label>

          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit">Byt lösenord</Button>
            <Button variant="outline" onClick={() => passwordForm.reset()}>
              Avbryt
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
