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
            <Icons.homeActive className="transition group-hover:scale-110 shrink-0" />
          ) : (
            <Icons.home className="transition group-hover:scale-110 shrink-0" />
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
        <Icons.home className="transition group-hover:scale-110" />
      ),
    },
    {
      label: "Search",
      type: "button",
      children: (
        <>
          <Icons.search className="transition group-hover:scale-110 shrink-0" />
          <p className="pl-4 font-normal text-[16px] leading-5">Search</p>
        </>
      ),
      childrenMobile: (
        <Icons.search className="transition group-hover:scale-110" />
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
          <Icons.explore className="transition group-hover:scale-110 shrink-0" />
          <p className="pl-4 font-normal text-[16px] leading-5">Explore</p>
        </>
      ),
      childrenMobile: (
        <Icons.explore className="transition group-hover:scale-110" />
      ),
    },
    {
      label: "Reels",
      type: "link",
      href: "/reels",
      children: (
        <>
          <Icons.reels className="transition group-hover:scale-110 shrink-0" />
          <p className="pl-4 font-normal text-[16px] leading-5">Reels</p>
        </>
      ),
      childrenMobile: (
        <Icons.reels className="transition group-hover:scale-110" />
      ),
    },
    {
      label: "Messages",
      type: "link",
      href: "/messages",
      children: (
        <>
          <Icons.message className="transition group-hover:scale-110 shrink-0" />
          <p className="pl-4 font-normal text-[16px] leading-5">Messages</p>
        </>
      ),
      childrenMobile: (
        <Icons.message className="transition group-hover:scale-110" />
      ),
    },
    {
      label: "Notifications",
      type: "button",
      children: (
        <>
          <Icons.love className="transition group-hover:scale-110 shrink-0" />
          <p className="pl-4 font-normal text-[16px] leading-5">
            Notifications
          </p>
        </>
      ),
      childrenMobile: (
        <Icons.love className="transition group-hover:scale-110" />
      ),
      onClick: () => {},
    },
    {
      label: "Create",
      type: "button",
      children: (
        <>
          <Icons.create className="transition group-hover:scale-110 shrink-0" />
          <p className="pl-4 font-normal text-[16px] leading-5">Create</p>
        </>
      ),
      childrenMobile: (
        <Icons.create className="transition group-hover:scale-110" />
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
            <Avatar className="w-6 h-6">
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
            <Avatar className="w-6 h-6">
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
      <aside>
        <div
          className={cn(
            "h-full px-3 pt-6 pb-4 hidden border-r-[1px] md:flex flex-col justify-between fixed w-[244px] max-[1263px]:w-[72px] 3xl:w-[336px]"
            // isOpenSearch
            //   ? "w-[72px] border-none"
            //   : "w-[245px] min-[1700px]:w-[336px] border-r-[1px]"
          )}
        >
          <div>
            <div className="mb-[19px] pt-5 px-3 pb-4">
              {/* {isOpenSearch ? ( */}
              <Icons.instagramLogo className="h-[29px] w-[29px] hidden max-[1263px]:block" />
              {/* ) : ( */}
              <Icons.instagramLogoType className="h-[29px] w-[103px] hidden min-[1264px]:block" />
              {/* )} */}
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <div className="hidden min-[1264px]:block">
                {navLinks.map((nav, index) => {
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
              </div>
              <div className="hidden max-[1263px]:block">
                {navLinks.map((nav, index) => {
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
          </div>
          <div className="w-full">
            <div className="hidden max-[1263px]:block">
              <MobileOptions />
            </div>
            <div className="hidden min-[1264px]:block">
              <Options />
            </div>
            {/* {isOpenSearch ? <MobileOptions /> : <Options />} */}
          </div>
        </div>
      </aside>
      {isOpen && <CreatePost />}
      {/* {openSearch && <Search ref={searchRef} />} */}
    </>
  );
};
export default LeftSidebar;
