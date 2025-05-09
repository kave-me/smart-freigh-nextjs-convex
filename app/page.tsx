import { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Home | SmartFreight",
  description:
    "Efficiently manage your invoices, track payments, and handle escalations with our intelligent invoice management system.",
};

export default function Home() {
  return <HomeClient />;
}
