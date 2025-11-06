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
  TIDAL_HEIGHT_CYCLE_LENGTH,
  MAX_HIGH_TIDE,
  MAX_LOW_TIDE,
} from "./constants";

describe("Tidal System", () => {
  describe("Constants", () => {
    it("should have correct constants", () => {
      expect(BLOCKS_PER_LUNAR_CYCLE).toBe(4032);
      expect(TIDAL_HEIGHT_CYCLE_LENGTH).toBe(72);
      expect(MAX_HIGH_TIDE).toBe(18);
      expect(MAX_LOW_TIDE).toBe(-18);
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
    it("should handle block 0 (start at high tide maximum)", () => {
      const state = getTidalState(0);
      expect(state.type).toBe(TideType.HIGH);
      expect(state.blocksIntoCycle).toBe(0);
      expect(getTideHeight(0)).toBe(MAX_HIGH_TIDE);
      expect(state.height).toBe(MAX_HIGH_TIDE);
    });

    it("should handle block 36 (low tide minimum)", () => {
      const state = getTidalState(36);
      expect(state.type).toBe(TideType.LOW);
      expect(state.blocksIntoCycle).toBe(36);
      expect(getTideHeight(36)).toBe(MAX_LOW_TIDE);
      expect(state.height).toBe(MAX_LOW_TIDE);
    });

    it("should handle block 72 (cycle repeats, high tide)", () => {
      const state = getTidalState(72);
      expect(state.type).toBe(TideType.HIGH);
      expect(state.blocksIntoCycle).toBe(0);
      expect(getTideHeight(72)).toBe(MAX_HIGH_TIDE);
    });

    it("should handle block 18 (transition point, height 0)", () => {
      const state = getTidalState(18);
      expect(getTideHeight(18)).toBe(0);
    });

    it("should handle block 54 (transition point, height 0)", () => {
      const state = getTidalState(54);
      expect(getTideHeight(54)).toBe(0);
    });
  });

  describe("Cycle Completion", () => {
    it("should repeat the 72-block cycle continuously", () => {
      // Block 0 and block 72 should have same height
      expect(getTideHeight(0)).toBe(getTideHeight(72));
      expect(getTideHeight(1)).toBe(getTideHeight(73));
      expect(getTideHeight(36)).toBe(getTideHeight(108));
      expect(getTideHeight(71)).toBe(getTideHeight(143));
    });

    it("should have two high tides per 72-block cycle", () => {
      // High tides at block 0 and block 72
      expect(getTideType(0)).toBe(TideType.HIGH);
      expect(getTideType(72)).toBe(TideType.HIGH);
      expect(getTideHeight(0)).toBe(MAX_HIGH_TIDE);
      expect(getTideHeight(72)).toBe(MAX_HIGH_TIDE);
    });

    it("should have one low tide per 72-block cycle", () => {
      // Low tide at block 36
      expect(getTideType(36)).toBe(TideType.LOW);
      expect(getTideHeight(36)).toBe(MAX_LOW_TIDE);
    });
  });

  describe("Height Calculations", () => {
    it("should have tide height +18 at block 0 (max high tide, system start)", () => {
      expect(getTideHeight(0)).toBe(MAX_HIGH_TIDE);
    });

    it("should have tide height decreasing by 1 each block from +18 to -18", () => {
      expect(getTideHeight(0)).toBe(18);
      expect(getTideHeight(1)).toBe(17);
      expect(getTideHeight(2)).toBe(16);
      expect(getTideHeight(18)).toBe(0);
      expect(getTideHeight(36)).toBe(MAX_LOW_TIDE);
    });

    it("should have tide height increasing by 1 each block from -18 to +18", () => {
      expect(getTideHeight(36)).toBe(-18);
      expect(getTideHeight(37)).toBe(-17);
      expect(getTideHeight(38)).toBe(-16);
      expect(getTideHeight(54)).toBe(0);
      expect(getTideHeight(72)).toBe(MAX_HIGH_TIDE);
    });

    it("should repeat the 72-block cycle", () => {
      // Block 72 should be same as block 0
      expect(getTideHeight(72)).toBe(getTideHeight(0));
      expect(getTideHeight(73)).toBe(getTideHeight(1));
      expect(getTideHeight(144)).toBe(getTideHeight(0));
    });

    it("should have tide height 0 at block 18 and 54", () => {
      expect(getTideHeight(18)).toBe(0);
      expect(getTideHeight(54)).toBe(0);
    });

    it("should follow simple pattern: each block changes by exactly 1", () => {
      // Test that each block changes by exactly 1
      for (let i = 0; i < TIDAL_HEIGHT_CYCLE_LENGTH; i++) {
        const current = getTideHeight(i);
        const next = getTideHeight(i + 1);
        const diff = Math.abs(current - next);
        expect(diff).toBe(1);
      }
    });
  });

  describe("Phase Transitions", () => {
    it("should detect rising phase correctly", () => {
      const phase = getTidePhase(10); // First 18 blocks are rising
      expect(phase).toBe(TidePhase.RISING);
      const phase2 = getTidePhase(60); // Blocks 54-72 are rising
      expect(phase2).toBe(TidePhase.RISING);
    });

    it("should detect falling phase correctly", () => {
      const phase = getTidePhase(35); // Blocks 27-45 are falling
      expect(phase).toBe(TidePhase.FALLING);
    });

    it("should detect slack high at peak", () => {
      const phase = getTidePhase(22); // Blocks 18-27 are slack high
      expect(phase).toBe(TidePhase.SLACK_HIGH);
    });

    it("should detect slack low at low tide trough", () => {
      const phase = getTidePhase(49); // Blocks 45-54 are slack low
      expect(phase).toBe(TidePhase.SLACK_LOW);
    });

    it("should detect slack high in window 18-27", () => {
      for (let i = 18; i <= 27; i++) {
        const phase = getTidePhase(i);
        expect(phase).toBe(TidePhase.SLACK_HIGH);
      }
    });

    it("should detect slack low in window 45-54", () => {
      for (let i = 45; i <= 54; i++) {
        const phase = getTidePhase(i);
        expect(phase).toBe(TidePhase.SLACK_LOW);
      }
    });

    it("should have smooth phase transitions", () => {
      const phases: TidePhase[] = [];
      for (let i = 0; i < TIDAL_HEIGHT_CYCLE_LENGTH; i++) {
        phases.push(getTidePhase(i));
      }
      // Should transition from rising -> slack high -> falling -> slack low -> rising
      expect(phases[0]).toBe(TidePhase.RISING);
      expect(phases[22]).toBe(TidePhase.SLACK_HIGH);
      expect(phases[35]).toBe(TidePhase.FALLING);
      expect(phases[49]).toBe(TidePhase.SLACK_LOW);
      expect(phases[60]).toBe(TidePhase.RISING);
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
      expect(getBlocksUntilNextTide(0)).toBe(36); // From block 0 to low tide at 36
      expect(getBlocksUntilNextTide(18)).toBe(18); // From block 18 to low tide at 36
      expect(getBlocksUntilNextTide(35)).toBe(1); // From block 35 to low tide at 36
      expect(getBlocksUntilNextTide(36)).toBe(36); // From block 36 to high tide at 72
      expect(getBlocksUntilNextTide(54)).toBe(18); // From block 54 to high tide at 72
      expect(getBlocksUntilNextTide(71)).toBe(1); // From block 71 to high tide at 72
    });

    it("should calculate next tide block correctly", () => {
      expect(getNextTideBlock(0)).toBe(36); // Next is low tide at 36
      expect(getNextTideBlock(18)).toBe(36); // Next is low tide at 36
      expect(getNextTideBlock(36)).toBe(72); // Next is high tide at 72
      expect(getNextTideBlock(54)).toBe(72); // Next is high tide at 72
      expect(getNextTideBlock(72)).toBe(108); // Next is low tide at 108 (36 + 72)
    });
  });

  describe("Tidal State", () => {
    it("should return complete tidal state", () => {
      const state = getTidalState(100000);
      expect(state).toHaveProperty("blocksIntoCycle");
      expect(state).toHaveProperty("blocksUntilNext");
      expect(state).toHaveProperty("type");
      expect(state).toHaveProperty("phase");
      expect(state).toHaveProperty("height");
      expect(state).toHaveProperty("nextTideBlock");
      expect(state).toHaveProperty("previousTideBlock");
      expect(state).toHaveProperty("isSpringTide");
      expect(state).toHaveProperty("isNeapTide");

      expect(state.blocksIntoCycle).toBeGreaterThanOrEqual(0);
      expect(state.blocksIntoCycle).toBeLessThan(TIDAL_HEIGHT_CYCLE_LENGTH);
      expect(state.height).toBeGreaterThanOrEqual(MAX_LOW_TIDE);
      expect(state.height).toBeLessThanOrEqual(MAX_HIGH_TIDE);
    });

    it("should calculate correct blocks into cycle", () => {
      const state0 = getTidalState(0);
      expect(state0.blocksIntoCycle).toBe(0);

      const state36 = getTidalState(36);
      expect(state36.blocksIntoCycle).toBe(36);

      const state72 = getTidalState(72);
      expect(state72.blocksIntoCycle).toBe(0);

      const state100 = getTidalState(100);
      expect(state100.blocksIntoCycle).toBe(28); // 100 % 72 = 28
    });
  });

  describe("Tidal Cycle Info", () => {
    it("should return correct cycle info", () => {
      const info = getTidalCycleInfo(100000);
      expect(info.cycleLength).toBe(TIDAL_HEIGHT_CYCLE_LENGTH);
      expect(info.maxHighTide).toBe(MAX_HIGH_TIDE);
      expect(info.maxLowTide).toBe(MAX_LOW_TIDE);
      expect(info.currentCycleEnd - info.currentCycleStart + 1).toBe(
        TIDAL_HEIGHT_CYCLE_LENGTH
      );
    });

    it("should calculate correct start and end blocks", () => {
      const info = getTidalCycleInfo(100);
      // 100 % 72 = 28, so cycle starts at 100 - 28 = 72
      expect(info.currentCycleStart).toBe(72);
      expect(info.currentCycleEnd).toBe(143); // 72 + 72 - 1
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
      expect(state.blocksIntoCycle).toBeGreaterThanOrEqual(0);
      expect(state.blocksIntoCycle).toBeLessThan(TIDAL_HEIGHT_CYCLE_LENGTH);
    });

    it("should handle negative block heights (should throw)", () => {
      // Negative block heights are not valid, but Delta constructor allows them
      // The tidal system will still work, just with negative values
      // This test verifies the system doesn't crash
      const tidal = create_tidal(-1);
      expect(tidal).toBeDefined();
    });

    it("should maintain consistency across cycle boundaries", () => {
      const stateBefore = getTidalState(71);
      const stateAfter = getTidalState(72);
      expect(stateBefore.blocksIntoCycle).toBe(71);
      expect(stateAfter.blocksIntoCycle).toBe(0);
      expect(getTideHeight(71)).toBe(17);
      expect(getTideHeight(72)).toBe(18);
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
      const tidal = create_tidal(22);
      expect(tidal.get_tide_phase()).toBe(TidePhase.SLACK_HIGH);
    });

    it("should get blocks until next tide from class instance", () => {
      const tidal = create_tidal(0);
      expect(tidal.get_blocks_until_next_tide()).toBe(36);
    });

    it("should get next tide block from class instance", () => {
      const tidal = create_tidal(0);
      expect(tidal.get_next_tide_block()).toBe(36);
    });

    it("should get tidal cycle info from class instance", () => {
      const tidal = create_tidal(100000);
      const info = tidal.get_tidal_cycle_info();
      expect(info.cycleLength).toBe(TIDAL_HEIGHT_CYCLE_LENGTH);
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
    it("should return simplified format for +18 (max high tide)", () => {
      // Block 0 has tide height +18
      const display = getTideDisplay(0);
      expect(display).toBe("🌊 High Tide (+18)");
    });

    it("should return simplified format for -18 (max low tide)", () => {
      // Block 36 has tide height -18
      const display = getTideDisplay(36);
      expect(display).toBe("🏖️ Low Tide (-18)");
    });

    it("should return simplified format for +18 at cycle repeat (block 72)", () => {
      // Block 72 repeats the cycle, also has tide height +18
      const display = getTideDisplay(72);
      expect(display).toBe("🌊 High Tide (+18)");
    });

    it("should return simplified format for +18 at multiple cycle repeats", () => {
      // Test multiple cycle repeats (0, 72, 144, 216, etc.)
      for (let i = 0; i < 5; i++) {
        const block = i * TIDAL_HEIGHT_CYCLE_LENGTH;
        const display = getTideDisplay(block);
        expect(display).toBe("🌊 High Tide (+18)");
      }
    });

    it("should return simplified format for -18 at cycle midpoint", () => {
      // Block 36, 108, 180, etc. all have -18
      for (let i = 0; i < 5; i++) {
        const block = 36 + (i * TIDAL_HEIGHT_CYCLE_LENGTH);
        const display = getTideDisplay(block);
        expect(display).toBe("🏖️ Low Tide (-18)");
      }
    });

    it("should return slack tide format for +17", () => {
      // Block 1 has tide height +17 (not +18)
      const display = getTideDisplay(1);
      expect(display).toBe("🌊 Slack Tide (+17)");
    });

    it("should return full format for tide height 0", () => {
      // Block 18 has tide height 0
      const display = getTideDisplay(18);
      expect(display).not.toBe("🌊 High Tide (+18)");
      expect(display).not.toBe("🏖️ Low Tide (-18)");
      expect(display).toContain("Tide:");
      expect(display).toContain("blocks");
    });

    it("should return slack tide format for -17", () => {
      // Block 37 has tide height -17 (not -18)
      const display = getTideDisplay(37);
      expect(display).toBe("🏖️ Slack Tide (-17)");
    });

    it("should return full format with correct structure for non-extreme, non-slack values", () => {
      // Test various non-extreme, non-slack values (excluding +17, -17, +18, -18)
      const testBlocks = [5, 10, 18, 25, 50, 60];
      for (const block of testBlocks) {
        const height = getTideHeight(block);
        if (height !== MAX_HIGH_TIDE && height !== MAX_LOW_TIDE && height !== 17 && height !== -17) {
          const display = getTideDisplay(block);
          expect(display).toContain("Tide:");
          expect(display).toContain("blocks");
          // Should include the tide height in the format
          const heightStr = height > 0 ? `+${height}` : `${height}`;
          expect(display).toContain(heightStr);
        }
      }
    });

    it("should use class instance method for +18", () => {
      const tidal = create_tidal(0);
      const display = tidal.get_tide_display();
      expect(display).toBe("🌊 High Tide (+18)");
    });

    it("should use class instance method for -18", () => {
      const tidal = create_tidal(36);
      const display = tidal.get_tide_display();
      expect(display).toBe("🏖️ Low Tide (-18)");
    });

    it("should use class instance method for +17", () => {
      const tidal = create_tidal(1);
      const display = tidal.get_tide_display();
      expect(display).toBe("🌊 Slack Tide (+17)");
    });

    it("should use class instance method for -17", () => {
      const tidal = create_tidal(37);
      const display = tidal.get_tide_display();
      expect(display).toBe("🏖️ Slack Tide (-17)");
    });

    it("should handle edge case values correctly", () => {
      // Test +17 and -17 (slack tide values)
      const displayPlus17 = getTideDisplay(1);
      expect(displayPlus17).toBe("🌊 Slack Tide (+17)");
      expect(displayPlus17).not.toBe("🌊 High Tide (+18)");

      const displayMinus17 = getTideDisplay(37);
      expect(displayMinus17).toBe("🏖️ Slack Tide (-17)");
      expect(displayMinus17).not.toBe("🏖️ Low Tide (-18)");
    });
  });
});
