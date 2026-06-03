import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { createAdminUser, deleteAdminUser } from "@/actions/admin-users";
import { toast } from "sonner";

jest.mock("@/actions/admin-users", () => ({
  createAdminUser: jest.fn(),
  deleteAdminUser: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// Fix: mock ConfirmDialog supaya tidak pakai portal
jest.mock("@/components/ui/ConfirmDialog", () => ({
  ConfirmDialog: ({ open, onConfirm, onCancel, title }: any) =>
    open ? (
      <div>
        <p>{title}</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));

const mockUsers = [
  {
    id: "1",
    name: "Haraca Admin",
    email: "admin@haraca.id",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Admin Dua",
    email: "admin2@haraca.id",
    createdAt: new Date("2024-02-01"),
  },
];

describe("AdminUsersTable", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders user list", () => {
    render(<AdminUsersTable users={mockUsers} />);
    expect(screen.getByText("Haraca Admin")).toBeInTheDocument();
    expect(screen.getByText("admin@haraca.id")).toBeInTheDocument();
  });

  it("shows add admin form when button clicked", () => {
    render(<AdminUsersTable users={mockUsers} />);
    fireEvent.click(screen.getByText("Add New Admin"));
    expect(screen.getByText("Add New Admin", { selector: "h3" })).toBeInTheDocument();
  });

  it("hides form when cancel clicked", () => {
    render(<AdminUsersTable users={mockUsers} />);
    fireEvent.click(screen.getByText("Add New Admin"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByRole("heading", { name: "Add New Admin" })).not.toBeInTheDocument();
  });

  it("calls createAdminUser on form submit", async () => {
    (createAdminUser as jest.Mock).mockResolvedValue({
      success: true,
      admin: { name: "New Admin" },
    });

    render(<AdminUsersTable users={mockUsers} />);
    fireEvent.click(screen.getByText("Add New Admin"));

    // Cari semua input dan isi satu per satu
    // eslint-disable-next-line testing-library/no-node-access
    const allInputs = document.querySelectorAll("input");
    fireEvent.change(allInputs[0], { target: { value: "New Admin" } });
    fireEvent.change(allInputs[1], { target: { value: "new@haraca.id" } });
    fireEvent.change(allInputs[2], { target: { value: "password123" } });

    fireEvent.click(screen.getByText("Create Admin"));

    await waitFor(() => {
      expect(createAdminUser).toHaveBeenCalledWith({
        name: "New Admin",
        email: "new@haraca.id",
        password: "password123",
      });
      expect(toast.success).toHaveBeenCalledWith('Admin "New Admin" created');
    });
  });

  it("shows confirm dialog when delete icon clicked", () => {
    render(<AdminUsersTable users={mockUsers} />);
    // Delete pakai icon button, cari by title
    const deleteButtons = screen.getAllByTitle("Delete admin");
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText("Delete Admin")).toBeInTheDocument();
  });

  it("calls deleteAdminUser after confirm", async () => {
    (deleteAdminUser as jest.Mock).mockResolvedValue({ success: true });

    render(<AdminUsersTable users={mockUsers} />);
    const deleteButtons = screen.getAllByTitle("Delete admin");
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(deleteAdminUser).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Admin deleted");
    });
  });

  it("does not call deleteAdminUser when cancel clicked", async () => {
    render(<AdminUsersTable users={mockUsers} />);
    const deleteButtons = screen.getAllByTitle("Delete admin");
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(deleteAdminUser).not.toHaveBeenCalled();
    });
  });

  it("hides delete button when only one user", () => {
    render(<AdminUsersTable users={[mockUsers[0]]} />);
    expect(screen.queryByTitle("Delete admin")).not.toBeInTheDocument();
  });
});