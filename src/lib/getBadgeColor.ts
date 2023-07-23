export function getBadgeColor(category: string) {
  switch (category) {
    case "POAP":
      return "dark:bg-[#948CF8] dark:text-white";
    case "NFT":
      return "dark:bg-[#E5CAF5]";
    case "Event":
      return "dark:bg-[#63B599]";
    default:
      return "";
  }
}
