// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { cn } from "@/lib/utils"; // shadcn helper
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Users,
//   Smartphone,
//   Bell,
//   UserPlus,
//   Wallet,
//   CalendarCheck,
//   AlertTriangle,
//   BookOpen,
//   LogOut,
//   Menu,
//   ChevronLeft,
//   Cpu,
// } from "lucide-react";
// import { useAuthStore } from "@/store/auth";

// const sidebarItems = [
//   { label: "Users", icon: Users, href: "/admin/users" },
//   { label: "Devices", icon: Smartphone, href: "/admin/devices" },
//   { label: "Notifications", icon: Bell, href: "/admin/notifications" },
//   { label: "User Request", icon: UserPlus, href: "/admin/requests" },
//   {
//     label: "Retail Collections",
//     icon: Wallet,
//     href: "/admin/retail-collections",
//   },
//   {
//     label: "Daily Collections",
//     icon: CalendarCheck,
//     href: "/admin/daily-collections",
//   },
//   {
//     label: "Disconnected Devices",
//     icon: AlertTriangle,
//     href: "/admin/disconnected",
//   },
//   { label: "Device Models", icon: Cpu, href: "/admin/device-models" },
//   { label: "References", icon: BookOpen, href: "/admin/references" },
//   { label: "Commands", icon: BookOpen, href: "/admin/commands" },
// ];

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [open, setOpen] = useState(true);
//   const pathname = usePathname();
//   const logout = useAuthStore((s) => s.logout);
//   const router = useRouter();

//   return (
//     <div className="flex h-screen w-screen bg-gray-50">
//       {/* Sidebar */}
//       <motion.aside
//         animate={{ width: open ? 240 : 72 }}
//         transition={{ duration: 0.3 }}
//         className="h-full flex flex-col border-r bg-white shadow-sm"
//       >
//         {/* Sidebar Header */}
//         <div className="flex items-center p-4">
//           {open && (
//             <motion.h1
//               key="title"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="font-bold text-lg text-green-700"
//             >
//               Tiktiki Admin
//             </motion.h1>
//           )}
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setOpen(!open)}
//             className="ml-auto h-8 w-8"
//           >
//             {open ? <ChevronLeft size={20} /> : <Menu size={20} />}
//           </Button>
//         </div>

//         {/* Sidebar Items */}
//         <nav className="flex-1 space-y-2 px-2">
//           {sidebarItems.map((item) => {
//             const isActive = pathname.startsWith(item.href);
//             return (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 className={cn(
//                   "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
//                   isActive
//                     ? "bg-green-200 text-green-800"
//                     : "text-gray-700 hover:bg-green-100 hover:text-green-700",
//                   open ? "justify-start" : "justify-center",
//                 )}
//               >
//                 <item.icon className="h-5 w-5" />
//                 {open && <span className="ml-3">{item.label}</span>}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Sidebar Footer */}
//         <div className="p-2">
//           <Button
//             variant="ghost"
//             className={cn(
//               "flex w-full items-center justify-center text-red-600 hover:bg-red-100",
//               open && "justify-start",
//             )}
//             onClick={() => {
//               logout();
//               router.push("/login");
//             }}
//           >
//             <LogOut className="h-5 w-5" />
//             {open && <span className="ml-3">Logout</span>}
//           </Button>
//         </div>
//       </motion.aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-hidden">{children}</main>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  Users,
  Smartphone,
  Bell,
  UserPlus,
  Wallet,
  CalendarCheck,
  AlertTriangle,
  BookOpen,
  LogOut,
  Menu,
  ChevronLeft,
  Cpu,
  Command,
  UserMinus,
  AlarmClock,
} from "lucide-react";

import { useAuthStore } from "@/store/auth";
import GoogleMapComponent from "@/components/map/UserGoogleMap";
import MapDeviceList from "@/components/motion/MapDeviceList";
// import GoogleMapComponent from "@/components/map/GoogleMapComponent";

const sidebarItems = [
  { label: "Users", icon: Users, href: "/manager/users" },
  { label: "Devices", icon: Smartphone, href: "/manager/devices" },
  { label: "Alerts", icon: AlarmClock, href: "/manager/alerts" },
  // { label: "Notifications", icon: Bell, href: "/manager/notifications" },
  // { label: "User Request", icon: UserPlus, href: "/manager/requests" },
  // {
  //   label: "Retail Collections",
  //   icon: Wallet,
  //   href: "/manager/retail-collections",
  // },
  // {
  //   label: "Daily Collections",
  //   icon: CalendarCheck,
  //   href: "/manager/daily-collections",
  // },
  // {
  //   label: "Disconnected Devices",
  //   icon: AlertTriangle,
  //   href: "/manager/disconnected",
  // },
  // { label: "Device Models", icon: Cpu, href: "/manager/device-models" },
  // { label: "References", icon: BookOpen, href: "/manager/references" },
  // { label: "Commands", icon: Command, href: "/manager/commands" },
  // { label: "UnAssign", icon: UserMinus, href: "/manager/unassign" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const showMap = pathname.includes("/live-tracking");

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: open ? 240 : 72 }}
        transition={{ duration: 0.3 }}
        className="h-full flex flex-col border-r bg-white shadow-sm z-20"
      >
        <div className="flex items-center p-4">
          {open && (
            <motion.h1
              key="title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg text-green-700"
            >
              Tiktiki Admin
            </motion.h1>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className="ml-auto h-8 w-8"
          >
            {open ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <nav className="flex-1 space-y-2 px-2">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-green-200 text-green-800"
                    : "text-gray-700 hover:bg-green-100 hover:text-green-700",
                  open ? "justify-start" : "justify-center",
                )}
              >
                <item.icon className="h-5 w-5" />
                {open && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-2">
          <Button
            variant="ghost"
            className={cn(
              "flex w-full items-center justify-center text-red-600 hover:bg-red-100",
              open && "justify-start",
            )}
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            <LogOut className="h-5 w-5" />
            {open && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Content + Map */}
      <main className="flex-1 relative overflow-hidden">
        {showMap ? (
          <>
            {/* Map */}
            <div className="absolute inset-0 z-0">
              <GoogleMapComponent />
            </div>

            {/* Device List */}
            <div className="relative left-0 bottom-0 md:w-1/2 lg:w-1/3 xl:w-1/4 h-full z-30 pointer-events-auto">
              <MapDeviceList />
            </div>

            {/* Page logic (runs but invisible) */}
            <div className="hidden">{children}</div>
          </>
        ) : (
          <div className="h-full overflow-auto">{children}</div>
        )}
      </main>
    </div>
  );
}
