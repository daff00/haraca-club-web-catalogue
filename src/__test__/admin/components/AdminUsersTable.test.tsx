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
    fireEvent.click(screen.getByText("+ Add New Admin"));
    expect(screen.getByText("Add New Admin")).toBeInTheDocument();
  });

  it("hides form when cancel clicked", () => {
    render(<AdminUsersTable users={mockUsers} />);
    fireEvent.click(screen.getByText("+ Add New Admin"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Add New Admin")).not.toBeInTheDocument();
  });

  it("calls createAdminUser on form submit", async () => {
    (createAdminUser as jest.Mock).mockResolvedValue({
      success: true,
      admin: { name: "New Admin" },
    });

    render(<AdminUsersTable users={mockUsers} />);
    fireEvent.click(screen.getByText("+ Add New Admin"));

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "New Admin" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "new@haraca.id" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

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

  it("shows confirm dialog when delete clicked", () => {
    render(<AdminUsersTable users={mockUsers} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("Delete Admin")).toBeInTheDocument();
  });

  it("calls deleteAdminUser after confirm", async () => {
    (deleteAdminUser as jest.Mock).mockResolvedValue({ success: true });

    render(<AdminUsersTable users={mockUsers} />);
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(deleteAdminUser).toHaveBeenCalledWith("2");
      expect(toast.success).toHaveBeenCalledWith("Admin deleted");
    });
  });

  it("hides delete button when only one user", () => {
    render(<AdminUsersTable users={[mockUsers[0]]} />);
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });
});