import { createRoot } from "react-dom/client";
import MarkButton from "@/components/MarkButton";

const container = document.querySelector(
  "div.anime-video-options > div.item.right"
) as HTMLElement;
if (container) {
  const root = document.createElement("div");
  root.id = "chrome-extension-neko-sama";
  container.style.display = "flex";
  container.append(root);

  createRoot(root).render(<MarkButton />);
}

