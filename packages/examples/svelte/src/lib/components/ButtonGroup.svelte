<script lang="ts">
  import type { ButtonName, Color } from "../../../../../core/controlls";

  export let buttonId: ButtonName;
  export let mode: "click" | "hover";
  export let onColorActivation: (
    buttonId: ButtonName,
    color: Color | "off"
  ) => void;

  const colors: (Color | "off")[] = ["red", "amber", "green", "off"];
</script>

<div class="button-group">
  <span class="button-label">{buttonId}</span>
  <div class="color-controls">
    {#each colors as color}
      <button
        class="color-button {color}"
        data-button={buttonId}
        data-color={color}
        on:click={() =>
          mode === "click" &&
          onColorActivation(buttonId, color as Color | "off")}
        on:mouseenter={() =>
          mode === "hover" &&
          color !== "off" &&
          onColorActivation(buttonId, color as Color)}
        on:mouseleave={() =>
          mode === "hover" && onColorActivation(buttonId, "off")}
      />
    {/each}
  </div>
</div>

<style>
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    min-width: 120px;
  }

  .button-label {
    font-size: 14px;
    color: #fff;
  }

  .color-controls {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }

  .color-button {
    width: 30px;
    height: 30px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 4px;
    opacity: 0.7;
  }

  .color-button:hover {
    opacity: 0.9;
  }

  .color-button.red {
    background: #ff0000;
  }

  .color-button.amber {
    background: #ffbf00;
  }

  .color-button.green {
    background: #00ff00;
  }

  .color-button.off {
    background: #666;
  }
</style>
