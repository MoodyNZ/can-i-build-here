import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Disclaimer } from "./Disclaimer";

describe("Disclaimer", () => {
  it("always renders the disclaimer", () => {
    render(<Disclaimer setbackMetres={3} maxCoverage={35} />);

    const note = screen.getByRole("note");
    expect(note).toBeInTheDocument();
    expect(note).toHaveTextContent(/not planning advice/i);
  });

  it("renders regardless of the figures passed in", () => {
    // The banner is mandatory, so it must show even with empty/zero values.
    render(<Disclaimer setbackMetres={0} maxCoverage={0} />);

    expect(screen.getByRole("note")).toBeInTheDocument();
  });
});
