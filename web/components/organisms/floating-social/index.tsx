"use client";

import { useState } from "react";
import Link from "next/link";
import { socialLinks } from "./social-data";
import { FaShareAlt, FaTimes } from "react-icons/fa";

export const FloatingSocial = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-4 bottom-24 z-40 flex flex-col items-center gap-3">
      {/* Social links — animate in/out */}
      {socialLinks.map((social, index) => {
        const Icon = social.icon;
        return (
          <div
            key={social.name}
            className="flex items-center gap-2 transition-all duration-300"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
              pointerEvents: open ? "auto" : "none",
              transitionDelay: open ? `${index * 50}ms` : `${(socialLinks.length - index) * 30}ms`,
            }}
          >
            {/* Label */}
            <span className="bg-white text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-md whitespace-nowrap">
              {social.name}
            </span>
            {/* Icon button */}
            <Link
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.ariaLabel}
              onClick={() => setOpen(false)}
              className={`
                ${social.color} ${social.hoverColor}
                w-11 h-11
                rounded-full
                flex items-center justify-center
                text-white
                shadow-lg
                transition-all duration-200
                hover:scale-110 active:scale-95
              `}
            >
              <Icon className="w-4 h-4" />
            </Link>
          </div>
        );
      })}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle social links"
        className={`
          w-12 h-12
          rounded-full
          flex items-center justify-center
          text-white
          shadow-xl
          transition-all duration-300
          hover:scale-110 active:scale-95
          ${open ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"}
        `}
      >
        <span
          className="transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          {open ? <FaTimes className="w-4 h-4" /> : <FaShareAlt className="w-4 h-4" />}
        </span>
      </button>
    </div>
  );
};
