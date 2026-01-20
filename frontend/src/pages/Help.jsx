import React, { useState } from "react";
import { Mail } from "lucide-react";

function Help() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const faqs = [
    {
      question: "What is WasteZero?",
      answer:
        "WasteZero is a platform dedicated to connecting organizations and volunteers to combat waste and promote sustainable environmental practices. We facilitate meaningful connections between NGOs managing waste management initiatives and volunteers eager to make a positive impact.",
    },
    {
      question: "What is our mission?",
      answer:
        "Our mission is to empower communities to reduce, reuse, and recycle waste through collaborative efforts. We believe that together, we can create a zero-waste future by making it easier for organizations and individuals to work toward sustainability goals.",
    },
    {
      question: "What is the WasteZero motto?",
      answer:
        '"Act Today, Impact Tomorrow" - We believe that every action counts. Whether you are an NGO organizing cleanup drives or a volunteer dedicating your time, your contributions shape a cleaner and greener future for the next generation.',
    },
    {
      question: "How do I get started as a volunteer?",
      answer:
        "Sign up on WasteZero, browse available opportunities posted by NGOs, and join activities that match your interests and schedule. You can track your progress, connect with other volunteers, and see the real impact of your efforts.",
    },
    {
      question: "How can NGOs post opportunities?",
      answer:
        "NGOs can create and manage waste management opportunities on the platform, set skill requirements, track volunteer participation, and measure the environmental impact of their initiatives.",
    },
    {
      question: "How does the matching system work?",
      answer:
        "WasteZero uses an intelligent matching system that connects volunteers with opportunities based on their skills, availability, and interests. This ensures the right people are matched with the right projects for maximum impact.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white dark:bg-slate-800 rounded-lg">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Help & Support
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Find answers to your questions or get in touch with our support team.
      </p>

      {/* Email Support Section */}
      <div className="mb-10 p-6 bg-blue-50 dark:bg-slate-700 rounded-lg border border-blue-200 dark:border-slate-600">
        <div className="flex items-start gap-4">
          <Mail size={28} className="text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Email Support
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Have questions or need assistance? Reach out to our support team via email:
            </p>
            <a
              href="mailto:wastezero00@gmail.com"
              className="text-blue-600 dark:text-blue-400 font-semibold text-lg hover:underline break-all"
            >
              wastezero00@gmail.com
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              We aim to respond to all inquiries within 24 hours. Please include details about your concern so we can assist you better.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-left"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <span className="text-gray-600 dark:text-gray-300 text-xl shrink-0 ml-4">
                  {openFaqIndex === index ? "−" : "+"}
                </span>
              </button>

              {openFaqIndex === index && (
                <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-600">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Still Need Help */}
      <div className="mt-10 p-6 bg-green-50 dark:bg-slate-700 rounded-lg border border-green-200 dark:border-slate-600">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Still need help?
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          If you don't find the answer you're looking for, please don't hesitate to contact us at{" "}
          <a
            href="mailto:wastezero00@gmail.com"
            className="text-green-600 dark:text-green-400 font-semibold hover:underline"
          >
            wastezero00@gmail.com
          </a>
          . We're here to help!
        </p>
      </div>
    </div>
  );
}

export default Help;
