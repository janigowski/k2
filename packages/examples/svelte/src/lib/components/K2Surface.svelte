<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Encoder from "./Encoder.svelte";
  import Knob from "./Knob.svelte";
  import LED from "./LED.svelte";
  import Fader from "./Fader.svelte";

  // Define color type locally instead of importing
  type Color = "red" | "green" | "amber";

  const dispatch = createEventDispatcher();

  // Encoders
  export let encoder1Value = 0;
  export let encoder1Active = false;
  export let encoder2Value = 0;
  export let encoder2Active = false;
  export let encoder3Value = 0;
  export let encoder3Active = false;
  export let encoder4Value = 0;
  export let encoder4Active = false;
  export let encoder5Value = 0;
  export let encoder5Active = false;
  export let encoder6Value = 0;
  export let encoder6Active = false;

  // LEDs colors (only 4 LEDs below encoders 1-4)
  export let led1Color: "off" | "red" | "amber" | "green" = "off";
  export let led2Color: "off" | "red" | "amber" | "green" = "off";
  export let led3Color: "off" | "red" | "amber" | "green" = "off";
  export let led4Color: "off" | "red" | "amber" | "green" = "off";

  // Knobs - 12 knobs total (3 rows of 4)
  export let knob1Value = 0.5;
  export let knob2Value = 0.5;
  export let knob3Value = 0.5;
  export let knob4Value = 0.5;
  export let knob5Value = 0.5;
  export let knob6Value = 0.5;
  export let knob7Value = 0.5;
  export let knob8Value = 0.5;
  export let knob9Value = 0.5;
  export let knob10Value = 0.5;
  export let knob11Value = 0.5;
  export let knob12Value = 0.5;

  // Faders
  export let fader1Value = 0.5;
  export let fader2Value = 0.5;
  export let fader3Value = 0.5;
  export let fader4Value = 0.5;

  // All LED colors
  export let buttonAColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonBColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonCColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonDColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonEColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonFColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonGColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonHColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonIColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonJColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonKColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonLColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonMColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonNColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonOColor: "off" | "red" | "amber" | "green" = "off";
  export let buttonPColor: "off" | "red" | "amber" | "green" = "off";

  // Encoder button colors
  export let encoder1ButtonColor: "off" | "red" | "amber" | "green" = "off";
  export let encoder2ButtonColor: "off" | "red" | "amber" | "green" = "off";
  export let encoder3ButtonColor: "off" | "red" | "amber" | "green" = "off";
  export let encoder4ButtonColor: "off" | "red" | "amber" | "green" = "off";
  export let encoder5ButtonColor: "off" | "red" | "amber" | "green" = "off";
  export let encoder6ButtonColor: "off" | "red" | "amber" | "green" = "off";

  // Numbered button colors (12 buttons)
  export let button1Color: "off" | "red" | "amber" | "green" = "off";
  export let button2Color: "off" | "red" | "amber" | "green" = "off";
  export let button3Color: "off" | "red" | "amber" | "green" = "off";
  export let button4Color: "off" | "red" | "amber" | "green" = "off";
  export let button5Color: "off" | "red" | "amber" | "green" = "off";
  export let button6Color: "off" | "red" | "amber" | "green" = "off";
  export let button7Color: "off" | "red" | "amber" | "green" = "off";
  export let button8Color: "off" | "red" | "amber" | "green" = "off";
  export let button9Color: "off" | "red" | "amber" | "green" = "off";
  export let button10Color: "off" | "red" | "amber" | "green" = "off";
  export let button11Color: "off" | "red" | "amber" | "green" = "off";
  export let button12Color: "off" | "red" | "amber" | "green" = "off";

  // Special buttons
  export let layerButtonColor: "off" | "red" | "amber" | "green" = "off";
  export let exitSetupButtonColor: "off" | "red" | "amber" | "green" = "off";

  function handleLedClick(event: CustomEvent<{ id: string }>) {
    const { id } = event.detail;
    dispatch("ledClick", { id });
  }
</script>

<div class="k2-surface">
  <div class="k2-header">
    <div class="k2-logo">XONE:K2</div>
    <div class="k2-manufacturer">ALLEN&HEATH</div>
  </div>

  <div class="k2-grid">
    <!-- Encoders Row (non-clickable) -->
    <div class="k2-row">
      <div class="encoder-section">
        <div class="encoder-container">
          <Encoder
            id="encoder-1"
            value={encoder1Value}
            active={encoder1Active}
          />
        </div>

        <div class="encoder-container">
          <Encoder
            id="encoder-2"
            value={encoder2Value}
            active={encoder2Active}
          />
        </div>

        <div class="encoder-container">
          <Encoder
            id="encoder-3"
            value={encoder3Value}
            active={encoder3Active}
          />
        </div>

        <div class="encoder-container">
          <Encoder
            id="encoder-4"
            value={encoder4Value}
            active={encoder4Active}
          />
        </div>
      </div>
    </div>

    <!-- Small LEDs below encoders (clickable) -->
    <div class="led-row">
      <div class="led-group">
        <LED
          id="encoder-1"
          color={encoder1ButtonColor}
          on:click={handleLedClick}
        />
        <LED
          id="encoder-2"
          color={encoder2ButtonColor}
          on:click={handleLedClick}
        />
        <LED
          id="encoder-3"
          color={encoder3ButtonColor}
          on:click={handleLedClick}
        />
        <LED
          id="encoder-4"
          color={encoder4ButtonColor}
          on:click={handleLedClick}
        />
      </div>
    </div>

    <!-- First row of knobs and buttons -->
    <div class="k2-row">
      <div class="button-row">
        <div class="button-group">
          <Knob id="knob-1" value={knob1Value} />
          <LED id="button-1" color={button1Color} on:click={handleLedClick} />
        </div>

        <div class="button-group">
          <Knob id="knob-2" value={knob2Value} />
          <LED id="button-2" color={button2Color} on:click={handleLedClick} />
        </div>

        <div class="button-group">
          <Knob id="knob-3" value={knob3Value} />
          <LED id="button-3" color={button3Color} on:click={handleLedClick} />
        </div>

        <div class="button-group">
          <Knob id="knob-4" value={knob4Value} />
          <LED id="button-4" color={button4Color} on:click={handleLedClick} />
        </div>
      </div>
    </div>

    <!-- Second row of knobs and buttons -->
    <div class="k2-row">
      <div class="button-row">
        <div class="button-group">
          <Knob id="knob-5" value={knob5Value} />
          <LED id="button-5" color={button5Color} on:click={handleLedClick} />
        </div>

        <div class="button-group">
          <Knob id="knob-6" value={knob6Value} />
          <LED id="button-6" color={button6Color} on:click={handleLedClick} />
        </div>

        <div class="button-group">
          <Knob id="knob-7" value={knob7Value} />
          <LED id="button-7" color={button7Color} on:click={handleLedClick} />
        </div>

        <div class="button-group">
          <Knob id="knob-8" value={knob8Value} />
          <LED id="button-8" color={button8Color} on:click={handleLedClick} />
        </div>
      </div>
    </div>

    <!-- Third row of knobs and buttons -->
    <div class="k2-row">
      <div class="button-row">
        <div class="button-group">
          <Knob id="knob-9" value={knob9Value} />
          <LED id="button-9" color={button9Color} on:click={handleLedClick} />
        </div>

        <div class="button-group">
          <Knob id="knob-10" value={knob10Value} />
          <LED id="button-10" color={button10Color} on:click={handleLedClick} />
        </div>

        <div class="button-group">
          <Knob id="knob-11" value={knob11Value} />
          <LED id="button-11" color={button11Color} on:click={handleLedClick} />
        </div>

        <div class="button-group">
          <Knob id="knob-12" value={knob12Value} />
          <LED id="button-12" color={button12Color} on:click={handleLedClick} />
        </div>
      </div>
    </div>

    <!-- Faders row -->
    <div class="k2-row">
      <div class="button-row">
        <Fader id="fader-1" value={fader1Value} />
        <Fader id="fader-2" value={fader2Value} />
        <Fader id="fader-3" value={fader3Value} />
        <Fader id="fader-4" value={fader4Value} />
      </div>
    </div>

    <!-- Lettered buttons rows -->
    <div class="k2-row">
      <div class="button-row">
        <LED id="A" color={buttonAColor} label="A" on:click={handleLedClick} />
        <LED id="B" color={buttonBColor} label="B" on:click={handleLedClick} />
        <LED id="C" color={buttonCColor} label="C" on:click={handleLedClick} />
        <LED id="D" color={buttonDColor} label="D" on:click={handleLedClick} />
      </div>
    </div>

    <div class="k2-row">
      <div class="button-row">
        <LED id="E" color={buttonEColor} label="E" on:click={handleLedClick} />
        <LED id="F" color={buttonFColor} label="F" on:click={handleLedClick} />
        <LED id="G" color={buttonGColor} label="G" on:click={handleLedClick} />
        <LED id="H" color={buttonHColor} label="H" on:click={handleLedClick} />
      </div>
    </div>

    <div class="k2-row">
      <div class="button-row">
        <LED id="I" color={buttonIColor} label="I" on:click={handleLedClick} />
        <LED id="J" color={buttonJColor} label="J" on:click={handleLedClick} />
        <LED id="K" color={buttonKColor} label="K" on:click={handleLedClick} />
        <LED id="L" color={buttonLColor} label="L" on:click={handleLedClick} />
      </div>
    </div>

    <div class="k2-row">
      <div class="button-row">
        <LED id="M" color={buttonMColor} label="M" on:click={handleLedClick} />
        <LED id="N" color={buttonNColor} label="N" on:click={handleLedClick} />
        <LED id="O" color={buttonOColor} label="O" on:click={handleLedClick} />
        <LED id="P" color={buttonPColor} label="P" on:click={handleLedClick} />
      </div>
    </div>
  </div>

  <div class="special-buttons">
    <LED
      id="layer"
      color={layerButtonColor}
      label="LAYER"
      on:click={handleLedClick}
    />

    <div class="bottom-encoders">
      <div class="encoder-container">
        <Encoder id="encoder-5" value={encoder5Value} active={encoder5Active} />
      </div>

      <div class="encoder-container">
        <Encoder id="encoder-6" value={encoder6Value} active={encoder6Active} />
      </div>
    </div>

    <LED
      id="exit-setup"
      color={exitSetupButtonColor}
      label="EXIT SETUP"
      on:click={handleLedClick}
    />
  </div>
</div>

<style>
  .k2-surface {
    background-color: #333;
    border-radius: 30px;
    padding: 20px;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 460px;
    aspect-ratio: 9/16;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }

  .k2-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  .k2-logo {
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
  }

  .k2-manufacturer {
    font-size: 14px;
    opacity: 0.7;
  }

  .k2-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .k2-row {
    display: flex;
    justify-content: space-between;
    height: auto;
    min-height: 40px;
  }

  /* Bottom rows should be more compact */
  .k2-grid > .k2-row:nth-child(n + 5) {
    min-height: 35px;
  }

  /* Letter button rows should be even more compact */
  .k2-grid > .k2-row:nth-child(n + 8) {
    min-height: 30px;
  }

  .encoder-section {
    display: flex;
    justify-content: space-between;
    flex: 1;
  }

  .encoder-container {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button-row {
    display: flex;
    justify-content: space-between;
    flex: 1;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .led-row {
    display: flex;
    justify-content: space-between;
    height: auto;
    margin: -2px 0;
  }

  .led-group {
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: space-between;
  }

  .special-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
  }

  .special-buttons :global(.led) {
    width: 65px !important;
    height: 25px !important;
  }

  .bottom-encoders {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  /* Standard LED styling */
  :global(.led) {
    width: 45px !important;
    height: 25px !important;
    box-shadow:
      inset 0 0 15px var(--led-color, transparent),
      0 0 5px var(--led-color, transparent) !important;
  }

  /* Small LEDs for encoder row */
  .led-group :global(.led) {
    width: 20px !important;
    height: 10px !important;
    border-radius: 3px !important;
  }

  :global(.led::after) {
    opacity: 0.5 !important;
  }

  :global(.led.clickable:hover) {
    box-shadow:
      inset 0 0 15px var(--led-color, transparent),
      0 0 12px 4px var(--led-color, rgba(255, 255, 255, 0.5)) !important;
    transform: scale(1.08);
  }

  .bottom-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 5px;
    margin-top: 10px;
    border-top: 1px solid #666;
  }

  .layer-button :global(.led),
  .exit-setup-button :global(.led) {
    width: 70px;
    height: 30px;
  }

  .center-controls {
    display: flex;
    gap: 15px;
  }
</style>
