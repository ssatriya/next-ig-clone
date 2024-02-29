"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { Pacifico } from "next/font/google";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { LoginPayload, LoginSchema } from "@/lib/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import SocialLogin from "@/components/auth/social-login";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

const LoginForm = () => {
  const form = useForm<LoginPayload>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  return (
    <div className="flex flex-col gap-3 min-h-screen items-center justify-center">
      <Card className="w-[350px] text-center shadow-none border-igElevatedSeparator/40 rounded-sm">
        <CardHeader>
          <p className={cn(pacifico.className, "text-4xl")}>Instagram</p>
        </CardHeader>
        <CardContent className="w-full space-y-6">
          <Form {...form}>
            <form className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="usernameOrEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          {...field}
                          type="text"
                          label="Username or email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          {...field}
                          type="password"
                          label="Password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full text-white font-semibold"
                variant="primary"
                size="sm"
                disabled
              >
                Log in
              </Button>
            </form>
          </Form>
          <div className="flex flex-col gap-6">
            <div className="flex gap-3 justify-center items-center w-full">
              <div className="w-full h-[1px] bg-background-accent rounded-full" />
              <span className="text-sm font-medium text-igSecondaryText">
                OR
              </span>
              <div className="w-full h-[1px] bg-background-accent rounded-full" />
            </div>
            <SocialLogin />
            <Link
              href="/accounts/password/reset"
              className="text-xs text-muted-foreground"
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>
      </Card>
      <Card className="w-[350px] text-center shadow-none border-igElevatedSeparator/40 rounded-sm">
        <CardContent className="h-full flex items-center justify-center p-0">
          <p className="text-sm p-5">
            Don&apos;t have an account?{" "}
            <Link
              href="/accounts/email-sign-up/"
              className="font-semibold text-igPrimary"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
export default LoginForm;
