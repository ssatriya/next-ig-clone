import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import Test from "@/app/test/page";

test("renders a text", () => {
  render(<Test />);

  const text = screen.getByRole("paragraph");

  expect(text).toBeDefined();
});
