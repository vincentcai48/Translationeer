import { render, screen } from "@testing-library/react";
import React from "react";
import Index from "../pages/index";

test("Renders properly", () => {
  render(<Index />);
  const texts = screen.getAllByText(/Translationeer/i); //an array of all HTML elements in the DOM with the text "Translationeer"
  texts.forEach((t) => expect(t).toBeInTheDocument());
});