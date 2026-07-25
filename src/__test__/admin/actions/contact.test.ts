import { getContactInfo, updateContactInfo } from "@/actions/contact";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    contactInfo: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("@/lib/auth", () => ({
  getSession: jest.fn(() =>
    Promise.resolve({ user: { email: "admin@haraca.id" } })
  ),
}));

const mockContact = {
  id: "singleton",
  whatsapp: "628123456789",
  instagram: "@haraca",
  tiktok: "@haraca",
  shopee: "https://shopee.co.id/haraca",
  tokopedia: "https://tokopedia.com/haraca",
  email: null,
  operatingHours: {
    weekdays: "Monday – Saturday: 09.00 – 18.00 WIB",
    weekend: "Sunday: Slow response",
  },
};

const validInput = {
  whatsapp: "628123456789",
  instagram: "@haraca",
  tiktok: "@haraca",
  shopee: "https://shopee.co.id/haraca",
  tokopedia: "https://tokopedia.com/haraca",
  email: "",
  operatingHours: {
    weekdays: "Monday – Saturday: 09.00 – 18.00 WIB",
    weekend: "Sunday: Slow response",
  },
};

describe("Contact Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getContactInfo", () => {
    it("returns contact info", async () => {
      (prisma.contactInfo.findFirst as jest.Mock).mockResolvedValue(
        mockContact
      );

      const result = await getContactInfo();
      expect(result?.whatsapp).toBe("628123456789");
    });

    it("returns null when no contact info exists", async () => {
      (prisma.contactInfo.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await getContactInfo();
      expect(result).toBeNull();
    });
  });

  describe("updateContactInfo", () => {
    it("creates contact info when none exists", async () => {
      (prisma.contactInfo.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.contactInfo.create as jest.Mock).mockResolvedValue(mockContact);

      const result = await updateContactInfo(validInput);

      expect(result.success).toBe(true);
      expect(prisma.contactInfo.create).toHaveBeenCalled();
      expect(prisma.contactInfo.update).not.toHaveBeenCalled();
    });

    it("updates contact info when it exists", async () => {
      (prisma.contactInfo.findFirst as jest.Mock).mockResolvedValue(
        mockContact
      );
      (prisma.contactInfo.update as jest.Mock).mockResolvedValue(mockContact);

      const result = await updateContactInfo(validInput);

      expect(result.success).toBe(true);
      expect(prisma.contactInfo.update).toHaveBeenCalledWith({
        where: { id: "singleton" },
        data: expect.any(Object),
      });
      expect(prisma.contactInfo.create).not.toHaveBeenCalled();
    });

    it("throws when not authenticated", async () => {
      const { getSession } = require("@/lib/auth");
      getSession.mockResolvedValueOnce(null);

      await expect(updateContactInfo(validInput)).rejects.toThrow(
        "Unauthorized"
      );
    });

    it("throws on invalid input", async () => {
      await expect(
        updateContactInfo({ ...validInput, whatsapp: "" })
      ).rejects.toThrow();
    });
  });
});