<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let active = false;
  export let color: "off" | "red" | "green" | "amber" = "off";
  export let id = "";
  export let label = "";

  const dispatch = createEventDispatcher();

  const colors = {
    off: "transparent",
    red: "#ff4b4b",
    green: "#4bff4b",
    amber: "#ffcc4b",
  };

  function onClick() {
    dispatch("click", { id });
  }
</script>

<div class="button-container">
  <button
    class="k2-button"
    class:active
    style="--button-color: {colors[color]}"
    on:click={onClick}
  >
    {#if label}
      <span class="label">{label}</span>
    {/if}
  </button>
</div>

<style>
  .button-container {
    width: 60px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .k2-button {
    width: 50px;
    height: 30px;
    background-color: #222;
    border: 1px solid #555;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 0 10px var(--button-color, transparent);
  }

  .k2-button.active {
    background-color: var(--button-color, #444);
  }

  .label {
    font-size: 10px;
    color: white;
    font-weight: bold;
    text-shadow: 0 0 2px #000;
  }
</style>
