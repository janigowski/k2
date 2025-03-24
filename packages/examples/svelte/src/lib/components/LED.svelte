<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let color: "off" | "red" | "green" | "amber" = "off";
  export let id = "";

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
    class="led"
    style="--led-color: {colors[color]}"
    on:click={handleClick}
  ></button>
</div>

<style>
  .led-container {
    width: 40px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .led {
    width: 30px;
    height: 20px;
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
  }

  .led:hover {
    box-shadow:
      inset 0 0 10px var(--led-color, transparent),
      0 0 5px var(--led-color, transparent);
  }

  .led:active {
    transform: scale(0.95);
  }
</style>
