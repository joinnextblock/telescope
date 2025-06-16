import { create_lunar } from "./index";

describe("Lunar", () => {
  it("should throw an error if the blockheight is not an integer", () => {
    expect(() => create_lunar(undefined)).toThrow("Blockheight must be an integer");
  });
  it("should throw an error if the blockheight is not an integer", () => {
    expect(() => create_lunar(1.5)).toThrow("Blockheight must be an integer");
  });

  it("should create a Lunar object with valid input", () => {
    const lunarInstance = create_lunar(0);
    expect(lunarInstance.get_blockheight()).toBe(0);
  });

  describe("phase", () => {
    it("should return correct lunar phase index", () => {
      const lunarInstance = create_lunar(0);
      expect(lunarInstance.get_phase_index()).toBe(0);
    });

    it("should return correct lunar phase index", () => {
      const lunarInstance = create_lunar(1);
      expect(lunarInstance.get_phase_block_height()).toBe(1);
    });
    it("should return correct lunar phase index", () => {
      const lunarInstance = create_lunar(505);
      expect(lunarInstance.get_phase_index()).toBe(1);
    });

    it("should return correct next lunar phase index", () => {
      const lunarInstance = create_lunar(0);
      expect(lunarInstance.get_next_phase_index()).toBe(1);
    });

    it("should return correct blocks until next lunar phase", () => {
      const lunarInstance = create_lunar(0);
      expect(lunarInstance.get_blocks_until_next_phase()).toBe(504);
    });
    it("should return correct blocks until next lunar phase", () => {
      const lunarInstance = create_lunar(504);
      expect(lunarInstance.get_blocks_until_next_phase()).toBe(504);
    });
  });
  describe("cycle", () => {
    it("should return correct lunar cycle index", () => {
      const lunarInstance = create_lunar(0);
      expect(lunarInstance.get_cycle_index()).toBe(0);
    });
    it("should return correct lunar cycle index", () => {
      const lunarInstance = create_lunar(505);
      expect(lunarInstance.get_cycle_index()).toBe(1);
    });
    it("should return correct blocks until next lunar cycle", () => {
      const lunarInstance = create_lunar(0);
      expect(lunarInstance.get_blocks_until_next_cycle()).toBe(4032);
    });
    it("should return correct blocks until next lunar cycle", () => {
      const lunarInstance = create_lunar(505);
      expect(lunarInstance.get_blocks_until_next_cycle()).toBe(3527);
    });
    it("should return correct lunar cycle block height", () => {
      const lunarInstance = create_lunar(0);
      expect(lunarInstance.get_cycle_block_height()).toBe(0);
    });
    it("should return correct lunar cycle block height", () => {
      const lunarInstance = create_lunar(505);
      expect(lunarInstance.get_cycle_block_height()).toBe(505);
    });
    it("should return correct lunar cycle block height", () => {
      const lunarInstance = create_lunar(4032);
      expect(lunarInstance.get_cycle_block_height()).toBe(0);
    });
    it("should return correct lunar cycle block height", () => {
      const lunarInstance = create_lunar(4033);
      expect(lunarInstance.get_cycle_block_height()).toBe(1);
    });
    it("should return correct next lunar cycle index", () => {
      const lunarInstance = create_lunar(0);
      expect(lunarInstance.get_next_cycle_index()).toBe(1);
    });
    it("should return correct next lunar cycle index", () => {
      const lunarInstance = create_lunar(4032);
      expect(lunarInstance.get_next_cycle_index()).toBe(1);
    });
  })
});