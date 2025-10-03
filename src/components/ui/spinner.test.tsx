import React from "react";
import { render, screen } from "@testing-library/react";
import Spinner from "./spinner";
import { SPINNER_TESTID } from "@/tests/constants";

describe("Spinner", () => {
  it("renders without crashing", () => {
    render(<Spinner />);
    const spinnerElement = screen.getByTestId(SPINNER_TESTID);
    expect(spinnerElement).toBeInTheDocument();
  });

  it("applies default classes", () => {
    render(<Spinner />);
    const spinnerElement = screen.getByTestId(SPINNER_TESTID);
    expect(spinnerElement).toHaveClass("mr-2 inline size-4 animate-spin");
  });

  it("applies additional class names", () => {
    const newClass = "size-full";
    render(<Spinner className={newClass} />);
    const spinnerElement = screen.getByTestId(SPINNER_TESTID);
    expect(spinnerElement).toHaveClass(newClass);
  });
});
