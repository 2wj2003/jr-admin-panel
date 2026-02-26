import { IconType } from "react-icons";
import { FaPhone, FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiLine } from "react-icons/si";

export interface SocialLink {
  name: string;
  icon: IconType;
  href: string;
  color: string;
  hoverColor: string;
  ariaLabel: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "Phone",
    icon: FaPhone,
    href: "tel:066-146-3289",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    ariaLabel: "โทรศัพท์ 066-146-3289",
  },
  {
    name: "Line",
    icon: SiLine,
    href: "https://lin.ee/s2DE4uk",
    color: "bg-[#00B900]",
    hoverColor: "hover:bg-[#00A000]",
    ariaLabel: "Line Official Account",
  },
  {
    name: "Facebook",
    icon: FaFacebookF,
    href: "https://www.facebook.com/jrcommerce.th",
    color: "bg-[#1877F2]",
    hoverColor: "hover:bg-[#0C63D4]",
    ariaLabel: "Facebook Page",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    href: "https://www.instagram.com/jr.commerce",
    color: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500",
    hoverColor: "hover:opacity-90",
    ariaLabel: "Instagram Account",
  },
];
