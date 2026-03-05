import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Container from "./container";

const product = [
  {
    title: "Features",
    link: "/features",
  },
  {
    title: "Invoice Templates",
    link: "/templates",
  },
  {
    title: "Pricing",
    link: "/pricing",
  },
  {
    title: "Integrations",
    link: "/integrations",
  },
];

const useCases = [
  {
    title: "Freelancers",
    link: "/use-cases/freelancers",
  },
  {
    title: "Agencies",
    link: "/use-cases/agencies",
  },
  {
    title: "Consultants",
    link: "/use-cases/consultants",
  },
  {
    title: "Small businesses",
    link: "/use-cases/small-business",
  },
];

export default function Footer() {
  return (
    <Container>
      <footer className="py-12 mask-b-from-90%">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 text-sm px-8">
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-neutral-500">
              {product.map((item) => (
                <li key={item.title}>
                  <a
                    href={item.link}
                    className="hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Use cases</h4>
            <ul className="space-y-2 text-neutral-500">
              {useCases.map((item) => (
                <li key={item.title}>
                  <a
                    href={item.link}
                    className="hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Social</h4>
            <div className="flex flex-wrap items-center gap-4 text-neutral-500">
              <a
                href="https://github.com/your-username"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <IconBrandGithub />
              </a>
              <span>•</span>
              <a
                href="https://www.linkedin.com/in/your-username"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <IconBrandLinkedin />
              </a>
              <span>•</span>
              <a
                href="https://twitter.com/your-username"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <IconBrandX />
              </a>
              <span>•</span>
              <a
                href="https://your-portfolio-domain.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Portfolio
              </a>
            </div>
          </div>
        </div>

        {/* Brand mark – unchanged */}
        <p className="text-center text-5xl md:text-9xl lg:text-[12rem] font-bold bg-clip-text text-transparent bg-linear-to-b from-neutral-50 dark:from-neutral-950 to-neutral-200 dark:to-neutral-800 inset-x-0">
          INVOICELY
        </p>
        <div className="mt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Invoicely. All rights reserved.
        </div>
      </footer>
    </Container>
  );
}
