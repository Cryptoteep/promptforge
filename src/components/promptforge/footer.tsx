import { Flame, Github, Heart } from "lucide-react";

const PROJECT_LINKS = [
  { label: "Browse", href: "#browse" },
  { label: "Playground", href: "#playground" },
  { label: "Submit", href: "#submit" },
];

const COMMUNITY_LINKS = [
  { label: "GitHub", href: "https://github.com/promptforge/promptforge", external: true },
  { label: "Contributing", href: "https://github.com/promptforge/promptforge/blob/main/CONTRIBUTING.md", external: true },
  { label: "Code of Conduct", href: "https://github.com/promptforge/promptforge/blob/main/CODE_OF_CONDUCT.md", external: true },
  { label: "Issues", href: "https://github.com/promptforge/promptforge/issues", external: true },
];

const RESOURCE_LINKS = [
  { label: "LICENSE", href: "https://github.com/promptforge/promptforge/blob/main/LICENSE", external: true },
  { label: "Changelog", href: "https://github.com/promptforge/promptforge/releases", external: true },
  { label: "Docs", href: "#docs" },
];

export function Footer() {
  return (
    <footer
      className="mt-auto border-t bg-background"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a
              href="#top"
              className="inline-flex items-center gap-2 font-semibold"
              aria-label="PromptForge home"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Flame className="h-4 w-4" aria-hidden />
              </span>
              <span>
                Prompt<span className="text-primary">Forge</span>
              </span>
            </a>
            <p className="mt-3 max-w-xs text-sm text-foreground/60">
              The open-source library of AI prompts. Built by the community,
              for the community.
            </p>
            <a
              href="https://github.com/promptforge/promptforge"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" />
              github.com/promptforge
            </a>
          </div>

          {/* Project */}
          <nav aria-label="Project" className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
              Project
            </h3>
            {PROJECT_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Community */}
          <nav aria-label="Community" className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
              Community
            </h3>
            {COMMUNITY_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Resources */}
          <nav aria-label="Resources" className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
              Resources
            </h3>
            {RESOURCE_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom strip */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-foreground/50 sm:flex-row">
          <p>Built with Next.js · MIT Licensed</p>
          <p className="inline-flex items-center gap-1.5">
            Made by the open-source community with
            <Heart
              className="h-3.5 w-3.5 fill-primary text-primary"
              aria-hidden
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
