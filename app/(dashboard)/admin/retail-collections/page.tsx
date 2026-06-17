"use client";

import * as XLSX from "xlsx";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Car,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
} from "lucide-react";

import { formatMonthlyDate } from "@/lib/utils";
import PaymentDialog from "@/components/dialog/PaymentDialog";
import { Payment } from "@/types/payment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentAPI } from "@/lib/api";
import UpdatePaymentDialog from "@/components/dialog/UpdatePaymentDialog";
import DeletePaymentDialog from "@/components/dialog/DeletePaymentDialog";
import ClientSearch from "@/components/motion/ClientSearch";

interface MonthSelectorProps {
  date: Date;
  setDate: (date: Date) => void;
}

const MonthSelector = ({ date, setDate }: MonthSelectorProps) => {
  const handleNextClick = () => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    setDate(d);
  };

  const handlePrevClick = () => {
    const d = new Date(date);
    d.setMonth(d.getMonth() - 1);
    setDate(d);
  };

  return (
    <div className="flex gap-4 items-center">
      <Button onClick={handlePrevClick} variant="outline">
        <ChevronLeft className="text-xl sm:text-2xl" />
      </Button>
      <span className="subtle-regular">{formatMonthlyDate(date)}</span>
      <Button onClick={handleNextClick} variant="outline">
        <ChevronRight className="text-xl sm:text-2xl" />
      </Button>
    </div>
  );
};

export default function RetailCollectionsPage() {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const onPlusClick = () => setOpen(true);
  const onDownloadClick = () => {
    if (filteredPayments.length === 0) {
      alert("No payment data available to download!");
      return;
    }

    // Format data for Excel export
    const exportData = filteredPayments.map((p) => ({
      "Device ID": p.device_id,
      Registration: p.registration_number,
      Email: p.customer_email,
      Phone: p.customer_number,
      Charge: p.service_charge,
      Status: p.payment_status ? "Paid" : "Due",
      Year: p.year,
      Month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][p.month],
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // ✅ FIX: Explicitly cast keys to keyof typeof exportData[0]
    const colWidths = Object.keys(exportData[0]).map((key) => {
      const typedKey = key as keyof (typeof exportData)[0];
      const maxLength = Math.max(
        key.length,
        ...exportData.map((row) =>
          row[typedKey] ? row[typedKey]!.toString().length : 0
        )
      );
      return { wch: maxLength + 2 }; // add padding
    });

    worksheet["!cols"] = colWidths;

    // Create workbook and export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Retail Collections");

    XLSX.writeFile(workbook, "retail_collections.xlsx");
  };

  const handleDueClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setUpdateOpen(true);
  };

  const handlePaymentUpdated = async () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const updatedPayments = await PaymentAPI.get_monthly_payment({
      month,
      year,
    });
    setPayments(updatedPayments);
    setFilteredPayments(payments);
  };

  // Fetch data whenever month/year changes
  useEffect(() => {
    const controller = new AbortController(); // in case user switches fast
    const delay = 500; // ms delay after last date change
    let timeoutId: NodeJS.Timeout;

    const fetchPayments = async () => {
      setLoading(true);
      try {
        const year = date.getFullYear();
        const month = date.getMonth();
        const payments = await PaymentAPI.get_monthly_payment({ month, year });
        setPayments(payments);
        setFilteredPayments(payments);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Error fetching payments:", err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    timeoutId = setTimeout(fetchPayments, delay);

    // cleanup when date changes before delay ends
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [date]);

  return (
    <div className="w-full h-full p-4">
      <Card className="w-full h-full flex flex-col items-center justify-center p-0 gap-0">
        <div className="w-full flex flex-col xl:flex-row gap-4 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100">
          {/* 🚗 Summary Cards Section */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Total Vehicles */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="p-2 bg-blue-100 rounded-full">
                <Car className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <h1 className="text-xl font-bold text-gray-800">
                  {payments.length}
                </h1>
              </div>
            </div>

            {/* Paid Vehicles */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="text-green-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Paid Vehicles</p>
                <h1 className="text-xl font-bold text-green-700">
                  {payments.filter((p) => p.payment_status).length}
                </h1>
              </div>
            </div>

            {/* Due Vehicles */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="p-2 bg-red-100 rounded-full">
                <Clock className="text-red-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Vehicles</p>
                <h1 className="text-xl font-bold text-red-700">
                  {payments.filter((p) => !p.payment_status).length}
                </h1>
              </div>
            </div>

            {/* 💰 Collections Calculations */}
            {(() => {
              const total = payments.reduce(
                (sum, p) => sum + (Number(p.service_charge) || 0),
                0
              );
              const paid = payments
                .filter((p) => p.payment_status)
                .reduce((sum, p) => sum + (Number(p.service_charge) || 0), 0);
              const due = total - paid;

              return (
                <>
                  {/* Total Collections */}
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="p-2 bg-amber-100 rounded-full">
                      <CreditCard className="text-amber-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Collections</p>
                      <h1 className="text-xl font-bold text-gray-800">
                        {total.toLocaleString()}
                      </h1>
                    </div>
                  </div>

                  {/* Paid Collections */}
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="p-2 bg-green-100 rounded-full">
                      <DollarSign className="text-green-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Paid Collections</p>
                      <h1 className="text-xl font-bold text-green-700">
                        {paid.toLocaleString()}
                      </h1>
                    </div>
                  </div>

                  {/* Due Collections */}
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertCircle className="text-red-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Due Collections</p>
                      <h1 className="text-xl font-bold text-red-700">
                        {due.toLocaleString()}
                      </h1>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* 🔍 Search + Controls Section */}
          <div className="flex flex-col justify-between gap-4 xl:w-[500px]">
            <div className="flex justify-end">
              <ClientSearch
                callback={setFilteredPayments}
                data={payments}
                fields={[
                  "device_id",
                  "registration_number",
                  "customer_email",
                  "customer_number",
                ]}
                imgSrc="/icons/search.svg"
                placeholder="Search by Email, Phone, or Device ID..."
                otherClasses="w-full sm:w-[300px] lg:w-[400px]"
              />
            </div>

            <div className="flex justify-between items-center mx-6">
              <Button onClick={onPlusClick} variant="outline">
                <Plus className="text-xl sm:text-2xl" />
              </Button>
              <MonthSelector date={date} setDate={setDate} />
              <Button onClick={onDownloadClick} variant="outline">
                <Download className="text-xl sm:text-2xl" />
              </Button>
            </div>
          </div>
        </div>

        {/* Table Section */}

        <div className="w-full flex-1 min-h-0 bg-blue-50 p-4 flex flex-col">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : payments.length === 0 ? (
            <p className="text-center text-gray-500">No payments found.</p>
          ) : (
            <div className="flex-1 bg-white rounded-md border flex flex-col overflow-hidden">
              {/* ✅ Scrollable wrapper */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse text-sm">
                  {/* ✅ Sticky Header */}
                  <thead className="bg-white sticky top-0 z-20 shadow-sm border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left whitespace-nowrap">
                        Device ID
                      </th>
                      <th className="px-3 py-2 text-left whitespace-nowrap">
                        Registration
                      </th>
                      <th className="px-3 py-2 text-left whitespace-nowrap">
                        Email
                      </th>
                      <th className="px-3 py-2 text-left whitespace-nowrap">
                        Phone
                      </th>
                      <th className="px-3 py-2 text-left whitespace-nowrap">
                        Charge
                      </th>
                      <th className="px-3 py-2 text-center whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-3 py-2 text-center whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPayments.map((p) => (
                      <tr
                        key={p._id}
                        className="hover:bg-gray-50 border-b border-gray-100"
                      >
                        <td className="px-3 py-2 font-mono">{p.device_id}</td>
                        <td className="px-3 py-2">{p.registration_number}</td>
                        <td className="px-3 py-2 truncate max-w-[220px]">
                          {p.customer_email}
                        </td>
                        <td className="px-3 py-2 font-mono">
                          {p.customer_number}
                        </td>
                        <td className="px-3 py-2">{p.service_charge}</td>

                        {/* Status Column */}
                        <td className="px-3 py-2 text-center">
                          {p.payment_status ? (
                            <span className="text-green-600 font-semibold">
                              Paid
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-400 hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleDueClick(p)}
                            >
                              Due
                            </Button>
                          )}
                        </td>

                        {/* Delete only visible if payment_status = false */}
                        <td className="px-3 py-2 text-center">
                          {!p.payment_status && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteClick(p._id)}
                            >
                              🗑️
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 💰 Payment Dialog */}
      <PaymentDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={handlePaymentUpdated}
      />

      {/* 💳 Update Payment Dialog */}
      <UpdatePaymentDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        payment={selectedPayment}
        onUpdated={handlePaymentUpdated}
      />

      {/* 🗑️ Delete Payment Dialog */}
      <DeletePaymentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        paymentId={deleteId}
        onDeleted={handlePaymentUpdated}
      />
    </div>
  );
}
