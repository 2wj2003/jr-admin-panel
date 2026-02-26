"use client";

import { Disclosure } from "@headlessui/react";
import cx from "classnames";
import { HiOutlineChevronUp } from "react-icons/hi";

export const CCTVFaqs = () => (
  <>
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button
            className={cx(
              "flex w-full gap-1 justify-between bg-slate-100 px-6 pt-6 text-left text-lg text-slate-900 font-medium",
              {
                "rounded-lg pb-6": !open,
                "rounded-t-lg pb-2": open,
              }
            )}
          >
            <span>รับประกันสินค้ากี่ปี?</span>
            <HiOutlineChevronUp
              className={cx("min-w-5 h-5 w-5 text-slate-600 flex-shrink-0", {
                "rotate-180 transform": open,
              })}
            />
          </Disclosure.Button>

          <Disclosure.Panel
            className={cx(
              "px-6 pt-2 pb-4 text-sm text-slate-600 bg-slate-100 rounded-b-lg font-body whitespace-pre-wrap flex flex-col gap-4"
            )}
            as="pre"
          >
            <b>รับประกันกล้องและเครื่องบันทึก 2 ปี</b>
            <ul className="pl-4 list-disc">
              <li>ปีที่ 1 เปลี่ยนฟรีทีนที ไม่ต้องรอซ่อม</li>
              <li>ปีที่ 2 เคลมฟรีทันที ไม่ต้องรอซ่อม</li>
              <li>
                ทั้ง 2 ปี ไม่รวมกรณีฟ้าผ่า หนูกัดสาย
                หรือเกิดจากการกระทำของมนุษย์
              </li>
            </ul>
            <b>รับประกันหลังการขายฟรี 6 เดือนแรก</b>
            <ul className="pl-4 list-disc">
              <li>รับประกันหลังการขายฟรี 6 เดือนแรก</li>
              <li>
                หลัง 6 เดือน ถ้าช่างเข้าไปแก้ไขหน้างาน คิดค่าบริการครั้งละ 1,090
                บาท แต่ถ้าแค่การใช้งานเบื้องต้น สามารถโทร Call Service
                ฟรีตลอดการใช้งาน และ ทีมออนไลน์ Kowacare 24ชม
              </li>
            </ul>
            <b>หลังแจ้งเซอร์วิส ช่างจัดคิวเข้าไปบ้านลูกค้าไม่เกิน 3-5 วัน</b>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button
            className={cx(
              "flex w-full gap-1 justify-between bg-slate-100 px-6 pt-6 text-left text-lg text-slate-900 font-medium",
              {
                "rounded-lg pb-6": !open,
                "rounded-t-lg pb-2": open,
              }
            )}
          >
            <span>กล้องวงจรปิดมีกี่ล้านพิกเซล มีกล้องประเภทอะไรบ้าง?</span>
            <HiOutlineChevronUp
              className={cx("min-w-5 h-5 w-5 text-slate-600 flex-shrink-0", {
                "rotate-180 transform": open,
              })}
            />
          </Disclosure.Button>

          <Disclosure.Panel
            className={cx(
              "px-6 pt-2 pb-4 text-sm text-slate-600 bg-slate-100 rounded-b-lg font-body whitespace-pre-wrap flex flex-col gap-4"
            )}
            as="pre"
          >
            Kowa CCTA มีกล้องความคมชัดตั้งแต่ 2 ล้านพิกเซล ไปถึง 5 ล้านพิกเซล
            โดยกล้องนั้นมีคุณสมบัติต่างกัน เช่น บันทึกเสียงได้ ภาพสี 24 ชั่วโมง
            หรือบันทึกภาพสี 24 ชั่วโมงพร้อมทั้งเสียงด้วย
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button
            className={cx(
              "flex w-full gap-1 justify-between bg-slate-100 px-6 pt-6 text-left text-lg text-slate-900 font-medium",
              {
                "rounded-lg pb-6": !open,
                "rounded-t-lg pb-2": open,
              }
            )}
          >
            <span>ดูออนไลน์จำเป็นต้องใช้อินเทอร์เน็ตไหม?</span>
            <HiOutlineChevronUp
              className={cx("min-w-5 h-5 w-5 text-slate-600 flex-shrink-0", {
                "rotate-180 transform": open,
              })}
            />
          </Disclosure.Button>

          <Disclosure.Panel
            className={cx(
              "px-6 pt-2 pb-4 text-sm text-slate-600 bg-slate-100 rounded-b-lg font-body whitespace-pre-wrap flex flex-col gap-4"
            )}
            as="pre"
          >
            <p>
              หน้างานยังไม่มีเน้ต ติดตั้งได้ตามปกติครับ กล้องบันทึกครบ
              ทำงานเต็มระบบ แต่จะยัง ไม่สามารถดูออนไลน์ผ่านมือถือได้ครับ
            </p>
            <b>ทำได้ 2 แบบครับ</b>
            <ul className="pl-4">
              <li>
                ติดตั้งกล้องก่อน พอเน้ตมา แอดมินโทรแนะนำ ทำพร้อมกัน 5
                นาทีเพื่อลงแอพผ่านมือถือครับ
              </li>
              <li>
                ติดตั้งเน้ตเสร้จแจ้งแอดมินเข้าไปติดตั้ง พร้อมลงแอพออนไลน์ครับ
              </li>
            </ul>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  </>
);
