"use client";

import Image from "next/image";
import { useToggle } from "ahooks";

import { NavbarLink } from "@/types";
import Options from "./options";
import NavItem from "./nav-item";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import MobileOptions from "./mobile-options";
import MobileNavItem from "./mobile-nav-item";
import { usePostModal } from "@/hooks/use-post-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreatePost from "../../content/create-post";
import { User } from "lucia";
import { usePathname } from "next/navigation";

type LeftSidebarProps = {
  user: User;
};

const LeftSidebar = ({ user }: LeftSidebarProps) => {
  const pathname = usePathname();
  const { onOpen, isOpen } = usePostModal();
  const [isOpenSearch, { toggle: toggleOpenSearch }] = useToggle();

  const navLinks: NavbarLink[] = [
    {
      label: "Home",
      type: "link",
      href: "/",
      children: (
        <>
          {pathname === "/" ? (
            <Icons.homeActive className="group-hover:scale-110 transition shrink-0" />
          ) : (
            <Icons.home className="group-hover:scale-110 transition shrink-0" />
          )}
          <p
            className={cn(
              "pl-4 text-[16px] leading-5",
              pathname === "/" ? "font-bold" : "font-normal"
            )}
          >
            Home
          </p>
        </>
      ),
      childrenMobile: (
        <Icons.home className="group-hover:scale-110 transition" />
      ),
    },
    {
      label: "Search",
      type: "button",
      children: (
        <>
          <Icons.search className="group-hover:scale-110 transition shrink-0" />
          <p className="pl-4 font-normal text-[16px] leading-5">Search</p>
        </>
      ),
      childrenMobile: (
        <Icons.search className="group-hover:scale-110 transition" />
      ),
      onClick: () => {
        toggleOpenSearch();
      },
    },
    {
      label: "Explore",
      type: "link",
      href: "/explore",
      children: (
        <>
          <Icons.explore className="group-hover:scale-110 transition shrink-0" />
          <p className="pl-4 font-normal text-[16px] leading-5">Explore</p>
        </>
      ),
      childrenMobile: (
        <Icons.explore className="group-hover:scale-110 transition" />
      ),
    },
    {
      label: "Reels",
      type: "link",
      href: "/reels",
      children: (
        <>
          <Icons.reels className="group-hover:scale-110 transition shrink-0" />
          <p className="pl-4 font-normal text-[16px] leading-5">Reels</p>
        </>
      ),
      childrenMobile: (
        <Icons.reels className="group-hover:scale-110 transition" />
      ),
    },
    {
      label: "Messages",
      type: "link",
      href: "/messages",
      children: (
        <>
          <Icons.message className="group-hover:scale-110 transition shrink-0" />
          <p className="pl-4 font-normal text-[16px] leading-5">Messages</p>
        </>
      ),
      childrenMobile: (
        <Icons.message className="group-hover:scale-110 transition" />
      ),
    },
    {
      label: "Notifications",
      type: "button",
      children: (
        <>
          <Icons.love className="group-hover:scale-110 transition shrink-0" />
          <p className="pl-4 font-normal text-[16px] leading-5">
            Notifications
          </p>
        </>
      ),
      childrenMobile: (
        <Icons.love className="group-hover:scale-110 transition" />
      ),
      onClick: () => {},
    },
    {
      label: "Create",
      type: "button",
      children: (
        <>
          <Icons.create className="group-hover:scale-110 transition shrink-0" />
          <p className="pl-4 font-normal text-[16px] leading-5">Create</p>
        </>
      ),
      childrenMobile: (
        <Icons.create className="group-hover:scale-110 transition" />
      ),
      onClick: () => {
        onOpen();
      },
    },
    {
      label: "Profile",
      type: "link",
      href: `/${user.username}`,
      children: (
        <div className="flex items-center justify-center shrink-0">
          <div
            className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center group-hover:scale-110 transition",
              pathname.includes(`/${user.username}`)
                ? "bg-primary"
                : "bg-transparent"
            )}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.image} asChild>
                <Image
                  src={user.image}
                  height={24}
                  width={24}
                  alt={`${user.name} avatar`}
                />
              </AvatarImage>
              <AvatarFallback>ss</AvatarFallback>
            </Avatar>
          </div>
          <p
            className={cn(
              "pl-4 text-[16px] leading-5",
              pathname.includes(`/${user.username}`)
                ? "font-bold"
                : "font-normal"
            )}
          >
            Profile
          </p>
        </div>
      ),
      childrenMobile: (
        <div className="flex items-center justify-center shrink-0">
          <div
            className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center group-hover:scale-110 transition",
              pathname.includes(`/${user.username}`)
                ? "bg-primary"
                : "bg-transparent"
            )}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.image} asChild>
                <Image
                  src={user.image}
                  height={24}
                  width={24}
                  alt={`${user.name} avatar`}
                />
              </AvatarImage>
              <AvatarFallback>ss</AvatarFallback>
            </Avatar>
          </div>
        </div>
      ),
      onClick: () => {},
    },
  ];

  return (
    <>
      <div className="flex">
        <aside>
          <div
            className={cn(
              "h-full px-3 pt-6 pb-4 flex flex-col justify-between fixed",
              isOpenSearch
                ? "w-[72px] border-none"
                : "w-[245px] min-[1700px]:w-[336px] border-r-[1px]"
            )}
          >
            <div>
              <div className="mb-[19px] pt-5 px-3 pb-4">
                {isOpenSearch ? (
                  <Icons.instagramLogo className="h-[29px] w-[29px]" />
                ) : (
                  <Icons.instagramLogoType className="h-[29px] w-[103px]" />
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                {!isOpenSearch &&
                  navLinks.map((nav, index) => {
                    if (nav.type === "link") {
                      return (
                        <NavItem
                          key={index}
                          type={nav.type}
                          href={nav.href as string}
                        >
                          {nav.children}
                        </NavItem>
                      );
                    } else {
                      return (
                        <NavItem
                          key={index}
                          type={nav.type}
                          onClick={nav.onClick as () => void}
                        >
                          {nav.children}
                        </NavItem>
                      );
                    }
                  })}
                {isOpenSearch &&
                  navLinks.map((nav, index) => {
                    if (nav.type === "link") {
                      return (
                        <MobileNavItem
                          key={index}
                          type={nav.type}
                          href={nav.href as string}
                        >
                          {nav.childrenMobile}
                        </MobileNavItem>
                      );
                    } else {
                      return (
                        <MobileNavItem
                          key={index}
                          type={nav.type}
                          onClick={nav.onClick as () => void}
                        >
                          {nav.childrenMobile}
                        </MobileNavItem>
                      );
                    }
                  })}
              </div>
            </div>
            <div className="w-full">
              {isOpenSearch ? <MobileOptions /> : <Options />}
            </div>
          </div>
        </aside>
        {isOpen && <CreatePost />}
      </div>
      {/* {openSearch && <Search ref={searchRef} />} */}
    </>
  );
};
export default LeftSidebar;
