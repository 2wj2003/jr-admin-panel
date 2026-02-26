"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
const qs = require("qs");

function clean(obj: any) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}

export const PriceFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      minPrice: searchParams?.get("min_price") || null,
      maxPrice: searchParams?.get("max_price") || null,
    },
  });

  const onSubmit = (data: any) => {
    const brands = searchParams?.getAll("brands");

    const search = {
      brands,
      ["min_price"]: data.minPrice || searchParams?.get("min_price") || null,
      ["max_price"]: data.maxPrice || searchParams?.get("max_price") || null,
    };

    router.push(pathname + "?" + qs.stringify(clean(search)));
  };

  return (
    <div className="text-gray-secondary">
      <div className="text-primary font-semibold text-lg mb-2">ราคา</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row gap-1 w-full items-center justify-center text-center my-2">
          <input
            type="number"
            placeholder="ต่ำสุด"
            className="w-2/5 rounded-lg text-sm"
            {...register("minPrice")}
          />
          <span className="w-1/5">-</span>
          <input
            type="number"
            placeholder="สูงสุด"
            className="w-2/5 rounded-lg text-sm"
            {...register("maxPrice")}
          />
        </div>
        <button className="bg-primary text-white rounded-lg text-base w-full p-2 text-center flex justify-center">
          APPLY
        </button>
      </form>
    </div>
  );
};
