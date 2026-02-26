// "use client";

import { SiLine } from "react-icons/si";
import cx from "classnames";
// import { Fragment, useState } from "react";
// import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";

interface LineButtonProps {
  title?: string;
  className?: string;
}
export const LineButton: React.FC<LineButtonProps> = ({
  title = "สั่งซื้อผ่าน LINE OA",
  className,
}) => {
  // let [isOpen, setIsOpen] = useState(false);

  // const closeModal = () => {
  //   setIsOpen(false);
  // };

  // const openModal = () => {
  //   setIsOpen(true);
  // };

  return (
    <>
      <Link
        type="button"
        target="_blank"
        id="cta-line-btn-dialog"
        className={cx(
          "inline-block text-center text-base font-nomal rounded-full focus:outline-none focus-visible:ring focus-visible:ring-opacity-50 transition duration-300 ease-in-out bg-line text-white hover:bg-opacity-90 ring-line w-full py-4 px-4",
          className
        )}
        href="https://lin.ee/s2DE4uk"
        // onClick={openModal}
      >
        <SiLine className="inline-block mr-2" size="1rem" />
        <p className="inline-block my-auto">{title}</p>
      </Link>
      {/* <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="flex flex-col text-center">
                    <h3 className="text-xl font-medium leading-6 text-slate-900">
                      ติดต่อเรา
                    </h3>
                    <div className="text-sm text-slate-700 font-normal">
                      เลือกบริการที่ต้องการ
                    </div>
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-2">
                    <Link
                      id="cta-line-btn-cctv"
                      className={cx(
                        "inline-block text-center text-base font-nomal rounded-full focus:outline-none focus-visible:ring focus-visible:ring-opacity-50 transition duration-300 ease-in-out bg-line text-white hover:bg-opacity-90 ring-line w-full py-4 px-4"
                      )}
                      href="https://lin.ee/s2DE4uk"
                    >
                      กล้องวงจรปิด
                    </Link>
                    <Link
                      id="cta-line-btn-autogate"
                      className={cx(
                        "inline-block text-center text-base font-nomal rounded-full focus:outline-none focus-visible:ring focus-visible:ring-opacity-50 transition duration-300 ease-in-out bg-line text-white hover:bg-opacity-90 ring-line w-full py-4 px-4"
                      )}
                      href="https://lin.ee/4eDwhQm"
                    >
                      ประตูอัตโนมัติ
                    </Link>
                    <Link
                      id="cta-line-btn-solar"
                      className={cx(
                        "inline-block text-center text-base font-nomal rounded-full focus:outline-none focus-visible:ring focus-visible:ring-opacity-50 transition duration-300 ease-in-out bg-line text-white hover:bg-opacity-90 ring-line w-full py-4 px-4"
                      )}
                      href="https://lin.ee/4Vj000P"
                    >
                      โซล่าเซลล์
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition> */}
    </>
  );
};
