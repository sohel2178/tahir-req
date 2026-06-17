import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Sultan Tracker",
  description:
    "Learn how Sultan Tracker collects, uses, and protects your information when using our GPS and WhatsApp services.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Privacy Policy - Sultan Tracker
      </h1>

      <p className="mb-4">
        Welcome to <strong>Sultan Tracker</strong>. Your privacy is important to
        us. This policy explains how we handle your personal information when
        you use our GPS tracking and WhatsApp messaging services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        🔒 Information We Collect
      </h2>
      <p className="mb-4">
        We may collect basic details such as your name, phone number, GPS device
        ID, and vehicle registration information when you register or use our
        services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        💬 How We Use Your Information
      </h2>
      <p className="mb-4">
        We use your data only to provide tracking, notifications, and updates
        related to your vehicles and account. We never sell, trade, or share
        your personal data with third parties.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        📱 WhatsApp Communication
      </h2>
      <p className="mb-4">
        Sultan Tracker uses the WhatsApp Business API to send service updates,
        offers, and account notifications. We follow Meta’s data protection
        policies and your consent is always respected.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">🌍 Data Security</h2>
      <p className="mb-4">
        We use secure servers, SSL encryption, and restricted access controls to
        protect your data. In case of any data breach, we will notify affected
        users promptly.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">📞 Contact Us</h2>
      <p className="mb-8">
        If you have any questions about this Privacy Policy, please contact us
        at{" "}
        <Link
          href="mailto:admin@forbit.tech"
          className="text-blue-600 hover:underline"
        >
          admin@forbit.tech
        </Link>
        .
      </p>

      <p className="text-sm text-gray-500">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-BD", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </main>
  );
}
