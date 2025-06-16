import { create_atmosphere } from "./index";

describe("Atmosphere", () => {
  it("should create a Atmosphere object with valid input", () => {
    const atmosphereInstance = create_atmosphere(100000, 100000);
    expect(atmosphereInstance.get_weight()).toBe(100000);
    expect(atmosphereInstance.get_transaction_count()).toBe(100000);
  });

  it("should return correct conditions", () => {
    const atmosphereInstance = create_atmosphere(2800000, 2800);
    expect(atmosphereInstance.get_conditions()).toBe(4000);
  });

  it("should return correct conditions", () => {
    const atmosphereInstance = create_atmosphere(1600000, 1200);
    expect(atmosphereInstance.get_conditions()).toBe(3000);
  });

  it("should return correct conditions", () => {
    const atmosphereInstance = create_atmosphere(3200000, 800);
    expect(atmosphereInstance.get_conditions()).toBe(1000);
  });
});