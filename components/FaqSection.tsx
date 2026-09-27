"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQS } from "@/data/services";
import { useLanguage } from "@/context/LanguageContext";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { locale } = useLanguage();

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{locale === "bn" ? "প্রশ্ন আছে?" : "Got Questions?"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {locale === "bn" ? "সাধারণ জিজ্ঞাসাসমূহ (FAQ)" : "Frequently Asked Questions"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {locale === "bn"
              ? "আপনার সাধারণ প্রশ্নের উত্তরসমূহ জেনে নিন"
              : "Find instant answers to common questions & support guides"}
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const question = locale === "bn" ? faq.questionBn || faq.question : faq.questionEn || faq.question;
            const answer = locale === "bn" ? faq.answerBn || faq.answer : faq.answerEn || faq.answer;

            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-white hover:text-cyan-300 transition-colors">
                    {question}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg bg-slate-800 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-cyan-400" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
