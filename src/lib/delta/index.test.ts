import { create_delta } from "./index";

describe("Delta", () => {
  it("should throw an error if the blockheight is not an integer", () => {
    expect(() => create_delta(100000.5)).toThrow("Blockheight must be an integer");
  });

  it("should throw an error if the blockheight is not a number", () => {
    expect(() => create_delta("100000" as unknown as number)).toThrow("Blockheight must be an integer");
  });

  it("should create a Delta object with valid input", () => {
    const deltaInstance = create_delta(100000);
    expect(deltaInstance.get_blockheight()).toBe(100000);
  });

  it("should get the correct delta", () => {
    const deltaInstance = create_delta(100000);
    expect(deltaInstance.t(100000)).toBe(0);
  });

  it("should get the correct delta", () => {
    const deltaInstance = create_delta(100000);
    expect(deltaInstance.t(100001)).toBe(-1);
  });

  it("should get the correct delta", () => {
    const deltaInstance = create_delta(100000);
    expect(deltaInstance.t(99999)).toBe(1);
  });

  it("should get the correct delta", () => {
    const deltaInstance1 = create_delta();
    const deltaInstance2 = create_delta(100000);
    expect(deltaInstance1.t(deltaInstance2)).toBe(-100000);
  });

  it("should get the correct delta", () => {
    const deltaInstance1 = create_delta();
    expect(deltaInstance1.t(100000)).toBe(-100000);
  });

  it("should get the correct blockheight from date", () => {
    const deltaInstance = create_delta(100000);
    const date = new Date("2025-01-01");
    expect(deltaInstance.get_blockheight_from_date(date)).toBe(841138);
  });

    it("should format the date correctly", () => {
      const deltaInstance = create_delta(210000); // Exactly 1 halving
      const formattedDate = deltaInstance.get_formatted_date(0, 1, 100);
      expect(formattedDate).toBe("AG_1_1_2_0100");
    });

    it("should format the date correctly for genesis block", () => {
      const deltaInstance = create_delta(0);
      const formattedDate = deltaInstance.get_formatted_date(0, 0, 0);
      expect(formattedDate).toBe("AG_0_1_1_0000");
    });

    it("should format the date correctly for multiple halvings", () => {
      const deltaInstance = create_delta(630000); // 3 halvings
      const formattedDate = deltaInstance.get_formatted_date(2, 3, 500);
      expect(formattedDate).toBe("AG_3_3_4_0500");
    });

    it("should format the date correctly with max position in cycle", () => {
      const deltaInstance = create_delta(210000);
      const formattedDate = deltaInstance.get_formatted_date(0, 1, 4032);
      expect(formattedDate).toBe("AG_1_1_2_4032");
    });

    it("should pad single digit position with zeros", () => {
      const deltaInstance = create_delta(100000);
      const formattedDate = deltaInstance.get_formatted_date(0, 0, 5);
      expect(formattedDate).toBe("AG_0_1_1_0005");
    });

});