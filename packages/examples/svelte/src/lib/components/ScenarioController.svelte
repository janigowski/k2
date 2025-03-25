<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { LEDScenario } from "../scenarios/LEDScenario";

  export let scenarios: LEDScenario[] = [];
  export let isPlaying = false;

  let selectedScenario: LEDScenario | null =
    scenarios.length > 0 ? scenarios[0] : null;

  // Add a flag to track when "None" is selected
  let noneSelected = false;

  const dispatch = createEventDispatcher<{
    play: { scenario: LEDScenario };
    pause: void;
    turnOffAll: void;
  }>();

  function handleScenarioSelect(scenario: LEDScenario | null) {
    // If "None" is selected
    if (scenario === null) {
      noneSelected = true;
      selectedScenario = null;

      // If a scenario is playing, pause it
      if (isPlaying) {
        dispatch("pause");
      }

      // Turn off all LEDs
      dispatch("turnOffAll");
      return;
    }

    // Regular scenario selection
    noneSelected = false;
    selectedScenario = scenario;

    // If currently playing, pause and then play new selection
    if (isPlaying) {
      dispatch("pause");
      setTimeout(() => {
        dispatch("play", { scenario: selectedScenario as LEDScenario });
      }, 100);
    }
  }

  function togglePlayPause() {
    if (!selectedScenario) return;

    if (isPlaying) {
      dispatch("pause");
    } else {
      dispatch("play", { scenario: selectedScenario });
    }
  }
</script>

<div class="scenario-controller">
  <h2>LED Automation</h2>

  <div class="controls">
    <button
      class="play-pause-button {isPlaying ? 'pause' : 'play'}"
      on:click={togglePlayPause}
      disabled={!selectedScenario}
    >
      {isPlaying ? "Pause" : "Play"}
    </button>

    <button class="off-button" on:click={() => dispatch("turnOffAll")}>
      Turn Off All
    </button>
  </div>

  <div class="scenario-selector">
    <div class="scenario-list">
      <!-- None option -->
      <div
        class="scenario-option {noneSelected ? 'selected' : ''}"
        on:click={() => handleScenarioSelect(null)}
      >
        <div class="radio"></div>
        <div class="scenario-content">
          <div class="scenario-name">None</div>
          <div class="scenario-description">Turn off automation</div>
        </div>
      </div>

      <!-- Separator line -->
      <div class="separator"></div>

      {#each scenarios as scenario}
        <div
          class="scenario-option {selectedScenario === scenario && !noneSelected
            ? 'selected'
            : ''}"
          on:click={() => handleScenarioSelect(scenario)}
        >
          <div class="radio"></div>
          <div class="scenario-content">
            <div class="scenario-name">{scenario.name}</div>
            <div class="scenario-description">{scenario.description}</div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .scenario-controller {
    background-color: #2a2a2a;
    border-radius: 8px;
    padding: 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.2em;
    color: #fff;
    text-align: left;
  }

  .scenario-selector {
    margin-bottom: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .scenario-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
    flex: 1;
    overflow-y: auto;
    padding-right: 5px;
  }

  .scenario-option {
    display: flex;
    align-items: center;
    padding: 8px;
    background-color: #3a3a3a;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .scenario-option:hover {
    background-color: #4a4a4a;
  }

  .scenario-option.selected {
    background-color: #555;
    border-left: 3px solid #4caf50;
  }

  .scenario-option:first-child {
    border: 1px solid #444;
  }

  .scenario-option:first-child.selected {
    background-color: #404040;
    border-left: 3px solid #9e9e9e;
  }

  .scenario-option:first-child .scenario-name {
    color: #ccc;
  }

  .scenario-option:first-child.selected .radio:after {
    background-color: #9e9e9e;
  }

  .scenario-option .radio {
    width: 14px;
    height: 14px;
    border: 2px solid #ccc;
    border-radius: 50%;
    margin-right: 8px;
    position: relative;
    flex-shrink: 0;
  }

  .scenario-option.selected .radio:after {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #4caf50;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .scenario-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;
  }

  .scenario-name {
    font-weight: bold;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .scenario-description {
    font-size: 0.8em;
    color: #aaa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    gap: 10px;
  }

  .play-pause-button,
  .off-button {
    padding: 8px 15px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition:
      background-color 0.2s,
      transform 0.1s;
    flex: 1;
  }

  .play {
    background-color: #4caf50;
    color: white;
  }

  .play:hover {
    background-color: #45a049;
  }

  .pause {
    background-color: #f44336;
    color: white;
  }

  .pause:hover {
    background-color: #d32f2f;
  }

  .off-button {
    background-color: #607d8b;
    color: white;
  }

  .off-button:hover {
    background-color: #546e7a;
  }

  button:active {
    transform: scale(0.98);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Scrollbar styling */
  .scenario-list::-webkit-scrollbar {
    width: 6px;
  }

  .scenario-list::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 3px;
  }

  .scenario-list::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 3px;
  }

  .scenario-list::-webkit-scrollbar-thumb:hover {
    background: #777;
  }

  .separator {
    height: 1px;
    background-color: #444;
    margin: 8px 0;
  }
</style>
