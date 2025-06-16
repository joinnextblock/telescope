import { create_solar } from "./index";

describe("Solar", () => {
  it("should create a Solar object with valid input", () => {
    const solarInstance = create_solar(0);
    expect(solarInstance.get_blockheight()).toBe(0);
  });
  it("should return correct solar season index", () => {
    const solarInstance = create_solar(0);
    expect(solarInstance.get_season_index()).toBe(0);
  });

  it("should return correct season (Spring)", () => {
    const solarInstance = create_solar(0);
    expect(solarInstance.get_season().name).toBe("Spring");
  });

  it("should return correct season (Summer)", () => {
    const solarInstance = create_solar(52500);
    expect(solarInstance.get_season().name).toBe("Summer");
  });

  it("should return correct next season (Autumn)", () => {
    const solarInstance = create_solar(52500);
    expect(solarInstance.get_next_season().name).toBe("Autumn");
  });

  it("should return correct next season (Autumn)", () => {
    const solarInstance = create_solar(105000);
    expect(solarInstance.get_season().name).toBe("Autumn");
  });

  it("should return correct next season (Winter)", () => {
    const solarInstance = create_solar(105000);
    expect(solarInstance.get_next_season().name).toBe("Winter");
  });

  it("should return correct next season (Summer)", () => {
    const solarInstance = create_solar(0);
    expect(solarInstance.get_next_season().name).toBe("Summer");
  });

  it("should return correct blocks until next season", () => {
    const solarInstance = create_solar(0);
    expect(solarInstance.get_blocks_until_next_season()).toBe(52500);
  });

  it("should return correct blocks until next cycle", () => {
    const solarInstance = create_solar(0);
    expect(solarInstance.get_blocks_until_next_cycle()).toBe(210000);
  });

  it("should return correct season block height", () => {
    const solarInstance = create_solar(0);
    expect(solarInstance.get_season_block_height()).toBe(0);
  });

  it("should return correct season block height", () => {
    const solarInstance = create_solar(52500);
    expect(solarInstance.get_season_block_height()).toBe(0);
  });

  it("should return correct cycle block height", () => {
    const solarInstance = create_solar(0);
    expect(solarInstance.get_cycle_block_height()).toBe(0);
  });

  it("should return correct cycle block height", () => {
    const solarInstance = create_solar(210000);
    expect(solarInstance.get_cycle_block_height()).toBe(0);
  });

  it("should return correct season position", () => {
    const solarInstance = create_solar(0);
    expect(solarInstance.get_season_position()).toBe(0);
  });

  it("should return correct season position", () => {
    const solarInstance = create_solar(52500);
    expect(solarInstance.get_season_position()).toBe(0);
  });

  it("should return correct season position", () => {
    const solarInstance = create_solar(105000);
    expect(solarInstance.get_season_position()).toBe(0);
  });

  it("should return correct position in cycle", () => {
    const solarInstance = create_solar(0);
    expect(solarInstance.get_position_in_cycle()).toBe(0);
  });

  it("should return correct position in cycle", () => {
    const solarInstance = create_solar(901152);
    expect(solarInstance.get_position_in_cycle()).toBe(61152);
  });
});