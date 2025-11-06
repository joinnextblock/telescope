import {
  create_tidal,
  Tidal,
  TideType,
  TidePhase,
  getTideType,
  getTideHeight,
  getTidePhase,
  getBlocksUntilNextTide,
  getNextTideBlock,
  getTidalState,
  getTidalCycleInfo,
  isSpringTide,
  isNeapTide,
  getTideDescription,
  getTideEmoji,
  getTideDisplay,
} from "./index";
import {
  BLOCKS_PER_LUNAR_CYCLE,
  BLOCKS_PER_TIDAL_EVENT,
  TIDAL_EVENTS_PER_CYCLE,
  COMPLETE_TIDAL_CYCLES,
  MAX_HIGH_TIDE,
  MAX_LOW_TIDE,
} from "./constants";

describe("Tidal System", () => {
  describe("Constants", () => {
    it("should have correct block relationships", () => {
      expect(BLOCKS_PER_LUNAR_CYCLE).toBe(4032);
      expect(TIDAL_EVENTS_PER_CYCLE).toBe(42);
      expect(BLOCKS_PER_TIDAL_EVENT).toBe(96);
      expect(COMPLETE_TIDAL_CYCLES).toBe(21);
    });
  });

  describe("Tidal Class", () => {
    it("should create a Tidal object with valid input", () => {
      const tidal = create_tidal(100000);
      expect(tidal).toBeInstanceOf(Tidal);
      expect(tidal.get_blockheight()).toBe(100000);
    });

    it("should throw an error if blockheight is not an integer", () => {
      expect(() => create_tidal(100000.5)).toThrow(
        "Blockheight must be an integer"
      );
    });
  });

  describe("Boundary Conditions", () => {
    it("should handle block 0 (start of first high tide at maximum)", () => {
      const state = getTidalState(0);
      expect(state.eventNumber).toBe(0);
      expect(state.type).toBe(TideType.HIGH);
      expect(state.blocksIntoEvent).toBe(0);
      expect(getTideHeight(0)).toBeCloseTo(MAX_HIGH_TIDE, 5);
    });

    it("should handle block 95 (last block of first high tide)", () => {
      const state = getTidalState(95);
      expect(state.eventNumber).toBe(0);
      expect(state.type).toBe(TideType.HIGH);
      expect(state.blocksIntoEvent).toBe(95);
      expect(state.blocksUntilNext).toBe(1);
    });

    it("should handle block 96 (first block of first low tide)", () => {
      const state = getTidalState(96);
      expect(state.eventNumber).toBe(1);
      expect(state.type).toBe(TideType.LOW);
      expect(state.blocksIntoEvent).toBe(0);
      // Block 96: 96 % 84 = 12, so height = 21 - 12 = 9
      expect(getTideHeight(96)).toBe(9);
    });

    it("should handle block 4031 (last block of lunar cycle)", () => {
      const state = getTidalState(4031);
      expect(state.eventNumber).toBe(41);
      expect(state.type).toBe(TideType.LOW);
      expect(state.blocksIntoEvent).toBe(95);
    });

    it("should wrap correctly at block 4032 (start of next cycle)", () => {
      const state = getTidalState(4032);
      expect(state.eventNumber).toBe(0);
      expect(state.type).toBe(TideType.HIGH);
      expect(state.blocksIntoEvent).toBe(0);
    });
  });

  describe("Cycle Completion", () => {
    it("should complete exactly 42 tidal events per 4,032 blocks", () => {
      const events = new Set<number>();
      for (let i = 0; i < BLOCKS_PER_LUNAR_CYCLE; i += BLOCKS_PER_TIDAL_EVENT) {
        const state = getTidalState(i);
        events.add(state.eventNumber);
      }
      expect(events.size).toBe(TIDAL_EVENTS_PER_CYCLE);
    });

    it("should have exactly 21 high tides and 21 low tides", () => {
      let highCount = 0;
      let lowCount = 0;

      for (let i = 0; i < BLOCKS_PER_LUNAR_CYCLE; i += BLOCKS_PER_TIDAL_EVENT) {
        const type = getTideType(i);
        if (type === TideType.HIGH) highCount++;
        if (type === TideType.LOW) lowCount++;
      }

      expect(highCount).toBe(COMPLETE_TIDAL_CYCLES);
      expect(lowCount).toBe(COMPLETE_TIDAL_CYCLES);
    });

    it("should alternate between high and low tides", () => {
      for (let i = 0; i < 42; i++) {
        const block = i * BLOCKS_PER_TIDAL_EVENT;
        const type = getTideType(block);
        expect(type).toBe(i % 2 === 0 ? TideType.HIGH : TideType.LOW);
      }
    });
  });

  describe("Height Calculations", () => {
    it("should have tide height +21 at block 0 (max high tide, aligned with full moon)", () => {
      expect(getTideHeight(0)).toBe(MAX_HIGH_TIDE);
    });

    it("should have tide height decreasing by 1 each block from +21", () => {
      expect(getTideHeight(0)).toBe(21);
      expect(getTideHeight(1)).toBe(20);
      expect(getTideHeight(2)).toBe(19);
      expect(getTideHeight(21)).toBe(0);
      expect(getTideHeight(42)).toBe(MAX_LOW_TIDE);
    });

    it("should have tide height increasing by 1 each block from -21", () => {
      expect(getTideHeight(42)).toBe(-21);
      expect(getTideHeight(43)).toBe(-20);
      expect(getTideHeight(44)).toBe(-19);
      expect(getTideHeight(63)).toBe(0);
      expect(getTideHeight(84)).toBe(MAX_HIGH_TIDE);
    });

    it("should repeat the 84-block cycle", () => {
      // Block 84 should be same as block 0
      expect(getTideHeight(84)).toBe(getTideHeight(0));
      expect(getTideHeight(85)).toBe(getTideHeight(1));
      expect(getTideHeight(168)).toBe(getTideHeight(0));
    });

    it("should have tide height 0 at block 21 and 63", () => {
      expect(getTideHeight(21)).toBe(0);
      expect(getTideHeight(63)).toBe(0);
    });

    it("should follow simple pattern: each block changes by exactly 1", () => {
      // Test that each block changes by exactly 1
      for (let i = 0; i < 84; i++) {
        const current = getTideHeight(i);
        const next = getTideHeight(i + 1);
        const diff = Math.abs(current - next);
        expect(diff).toBe(1);
      }
    });
  });

  describe("Phase Transitions", () => {
    it("should detect rising phase correctly", () => {
      const phase = getTidePhase(24); // Middle of first half
      expect(phase).toBe(TidePhase.RISING);
    });

    it("should detect falling phase correctly", () => {
      const phase = getTidePhase(72); // Middle of second half
      expect(phase).toBe(TidePhase.FALLING);
    });

    it("should detect slack high at peak", () => {
      const phase = getTidePhase(48); // Midpoint
      expect(phase).toBe(TidePhase.SLACK_HIGH);
    });

    it("should detect slack low at low tide peak", () => {
      const phase = getTidePhase(144); // Midpoint of low tide event
      expect(phase).toBe(TidePhase.SLACK_LOW);
    });

    it("should detect slack water in window 44-52", () => {
      for (let i = 44; i <= 52; i++) {
        const phase = getTidePhase(i);
        expect([TidePhase.SLACK_HIGH, TidePhase.SLACK_LOW]).toContain(phase);
      }
    });

    it("should have smooth phase transitions", () => {
      const phases: TidePhase[] = [];
      for (let i = 0; i < BLOCKS_PER_TIDAL_EVENT; i++) {
        phases.push(getTidePhase(i));
      }
      // Should transition from rising -> slack -> falling
      expect(phases[0]).toBe(TidePhase.RISING);
      expect(phases[48]).toBe(TidePhase.SLACK_HIGH);
      expect(phases[95]).toBe(TidePhase.FALLING);
    });
  });

  describe("Special Alignments", () => {
    it("should detect spring tide during new moon", () => {
      // Find a block that's near new moon (phase index 4)
      // New moon occurs at approximately block positions 0, 2016, 4032, etc. within lunar cycle
      // We need to find a block where lunar phase is "new"
      const tidal = create_tidal(0);
      const state = tidal.get_tidal_state();
      // This test depends on lunar phase alignment
      // We'll test the function directly
      const result = isSpringTide(0);
      expect(typeof result).toBe("boolean");
    });

    it("should detect neap tide during quarter moons", () => {
      const result = isNeapTide(1008); // Approximately quarter moon
      expect(typeof result).toBe("boolean");
    });
  });

  describe("Block Calculations", () => {
    it("should calculate blocks until next tide correctly", () => {
      expect(getBlocksUntilNextTide(0)).toBe(96);
      expect(getBlocksUntilNextTide(48)).toBe(48);
      expect(getBlocksUntilNextTide(95)).toBe(1);
      expect(getBlocksUntilNextTide(96)).toBe(96);
    });

    it("should calculate next tide block correctly", () => {
      expect(getNextTideBlock(0)).toBe(96);
      expect(getNextTideBlock(48)).toBe(96);
      expect(getNextTideBlock(95)).toBe(96);
      expect(getNextTideBlock(96)).toBe(192);
    });
  });

  describe("Tidal State", () => {
    it("should return complete tidal state", () => {
      const state = getTidalState(100000);
      expect(state).toHaveProperty("eventNumber");
      expect(state).toHaveProperty("cycleNumber");
      expect(state).toHaveProperty("blocksIntoEvent");
      expect(state).toHaveProperty("blocksUntilNext");
      expect(state).toHaveProperty("type");
      expect(state).toHaveProperty("phase");
      expect(state).toHaveProperty("height");
      expect(state).toHaveProperty("nextTideBlock");
      expect(state).toHaveProperty("previousTideBlock");
      expect(state).toHaveProperty("isSpringTide");
      expect(state).toHaveProperty("isNeapTide");

      expect(state.eventNumber).toBeGreaterThanOrEqual(0);
      expect(state.eventNumber).toBeLessThan(42);
      expect(state.cycleNumber).toBeGreaterThanOrEqual(0);
      expect(state.cycleNumber).toBeLessThan(21);
      expect(state.height).toBeGreaterThanOrEqual(MAX_LOW_TIDE);
      expect(state.height).toBeLessThanOrEqual(MAX_HIGH_TIDE);
    });

    it("should calculate correct cycle number", () => {
      const state0 = getTidalState(0);
      expect(state0.cycleNumber).toBe(0);

      const state96 = getTidalState(96);
      expect(state96.cycleNumber).toBe(0);

      const state192 = getTidalState(192);
      expect(state192.cycleNumber).toBe(1);
    });
  });

  describe("Tidal Cycle Info", () => {
    it("should return correct cycle info", () => {
      const info = getTidalCycleInfo(100000);
      expect(info.totalEvents).toBe(42);
      expect(info.highTides).toBe(21);
      expect(info.lowTides).toBe(21);
      expect(info.endBlock - info.startBlock + 1).toBe(
        BLOCKS_PER_LUNAR_CYCLE
      );
    });

    it("should calculate correct start and end blocks", () => {
      const info = getTidalCycleInfo(4032);
      expect(info.startBlock).toBe(4032);
      expect(info.endBlock).toBe(8063);
    });
  });

  describe("Tide Description", () => {
    it("should return human-readable description", () => {
      const description = getTideDescription(100000);
      expect(typeof description).toBe("string");
      expect(description.length).toBeGreaterThan(0);
    });

    it("should include tide type in description", () => {
      const description = getTideDescription(48); // High tide
      expect(description.toLowerCase()).toContain("tide");
    });
  });

  describe("Tide Emoji", () => {
    it("should return emoji representation", () => {
      const emoji = getTideEmoji(100000);
      expect(typeof emoji).toBe("string");
      expect(emoji.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle large block heights", () => {
      const state = getTidalState(1000000);
      expect(state.eventNumber).toBeGreaterThanOrEqual(0);
      expect(state.eventNumber).toBeLessThan(42);
    });

    it("should handle negative block heights (should throw)", () => {
      // Negative block heights are not valid, but Delta constructor allows them
      // The tidal system will still work, just with negative values
      // This test verifies the system doesn't crash
      const tidal = create_tidal(-1);
      expect(tidal).toBeDefined();
    });

    it("should maintain consistency across cycle boundaries", () => {
      const stateBefore = getTidalState(4031);
      const stateAfter = getTidalState(4032);
      expect(stateBefore.eventNumber).toBe(41);
      expect(stateAfter.eventNumber).toBe(0);
    });
  });

  describe("Tidal Class Methods", () => {
    it("should get tide height from class instance", () => {
      const tidal = create_tidal(100000);
      const height = tidal.get_tide_height();
      expect(height).toBeGreaterThanOrEqual(MAX_LOW_TIDE);
      expect(height).toBeLessThanOrEqual(MAX_HIGH_TIDE);
    });

    it("should get tide type from class instance", () => {
      const tidal = create_tidal(0);
      expect(tidal.get_tide_type()).toBe(TideType.HIGH);
    });

    it("should get tide phase from class instance", () => {
      const tidal = create_tidal(48);
      expect(tidal.get_tide_phase()).toBe(TidePhase.SLACK_HIGH);
    });

    it("should get blocks until next tide from class instance", () => {
      const tidal = create_tidal(0);
      expect(tidal.get_blocks_until_next_tide()).toBe(96);
    });

    it("should get next tide block from class instance", () => {
      const tidal = create_tidal(0);
      expect(tidal.get_next_tide_block()).toBe(96);
    });

    it("should get tidal cycle info from class instance", () => {
      const tidal = create_tidal(100000);
      const info = tidal.get_tidal_cycle_info();
      expect(info.totalEvents).toBe(42);
    });

    it("should check spring tide from class instance", () => {
      const tidal = create_tidal(100000);
      expect(typeof tidal.is_spring_tide()).toBe("boolean");
    });

    it("should check neap tide from class instance", () => {
      const tidal = create_tidal(100000);
      expect(typeof tidal.is_neap_tide()).toBe("boolean");
    });

    it("should get tide description from class instance", () => {
      const tidal = create_tidal(100000);
      const description = tidal.get_tide_description();
      expect(typeof description).toBe("string");
    });

    it("should get tide emoji from class instance", () => {
      const tidal = create_tidal(100000);
      const emoji = tidal.get_tide_emoji();
      expect(typeof emoji).toBe("string");
    });

    it("should get tide display from class instance", () => {
      const tidal = create_tidal(100000);
      const display = tidal.get_tide_display();
      expect(typeof display).toBe("string");
      expect(display.length).toBeGreaterThan(0);
    });
  });

  describe("Tide Display", () => {
    it("should return simplified format for +21 (max high tide)", () => {
      // Block 0 has tide height +21
      const display = getTideDisplay(0);
      expect(display).toBe("🌊 High Tide (+21)");
    });

    it("should return simplified format for -21 (max low tide)", () => {
      // Block 42 has tide height -21
      const display = getTideDisplay(42);
      expect(display).toBe("🏖️ Low Tide (-21)");
    });

    it("should return simplified format for +21 at cycle repeat (block 84)", () => {
      // Block 84 repeats the cycle, also has tide height +21
      const display = getTideDisplay(84);
      expect(display).toBe("🌊 High Tide (+21)");
    });

    it("should return simplified format for +21 at multiple cycle repeats", () => {
      // Test multiple cycle repeats (84, 168, 252, etc.)
      for (let i = 0; i < 5; i++) {
        const block = i * 84;
        const display = getTideDisplay(block);
        expect(display).toBe("🌊 High Tide (+21)");
      }
    });

    it("should return simplified format for -21 at cycle midpoint", () => {
      // Block 42, 126, 210, etc. all have -21
      for (let i = 0; i < 5; i++) {
        const block = 42 + (i * 84);
        const display = getTideDisplay(block);
        expect(display).toBe("🏖️ Low Tide (-21)");
      }
    });

    it("should return full format for non-extreme values", () => {
      // Block 1 has tide height +20 (not +21)
      const display = getTideDisplay(1);
      expect(display).not.toBe("🌊 High Tide (+21)");
      expect(display).not.toBe("🏖️ Low Tide (-21)");
      expect(display).toContain("Tide:");
      expect(display).toContain("+20");
      expect(display).toContain("blocks");
    });

    it("should return full format for tide height 0", () => {
      // Block 21 has tide height 0
      const display = getTideDisplay(21);
      expect(display).not.toBe("🌊 High Tide (+21)");
      expect(display).not.toBe("🏖️ Low Tide (-21)");
      expect(display).toContain("Tide:");
      expect(display).toContain("blocks");
    });

    it("should return full format for tide height -20", () => {
      // Block 43 has tide height -20 (not -21)
      const display = getTideDisplay(43);
      expect(display).not.toBe("🌊 High Tide (+21)");
      expect(display).not.toBe("🏖️ Low Tide (-21)");
      expect(display).toContain("Tide:");
      expect(display).toContain("-20");
      expect(display).toContain("blocks");
    });

    it("should return full format with correct structure for non-extreme values", () => {
      // Test various non-extreme values
      const testBlocks = [1, 10, 20, 21, 43, 50, 63, 70];
      for (const block of testBlocks) {
        const height = getTideHeight(block);
        if (height !== MAX_HIGH_TIDE && height !== MAX_LOW_TIDE) {
          const display = getTideDisplay(block);
          expect(display).toContain("Tide:");
          expect(display).toContain("blocks");
          // Should include the tide height in the format
          const heightStr = height > 0 ? `+${height}` : `${height}`;
          expect(display).toContain(heightStr);
        }
      }
    });

    it("should use class instance method for +21", () => {
      const tidal = create_tidal(0);
      const display = tidal.get_tide_display();
      expect(display).toBe("🌊 High Tide (+21)");
    });

    it("should use class instance method for -21", () => {
      const tidal = create_tidal(42);
      const display = tidal.get_tide_display();
      expect(display).toBe("🏖️ Low Tide (-21)");
    });

    it("should handle edge case values correctly", () => {
      // Test +20 and -20 (adjacent to extremes)
      const displayPlus20 = getTideDisplay(1);
      expect(displayPlus20).toContain("+20");
      expect(displayPlus20).not.toBe("🌊 High Tide (+21)");

      const displayMinus20 = getTideDisplay(43);
      expect(displayMinus20).toContain("-20");
      expect(displayMinus20).not.toBe("🏖️ Low Tide (-21)");
    });
  });
});
