import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export default function Sidebar({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <nav
      className={cn(
        "flex flex-col space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item, index) => (
        <a
          key={item.href}
          href={item.href}
          onClick={() => setActiveTab(index)}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            activeTab === index
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
}
