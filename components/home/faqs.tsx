"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Container from "./container";

export default function FAQsTwo() {
  const faqItems = [
    {
      id: "item-1",
      question: "Is Invoicely free to use?",
      answer:
        "Yes. You can create and download invoices for free without creating an account. Some advanced features may be added later under optional paid plans.",
    },
    {
      id: "item-2",
      question: "Can I export my invoices as PDF?",
      answer:
        "Yes. You can export professional, print-ready PDF invoices directly from the app and share them with your clients.",
    },
    {
      id: "item-3",
      question: "Can I add my own logo and business details?",
      answer:
        "Yes. Invoicely allows you to add your business name, logo, contact details, and customize basic branding on your invoices.",
    },
    {
      id: "item-4",
      question: "Do I need to create an account to generate invoices?",
      answer:
        "No. You can start generating invoices instantly without signing up. An account is only required if you want to save and manage invoices online.",
    },
    {
      id: "item-5",
      question: "Who is Invoicely built for?",
      answer:
        "Invoicely is designed for freelancers, consultants, agencies, and small businesses that need a fast and simple way to create professional invoices.",
    },
  ];

  return (
    <Container>
      <div className="border-b border-border py-12">
        <div
          className="flex items-start md:flex-row flex-col justify-between gap-4 md:px-8 px-6 pb-6 border-b border-border"
          id="#faqs"
        >
          <h2 className="tracking-tight text-2xl font-medium">
            Frequently Asked Questions
          </h2>

          <p className="max-w-lg text-neutral-500 md:mt-6 ">
            Discover quick and comprehensive answers to common questions about
            our invoicely, services, and features.
          </p>
        </div>

        <div>
          <Accordion
            type="single"
            collapsible
            className="bg-card w-full py-3 px-4"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="md:text-base text-sm text-neutral-500 ">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Container>
  );
}
