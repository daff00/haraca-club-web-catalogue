import "@testing-library/jest-dom";
import * as React from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => {
    const imageSrc = typeof src === "string" ? src : src?.src || "";
    const imageProps: Record<string, unknown> = {
      src: imageSrc,
      alt,
      ...props,
    };

    if (fill) {
      imageProps.style = {
        ...(props.style || {}),
        position: "absolute",
        width: "100%",
        height: "100%",
        inset: 0,
      };
    }

    return React.createElement("img", imageProps);
  },
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
});