"use client";

import Link from "next/link";
import Head from "next/head";
import { useEffect, useRef } from "react";

export default function NotFound() {
  const decorativeTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (decorativeTextRef.current) {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        decorativeTextRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <Head>
        <title>404 - Page Not Found | HARACA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="not-found-container">

        {/* Main Content */}
        <main className="min-h-[819px] flex flex-col items-center justify-center px-gutter py-section-v-desktop relative overflow-hidden">
          {/* Decorative Background Element with Parallax */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <span
              ref={decorativeTextRef}
              className="font-display text-[20rem] md:text-[35rem] leading-none text-border-beige opacity-20 select-none"
            >
              404
            </span>
          </div>

          {/* Typography Centric Content */}
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-component-gap-lg">
            <div className="space-y-component-gap-md">
              <p className="font-label text-label text-text-camel tracking-[0.2em] uppercase">
                Page not found
              </p>
              <h1 className="font-headline-lg text-headline-lg md:text-[64px] text-near-black leading-tight">
                Looks like this page <br className="hidden md:block" /> got lost
                in the collection.
              </h1>
              <p className="font-body text-body text-on-surface-variant max-w-md mx-auto italic">
                The path you are looking for has been moved or curated out.
                Like a seasonal silhouette, it remains only in memory.
              </p>
            </div>

            {/* CTA Cluster */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-component-gap-md pt-component-gap-lg">
              <Link
                href="/"
                className="bg-primary-container text-background px-8 py-3.5 font-label text-label transition-all duration-300 hover:bg-near-black active:scale-95 w-full md:w-auto text-center border border-primary-container"
              >
                RETURN HOME
              </Link>
              <Link
                href="/shop"
                className="border border-border-beige text-primary px-8 py-3.5 font-label text-label transition-all duration-300 hover:bg-surface-cream active:scale-95 w-full md:w-auto text-center"
              >
                SHOP COLLECTION
              </Link>
            </div>
          </div>

          {/* Asymmetric Decorative Image */}
          <div className="hidden lg:block absolute bottom-0 right-[5%] w-64 h-80 opacity-80 translate-y-12 rotate-3 hover:rotate-0 transition-transform duration-700">
            <img
              alt="Minimalist Interior"
              className="w-full h-full object-cover grayscale brightness-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWrL2U6Z1xwEiXHcB0TeORjVwberr6XEZRMLdHn_NWz5HIXON98evUP7Bhe9U0WvVOrxt8QtssJr_vd0MSA-U3u8XdwtFUbtmRkXr_PvEk_IFFrlyqCwDJWgvRKU6fstLE0z7Il7hVuimu9E_DcCbblDQuD2lvOoZcyP-KdjEelQ43yXqZ0NCJw65B4SqGESS9XLGQqr0-3tjMBreAQLqpLt_gzaG7p30hKD6Uxl34xPnw3JlWIwhr_hMSNw3DRewnI8bOCcgMjvcf"
            />
          </div>
        </main>
      </div>

      <style jsx global>{`
        /* Custom utility classes to match the original HTML design */
        .bg-background {
          background-color: #fcf9f4;
        }
        .bg-primary-container {
          background-color: #2c2824;
        }
        .bg-near-black {
          background-color: #1a1714;
        }
        .bg-surface-cream {
          background-color: #f0ebe0;
        }
        .text-primary {
          color: #171410;
        }
        .text-background {
          color: #fcf9f4;
        }
        .text-text-camel {
          color: #8c7155;
        }
        .text-near-black {
          color: #1a1714;
        }
        .text-on-surface-variant {
          color: #4c463f;
        }
        .text-surface-linen {
          color: #f5efe6;
        }
        .text-surface-dim {
          color: #dcdad5;
        }
        .text-border-beige {
          color: #d9cebf;
        }
        .border-border-beige {
          border-color: #d9cebf;
        }
        .border-primary-container {
          border-color: #2c2824;
        }
        .hover\:bg-near-black:hover {
          background-color: #1a1714;
        }
        .hover\:bg-surface-cream:hover {
          background-color: #f0ebe0;
        }
        .hover\:text-accent-sand:hover {
          color: #c4ad94;
        }
        .font-display,
        .font-headline-lg {
          font-family: "Cormorant Garamond", serif;
        }
        .font-body,
        .font-caption,
        .font-label {
          font-family: "DM Sans", sans-serif;
        }
        .text-headline-md {
          font-size: 32px;
          line-height: 1.3;
          font-weight: 500;
        }
        .text-headline-sm {
          font-size: 22px;
          line-height: 1.4;
          font-weight: 500;
        }
        .text-label {
          font-size: 14px;
          line-height: 1;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
        .text-body {
          font-size: 16px;
          line-height: 1.6;
          font-weight: 400;
        }
        .text-caption {
          font-size: 12px;
          line-height: 1.4;
          font-weight: 400;
        }
        .text-headline-lg {
          font-size: 48px;
          line-height: 1.2;
          font-weight: 500;
        }
        @media (min-width: 768px) {
          .text-headline-lg.md\:text-\\[64px\\] {
            font-size: 64px;
          }
        }
        .px-gutter {
          padding-left: 24px;
          padding-right: 24px;
        }
        .py-component-gap-md {
          padding-top: 16px;
          padding-bottom: 16px;
        }
        .py-section-v-desktop {
          padding-top: 80px;
          padding-bottom: 80px;
        }
        .pt-component-gap-lg {
          padding-top: 24px;
        }
        .pb-component-gap-md {
          padding-bottom: 16px;
        }
        .gap-component-gap-xs {
          gap: 4px;
        }
        .gap-component-gap-sm {
          gap: 8px;
        }
        .gap-component-gap-md {
          gap: 16px;
        }
        .gap-component-gap-lg {
          gap: 24px;
        }
        .space-y-component-gap-md > :not(:last-child) {
          margin-bottom: 16px;
        }
        .space-y-component-gap-lg > :not(:last-child) {
          margin-bottom: 24px;
        }
        .mb-component-gap-lg {
          margin-bottom: 24px;
        }
        .max-w-container-max {
          max-width: 1280px;
        }
        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }
        .tracking-\\[0\\.2em\\] {
          letter-spacing: 0.2em;
        }
        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24;
        }
        .text-outline-decorative {
          -webkit-text-stroke: 1px #d9cebf;
          color: transparent;
        }
        .rotate-3 {
          transform: rotate(3deg);
        }
        .hover\:rotate-0:hover {
          transform: rotate(0deg);
        }
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .transition-transform {
          transition-property: transform;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .duration-300 {
          transition-duration: 300ms;
        }
        .duration-700 {
          transition-duration: 700ms;
        }
        .duration-200 {
          transition-duration: 200ms;
        }
        .active\:scale-95:active {
          transform: scale(0.95);
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .pointer-events-none {
          pointer-events: none;
        }
        .select-none {
          user-select: none;
        }
        .opacity-20 {
          opacity: 0.2;
        }
        .opacity-80 {
          opacity: 0.8;
        }
        .opacity-50 {
          opacity: 0.5;
        }
        .z-0 {
          z-index: 0;
        }
        .z-10 {
          z-index: 10;
        }
        .z-50 {
          z-index: 50;
        }
        .sticky {
          position: sticky;
        }
        .absolute {
          position: absolute;
        }
        .relative {
          position: relative;
        }
        .fixed {
          position: fixed;
        }
        .inset-0 {
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
        .bottom-0 {
          bottom: 0;
        }
        .right-\\[5\\%\\] {
          right: 5%;
        }
        .top-0 {
          top: 0;
        }
        .w-full {
          width: 100%;
        }
        .w-64 {
          width: 16rem;
        }
        .w-auto {
          width: auto;
        }
        .max-w-2xl {
          max-width: 42rem;
        }
        .max-w-md {
          max-width: 28rem;
        }
        .max-w-xs {
          max-width: 20rem;
        }
        .h-80 {
          height: 20rem;
        }
        .min-h-\\[819px\\] {
          min-height: 819px;
        }
        .flex {
          display: flex;
        }
        .grid {
          display: grid;
        }
        .hidden {
          display: none;
        }
        .flex-col {
          flex-direction: column;
        }
        .items-center {
          align-items: center;
        }
        .items-start {
          align-items: flex-start;
        }
        .justify-center {
          justify-content: center;
        }
        .justify-between {
          justify-content: space-between;
        }
        .gap-3 {
          gap: 0.75rem;
        }
        .space-y-4 > :not(:last-child) {
          margin-bottom: 1rem;
        }
        .grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .flex-wrap {
          flex-wrap: wrap;
        }
        .text-center {
          text-align: center;
        }
        .uppercase {
          text-transform: uppercase;
        }
        .italic {
          font-style: italic;
        }
        .leading-tight {
          line-height: 1.25;
        }
        .leading-none {
          line-height: 1;
        }
        .text-\\[20rem\\] {
          font-size: 20rem;
        }
        .md\\:text-\\[35rem\\] {
          font-size: 35rem;
        }
        .object-cover {
          object-fit: cover;
        }
        .grayscale {
          filter: grayscale(100%);
        }
        .brightness-105 {
          filter: brightness(1.05);
        }
        .translate-y-12 {
          transform: translateY(3rem);
        }
        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }
        .border {
          border-width: 1px;
        }
        .border-t {
          border-top-width: 1px;
        }
        .border-white\\/5 {
          border-color: rgba(255, 255, 255, 0.05);
        }
        @media (min-width: 768px) {
          .md\\:block {
            display: block;
          }
          .md\\:flex {
            display: flex;
          }
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .md\\:flex-row {
            flex-direction: row;
          }
          .md\\:text-left {
            text-align: left;
          }
          .md\\:text-\\[64px\\] {
            font-size: 64px;
          }
        }
        @media (min-width: 1024px) {
          .lg\\:block {
            display: block;
          }
        }
        body {
          background-color: #fcf9f4;
          margin: 0;
        }
        .not-found-container {
          background-color: #fcf9f4;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        main {
          flex: 1;
        }
      `}</style>
    </>
  );
}