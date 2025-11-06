import { create_telescope } from "./index";
import { BITCOIN } from "./index.d";
import { GENESIS_BLOCK_DATE, GENESIS_BLOCK_HEIGHT } from "./src/lib/constants";

describe("telescope", () => {
  const block: BITCOIN.Block = {
    bits: 386021892,
    difficulty: 126411437451912.23,
    height: 901152,
    id: "00000000000000000000f144eba6af14dd6363fda3ac7ec48348edbf0cde0e3e",
    mediantime: 1749862778,
    merkle_root: "049de82ecc42259deec842561e8dda1f1b9841041bd15ef8c32fac44c49a98ce",
    nonce: 1103581450,
    previousblockhash: "0000000000000000000108312d8ba9c66bf9c806b9c7bf2e923d282508941005",
    size: 1556000,
    timestamp: 1749865604,
    tx_count: 2330,
    version: 536870912,
    weight: 3997853,
  };

  it("should be defined", () => {
    const telescope = create_telescope(block);
    expect(telescope).toBeDefined();
    expect(telescope.delta).toBeDefined();
    expect(telescope.lunar).toBeDefined();
    expect(telescope.solar).toBeDefined();
    expect(telescope.atmosphere).toBeDefined();
    // delta
    expect(telescope.delta.t(block.height)).toBe(0);

    // lunar
    expect(telescope.lunar.get_blockheight()).toBe(block.height);

    // solar
    expect(telescope.solar.get_blockheight()).toBe(block.height);

    // atmosphere
    expect(telescope.atmosphere.get_weight()).toBe(block.weight);
    expect(telescope.atmosphere.get_transaction_count()).toBe(block.tx_count);

    // tidal
    expect(telescope.tidal.get_blockheight()).toBe(block.height);

    // formatted date
    const formattedDate = telescope.get_formatted_date();
    expect(formattedDate).toMatch(/^AG_\d+_\d+_\d+_\d{4}$/);
    expect(typeof formattedDate).toBe("string");
  });

  it("should format date correctly", () => {
    const telescope = create_telescope(block);
    const formattedDate = telescope.get_formatted_date();
    
    // Verify the format matches the expected pattern: AG_halving_season_moon_position_in_cycle
    const parts = formattedDate.split("_");
    expect(parts.length).toBe(5);
    expect(parts[0]).toBe("AG"); // Era prefix
    expect(parts[4]).toMatch(/^\d{4}$/); // Position should be 4 digits
    
    // Verify it matches the manual calculation with padded position
    const paddedPosition = String(telescope.lunar.get_position_in_cycle()).padStart(4, '0');
    const expectedFormat = `AG_${Math.floor(telescope.delta.get_blockheight() / 210000)}_${telescope.solar.get_season_index() + 1}_${telescope.lunar.get_cycle_index() + 1}_${paddedPosition}`;
    expect(formattedDate).toBe(expectedFormat);
  });
});