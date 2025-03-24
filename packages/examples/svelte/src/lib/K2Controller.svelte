<script lang="ts">
  import { onMount } from "svelte";
  import { K2 } from "../../../../core/K2";
  import { BrowserMIDIProvider } from "../../../../core/BrowserMIDIProvider/BrowserMIDIProvider";
  import type { ButtonName, Color } from "../../../../core/controlls";
  import type {
    EncoderEvent,
    FaderEvent,
    KnobEvent,
  } from "../../../../core/K2";
  import Status from "./components/Status.svelte";
  import Controls from "./components/Controls.svelte";
  import ButtonGroup from "./components/ButtonGroup.svelte";

  export let events: string[] = [];
  export let onEvent: (message: string) => void;

  const channel = 2;
  const browserMIDIProvider = new BrowserMIDIProvider();
  let k2: K2;
  let isConnected = false;
  let mode: "click" | "hover" = "click";

  const colors: (Color | "off")[] = ["red", "amber", "green", "off"];

  const rows = ["A", "B", "C"];
  const cols = ["A", "B", "C", "D"];

  onMount(async () => {
    await browserMIDIProvider.connect();
    k2 = new K2(channel, browserMIDIProvider);

    k2.on("connect", () => {
      isConnected = true;
      onEvent("K2 connected");
    });

    k2.on("connectionError", (event: unknown) => {
      const error = event as { message: string };
      isConnected = false;
      onEvent(`Connection error: ${error.message}`);
    });

    k2.on("button.press", (button: { name: ButtonName }) => {
      onEvent(`Button pressed: ${button.name}`);
    });

    k2.on("button.release", (button: { name: ButtonName }) => {
      onEvent(`Button released: ${button.name}`);
    });

    k2.on("knob.change", (knob: KnobEvent) => {
      onEvent(`Knob changed: ${knob.name} ${knob.value}`);
    });

    k2.on("fader.change", (fader: FaderEvent) => {
      onEvent(`Fader changed: ${fader.name} ${fader.value}`);
    });

    k2.on("encoder.turn", (encoder: EncoderEvent) => {
      onEvent(`Encoder turned: ${encoder.name} ${encoder.value}`);
    });

    await k2.connect();
  });

  function handleConnect() {
    k2.connect();
  }

  function toggleMode() {
    mode = mode === "click" ? "hover" : "click";
    onEvent(`Switched to ${mode} mode`);
  }

  function handleColorActivation(buttonId: ButtonName, color: Color | "off") {
    if (color === "off") {
      k2.unhighlightButton(buttonId);
      onEvent(`Button ${buttonId} unhighlighted`);
    } else {
      k2.highlightButton(buttonId, color);
      onEvent(`Button ${buttonId} highlighted with ${color}`);
    }
  }
</script>

<div class="k2-controller">
  <Status {isConnected} />
  <Controls {mode} onConnect={handleConnect} onModeToggle={toggleMode} />

  {#each rows as row}
    <div class="row">
      <div class="row-label">{row}</div>
      {#each cols as col}
        {@const buttonId = `${row}${col}` as ButtonName}
        <ButtonGroup
          {buttonId}
          {mode}
          onColorActivation={handleColorActivation}
        />
      {/each}
    </div>
  {/each}
</div>

<style>
  .k2-controller {
    background: #333;
    padding: 20px;
    border-radius: 10px;
    margin: 2rem auto;
  }

  .row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .row-label {
    font-size: 24px;
    font-weight: bold;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
