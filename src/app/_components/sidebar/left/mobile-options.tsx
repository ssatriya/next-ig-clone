"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToggle } from "ahooks";

import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";

const MobileOptions = () => {
  const { setTheme, theme } = useTheme();
  const [darkMode, { set: toggleDarkMode }] = useToggle();
  const [checkedDarkMode, { set: toggleCheckedDarkMode }] = useToggle();

  const dark = theme === "dark";
  const light = theme === "light";

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="nav"
            className="my-[2px] p-3 flex items-center justify-start h-12 rounded-lg w-12"
          >
            <div className="flex items-center justify-center">
              <Icons.more />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          onInteractOutside={() => {
            setTimeout(() => {
              toggleDarkMode(false);
            }, 500);
          }}
          align="start"
          side="top"
          className={cn(
            "w-[266px] p-0 rounded-xl border-none bg-background-accent shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          )}
        >
          {darkMode ? (
            <>
              <div className="flex items-center justify-between h-[52px] p-4">
                <div className="flex items-center">
                  <Button
                    variant="link"
                    className="p-0 h-6 w-6 no-underline"
                    onClick={() => {
                      toggleDarkMode(false);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4 text-igSecondaryText" />
                  </Button>
                  <p className="font-semibold text-base">Switch appearance</p>
                </div>
                {dark && <Icons.moon />}
                {light && <Icons.sun />}
              </div>
              <Separator
                orientation="horizontal"
                className="bg-igSecondaryText/30"
              />
              <div className="p-2 w-full h-full">
                <div
                  onClick={() => {
                    toggleCheckedDarkMode(!checkedDarkMode);
                    setTheme(!checkedDarkMode ? "dark" : "light");
                  }}
                  role="button"
                  className="p-4 flex items-center justify-between h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions cursor-pointer"
                >
                  <p className="text-sm leading-5 font-light select-none">
                    Dark mode
                  </p>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="switch-appearance"
                      className="data-[state=checked]:bg-igPrimaryButton"
                      checked={theme === "dark" ? true : false}
                      onCheckedChange={toggleCheckedDarkMode}
                    />
                    <Label htmlFor="switch-appearance" className="sr-only">
                      Dark mode
                    </Label>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-2">
              <Button
                variant="nav"
                className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
              >
                <div className="flex items-center justify-center">
                  <Icons.settings />
                  <p className="pl-4 text-sm leading-5 font-light">Settings</p>
                </div>
              </Button>
              <Button
                variant="nav"
                className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
              >
                <div className="flex items-center justify-center">
                  <Icons.yourActivity />
                  <p className="pl-4 text-sm leading-5 font-light">
                    Your activity
                  </p>
                </div>
              </Button>
              <Button
                variant="nav"
                className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
              >
                <div className="flex items-center justify-center">
                  <Icons.saved />
                  <p className="pl-4 text-sm leading-5 font-light">Saved</p>
                </div>
              </Button>
              <Button
                onClick={() => {
                  toggleDarkMode(true);
                }}
                variant="nav"
                className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
              >
                <div className="flex items-center justify-center">
                  {dark && <Icons.moon />}
                  {light && <Icons.sun />}
                  <p className="pl-4 text-sm leading-5 font-light">
                    Switch appearance
                  </p>
                </div>
              </Button>
              <Button
                variant="nav"
                className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
              >
                <div className="flex items-center justify-center">
                  <Icons.report />
                  <p className="pl-4 text-sm leading-5 font-light">
                    Report a problem
                  </p>
                </div>
              </Button>
              <Separator
                orientation="horizontal"
                className="bg-hoverOptions h-[6px] -ml-2 w-[266px] my-2"
              />
              <Button
                variant="nav"
                className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
              >
                <p className="pl-4 text-sm leading-5 font-light ">
                  Switch accounts
                </p>
              </Button>
              <Separator
                orientation="horizontal"
                className="bg-hoverOptions h-[2px] -ml-2 w-[266px] my-2"
              />
              <Button
                variant="nav"
                className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
              >
                <p className="pl-4 text-sm leading-5 font-light ">Log out</p>
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};
export default MobileOptions;
