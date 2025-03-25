<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let color: "off" | "red" | "green" | "amber" = "off";
  export let id = "";
  export let label = "";

  const colors = {
    off: "transparent",
    red: "#ff4b4b",
    green: "#4bff4b",
    amber: "#ffcc4b",
  };

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("click", { id });
  }
</script>

<div class="led-container">
  <button
    class="led clickable"
    style="--led-color: {colors[color]}"
    on:click={handleClick}
    aria-label={`LED ${id}, currently ${color}`}
    title="Click to change LED color"
  >
    {#if label}
      <span class="label">{label}</span>
    {/if}
  </button>
</div>

<style>
  .led-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .led {
    width: 50px;
    height: 30px;
    background-color: #222;
    border: 1px solid #555;
    border-radius: 4px;
    position: relative;
    box-shadow: inset 0 0 10px var(--led-color, transparent);
    cursor: pointer;
    padding: 0;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    transition: all 0.1s ease;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .led::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--led-color, transparent);
    opacity: 0.3;
    border-radius: 3px;
    transition: opacity 0.1s ease;
  }

  .led.clickable:hover {
    box-shadow:
      inset 0 0 10px var(--led-color, transparent),
      0 0 8px 2px var(--led-color, rgba(255, 255, 255, 0.5));
    transform: scale(1.05);
  }

  .led.clickable:hover::after {
    opacity: 0.5;
  }

  .led:active {
    transform: scale(0.95);
  }

  .label {
    font-size: 10px;
    color: white;
    font-weight: bold;
    text-shadow: 0 0 2px #000;
    position: relative;
    z-index: 1;
  }
</style>
