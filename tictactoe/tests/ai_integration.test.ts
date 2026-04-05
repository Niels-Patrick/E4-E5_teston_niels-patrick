import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import Game from "../src/pages/Game.vue";

vi.mock("../src/api/users", () => {
  const { ref } = require("vue");
  return {
    handleGetUser: vi.fn(),
    user: ref({ username: "TestUser" }),
  };
});

vi.mock("../src/api/token", () => {
  const { ref } = require("vue");
  return {
    getToken: vi.fn(),
    idUser: ref(1),
  };
});

vi.mock("../src/api/games", () => {
  const { ref } = require("vue");
  return {
    formGame: ref({ gameDate: null, moves: null }),
    game: ref({ idGame: undefined }),
    handleAddGameSubmitForm: vi.fn(),
    handleEditGameSubmitForm: vi.fn(),
  };
});

vi.mock("../src/api/ai", () => ({
  playAiTurn: vi.fn().mockResolvedValue(["X", "O", "", "", "", "", "", "", ""]),
}));

describe("Game", () => {
  it("calls AI API and updates the board", async () => {
    const wrapper = mount(Game, {
      global: {
        stubs: {
          "v-row": { template: "<div><slot /></div>" },
          "v-card": { template: "<div><slot /></div>" },
          "v-btn": { template: "<button type=\"button\" @click=\"$emit('click')\"><slot /></button>" },
          "v-alert": { template: "<div><slot /></div>" },
        },
      },
    });

    // Trigger first board button click
    await wrapper.find("button").trigger("click");

    // Wait for API promise resolution and DOM updates
    await flushPromises();

    // Assert the board was updated with the AI move and the user turn is restored
    expect(wrapper.text()).toContain("O");
    expect(wrapper.text()).toContain("TestUser turn");
  });
});
