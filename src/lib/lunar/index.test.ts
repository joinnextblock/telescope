import { create_lunar } from "./index";

describe("Lunar", () => {
  const blockheight = 901632;
  it("should throw an error if the blockheight is not an integer", () => {
    expect(() => create_lunar(undefined)).toThrow("Blockheight must be an integer");
  });
  it("should throw an error if the blockheight is not an integer", () => {
    expect(() => create_lunar(1.5)).toThrow("Blockheight must be an integer");
  });

  it("should create a Lunar object with valid input", () => {
    const lunarInstance = create_lunar(blockheight);
    expect(lunarInstance.get_blockheight()).toBe(blockheight);
  });

  describe("phase", () => {
    it("should return correct lunar phase index", () => {
      const lunarInstance = create_lunar(blockheight);
      expect(lunarInstance.get_phase_index()).toBe(4);
    });

    it("should return correct lunar phase index", () => {
      const lunarInstance = create_lunar(blockheight);
      expect(lunarInstance.get_phase_block_height()).toBe(blockheight % 504);
    });

    it("should return correct next lunar phase index", () => {
      const lunarInstance = create_lunar(blockheight);
      expect(lunarInstance.get_next_phase_index()).toBe(5);
    });

    it("should return correct blocks until next lunar phase", () => {
      const lunarInstance = create_lunar(blockheight);
      expect(lunarInstance.get_blocks_until_next_phase()).toBe(24);
    });

    it("should return correct lunar phase", () => {
      const lunarInstance = create_lunar(blockheight);
      expect(lunarInstance.get_phase().name).toBe("new");
    });
    it("should return correct next lunar phase", () => {
      const lunarInstance = create_lunar(blockheight);
      expect(lunarInstance.get_next_phase().name).toBe("waxing crescent");
    });
  });
  describe("cycle", () => {
    it("should return correct lunar cycle index", () => {
      const lunarInstance = create_lunar(blockheight);
      expect(lunarInstance.get_cycle_index()).toBe(2);
    });
    it("should return correct blocks until next lunar cycle", () => {
      const lunarInstance = create_lunar(blockheight);
      expect(lunarInstance.get_blocks_until_next_cycle()).toBe(1536);
    });
    it("should return correct lunar cycle block height", () => {
      const lunarInstance = create_lunar(blockheight);
      expect(lunarInstance.get_cycle_block_height()).toBe(2496);
    });
    it("should return correct next lunar cycle index", () => {
      const lunarInstance = create_lunar(blockheight);
      expect(lunarInstance.get_next_cycle_index()).toBe(3);
    });
    it("should return correct lunar cycle", () => {
      const lunarInstance = create_lunar(blockheight);
      expect(lunarInstance.get_cycle().name).toBe("Friend");
    });
    it("should return correct next lunar cycle", () => {
      const lunarInstance = create_lunar(blockheight);
      expect(lunarInstance.get_next_cycle().name).toBe("Whale");
    });
  })
});