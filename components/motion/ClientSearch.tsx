// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import Image from "next/image";
// import { Input } from "../ui/input";

// interface Props<T> {
//   imgSrc: string;
//   placeholder: string;
//   data: T[];
//   callback: (data: T[]) => void;
//   fields: string[];
//   otherClasses?: string;
//   iconPosition?: "left" | "right";
// }

// const ClientSearch = <T,>({
//   imgSrc,
//   placeholder,
//   otherClasses,
//   data,
//   fields,
//   callback,
//   iconPosition = "left",
// }: Props<T>) => {
//   const [search, setSearch] = useState("");

//   const getNestedValue = (obj: any, path: string): any =>
//     path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

//   const stableCallback = useCallback(() => {
//     if (search === "") {
//       callback(data);
//     } else {
//       const filtered = data.filter((item) =>
//         fields.some((field) => {
//           const value = getNestedValue(item, field);
//           return (
//             value && String(value).toLowerCase().includes(search.toLowerCase())
//           );
//         })
//       );
//       callback(filtered);
//     }
//   }, [search, data, fields, callback]);

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       stableCallback();
//     }, 500);

//     return () => clearTimeout(delayDebounce);
//   }, [stableCallback]);

//   return (
//     <div
//       className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
//     >
//       {iconPosition === "left" && (
//         <Image
//           src={imgSrc}
//           width={24}
//           height={24}
//           alt="Search"
//           className="cursor-pointer"
//         />
//       )}

//       <Input
//         className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
//         placeholder={placeholder}
//         type="text"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {iconPosition === "right" && (
//         <Image
//           src={imgSrc}
//           width={24}
//           height={24}
//           alt="Search"
//           className="cursor-pointer"
//         />
//       )}
//     </div>
//   );
// };

// export default ClientSearch;

"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { X } from "lucide-react"; // ⛔️ nice clear icon from lucide

interface Props<T> {
  imgSrc: string;
  placeholder: string;
  data: T[];
  callback: (data: T[]) => void;
  fields: string[];
  otherClasses?: string;
  iconPosition?: "left" | "right";
  onChange?: (value: string) => void;
}

const ClientSearch = <T,>({
  imgSrc,
  placeholder,
  otherClasses,
  data,
  fields,
  callback,
  iconPosition = "left",
}: Props<T>) => {
  const [search, setSearch] = useState("");

  const getNestedValue = (obj: any, path: string): any =>
    path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

  const stableCallback = useCallback(() => {
    if (search === "") {
      callback(data);
    } else {
      const filtered = data.filter((item) =>
        fields.some((field) => {
          const value = getNestedValue(item, field);
          return (
            value && String(value).toLowerCase().includes(search.toLowerCase())
          );
        }),
      );
      callback(filtered);
    }
  }, [search, data, fields, callback]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      stableCallback();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [stableCallback]);

  const handleClear = () => {
    setSearch("");
    callback(data); // reset to full list
  };

  return (
    <div
      className={`background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-3 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          width={22}
          height={22}
          alt="Search"
          className="cursor-pointer opacity-80"
        />
      )}

      <Input
        className="paragraph-regular flex-1 bg-transparent placeholder:text-dark400_light700 border-none shadow-none outline-none"
        placeholder={placeholder}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <button
          onClick={handleClear}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <X size={18} />
        </button>
      )}

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          width={22}
          height={22}
          alt="Search"
          className="cursor-pointer opacity-80"
        />
      )}
    </div>
  );
};

export default ClientSearch;
