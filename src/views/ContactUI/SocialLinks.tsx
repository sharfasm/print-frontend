// @ts-nocheck
"use client";

import SectionHeading from "../AboutUI/shared/SectionHeading";
import Reveal from "../AboutUI/shared/Reveal";
import ContactIcon from "./shared/ContactIcon";

const PLATFORM_THEMES: Record<string, { hoverBg: string; textClass: string }> = {
  Facebook: { hoverBg: "hover:bg-[#1877f2] hover:text-white", textClass: "text-[#1877f2]" },
  Instagram: { hoverBg: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white", textClass: "text-[#e1306c]" },
  Linkedin: { hoverBg: "hover:bg-[#0077b5] hover:text-white", textClass: "text-[#0077b5]" },
  Youtube: { hoverBg: "hover:bg-[#ff0000] hover:text-white", textClass: "text-[#ff0000]" },
  Twitter: { hoverBg: "hover:bg-[#1da1f2] hover:text-white", textClass: "text-[#1da1f2]" },
  WhatsApp: { hoverBg: "hover:bg-[#25d366] hover:text-white", textClass: "text-[#25d366]" },
  Telegram: { hoverBg: "hover:bg-[#0088cc] hover:text-white", textClass: "text-[#0088cc]" },
};

export default function SocialLinks({ data }: { data: any }) {
  if (!data) return null;

  const profiles = (data.profiles || []).filter(Boolean);
  if (profiles.length === 0) return null;

  return (
    <section id="social-links" className="py-16 bg-[var(--bg)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          heading={data.heading || "Connect With Us"}
          subheading={data.subheading || "Follow us on social media for printing tips, showcase, and updates."}
          align="center"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
          {profiles.map((link: any, i: number) => {
            const displayPlatform = link.platform
              ? link.platform.charAt(0).toUpperCase() + link.platform.slice(1)
              : "";
            
            const theme = PLATFORM_THEMES[displayPlatform] || {
              hoverBg: "hover:bg-[var(--primary)] hover:text-white",
              textClass: "text-[var(--primary)]",
            };

            return (
              <Reveal key={link._id || i} delay={i * 0.05}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-5 rounded-2xl border border-[var(--text)]/10 bg-white dark:bg-[#1a2526] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${theme.hoverBg} group`}
                >
                  <div className={`p-3 rounded-xl bg-[var(--text)]/[0.03] dark:bg-white/[0.02] group-hover:bg-white/10 transition-colors ${theme.textClass} group-hover:text-white`}>
                    <ContactIcon name={displayPlatform} className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--text)] group-hover:text-white truncate">
                      {displayPlatform}
                    </p>
                    {link.label && (
                      <p className="text-xs text-[var(--text)]/50 group-hover:text-white/70 truncate">
                        {link.label}
                      </p>
                    )}
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
