"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer = null,
  initialFocus,
  size = "md", // sm | md | lg | xl | fullscreen
  panelClassName = "",
  showClose = true,
}) {
  const sizeClass =
    size === "sm"
      ? "w-[95vw] sm:w-[400px]"
      : size === "md"
      ? "w-[90vw] sm:w-[500px] md:w-[600px]"
      : size === "lg"
      ? "w-[95vw] md:w-[800px]"
      : size === "xl"
      ? "w-[95vw] max-w-[1200px]"
      : "w-screen h-screen rounded-none"; // fullscreen

  // height rules
  const heightClass =
    size === "lg"
      ? "max-h-[90vh]"
      : size === "fullscreen"
      ? "h-screen"
      : "max-h-[80vh]";

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} initialFocus={initialFocus} className="fixed inset-0 z-[1000]">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[rgba(15,15,35,0.8)] backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-2 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-2 scale-95"
            >
              <Dialog.Panel
                className={`relative ${sizeClass} ${heightClass} overflow-hidden rounded-xl border border-[rgba(139,92,246,0.3)] bg-[rgba(26,26,46,0.95)] shadow-[0_25px_50px_rgba(0,0,0,0.5)] ${panelClassName}`}
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(26,26,46,0.95), rgba(26,26,46,0.95)), linear-gradient(45deg, #8B5CF6, #06B6D4)",
                  backgroundOrigin: "padding-box, border-box",
                  backgroundClip: "padding-box, border-box",
                }}
              >
                {(title || showClose) && (
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[rgba(26,26,46,0.95)]/90 px-6 py-4">
                    {title && (
                      <Dialog.Title className="text-[20px] font-semibold">
                        <span className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">{title}</span>
                      </Dialog.Title>
                    )}
                    {showClose && (
                      <button
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-md p-2 text-white/80 hover:text-white hover:bg-white/10"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}

                <div className="px-6 py-4 overflow-auto" style={{ maxHeight: "calc(80vh - 120px)" }}>
                  <div className="text-[16px] leading-[1.6] text-[#E2E8F0] space-y-5">
                    {children}
                  </div>
                </div>

                {footer && (
                  <div className="sticky bottom-0 z-10 border-t border-white/10 bg-[rgba(26,26,46,0.95)]/90 px-6 py-4">
                    <div className="flex justify-end gap-2">{footer}</div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}


