import { render, screen, fireEvent } from "@testing-library/react";
import { QuantitySelector } from "@/components/public/product/QuantitySelector";

describe("QuantitySelector", () => {
  it("renders initial quantity of 1", () => {
    render(<QuantitySelector onChange={jest.fn()} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("increments quantity", () => {
    const onChange = jest.fn();
    render(<QuantitySelector onChange={onChange} />);
    const buttons = screen.getAllByRole("button");
    // buttons[0] = minus, buttons[1] = plus
    fireEvent.click(buttons[1]); // plus button
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("decrements quantity", () => {
    const onChange = jest.fn();
    render(<QuantitySelector onChange={onChange} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]); // increment to 2
    fireEvent.click(buttons[0]); // decrement back to 1
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it("does not go below 1", () => {
    const onChange = jest.fn();
    render(<QuantitySelector onChange={onChange} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]); // try decrement from 1
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});