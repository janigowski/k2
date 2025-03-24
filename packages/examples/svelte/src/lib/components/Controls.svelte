<script lang="ts">
  export let mode: "click" | "hover";
  export let onConnect: () => void;
  export let onModeToggle: () => void;
</script>

<div class="controls">
  <button on:click={onConnect}>Connect K2</button>
  <button
    class="mode-toggle"
    class:active={mode === "hover"}
    on:click={onModeToggle}
  >
    Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
  </button>
</div>

<style>
  .controls {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
  }

  .mode-toggle {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    background: #444;
    color: white;
    border: 1px solid #666;
  }

  .mode-toggle.active {
    background: #666;
  }
</style>
