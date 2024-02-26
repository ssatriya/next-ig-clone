const footerLinks: string[] = [
  "Meta",
  "About",
  "Blog",
  "Jobs",
  "Help",
  "API",
  "Privacy",
  "Terms",
  "Locations",
  "Instagram Lite",
  "Threads",
  "Contact Uploading & Non-Users",
  "Meta Verified",
];

const ProfileFooter = () => {
  return (
    <div className="h-16 w-full bottom-0">
      <div className="flex px-10 justify-evenly items-center">
        {footerLinks.map((link, index) => (
          <span key={index} className="text-xs text-igSecondaryTextV2">
            {link}
          </span>
        ))}
      </div>
    </div>
  );
};
export default ProfileFooter;
