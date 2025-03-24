<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Encoder from "./Encoder.svelte";
  import Knob from "./Knob.svelte";
  import Button from "./Button.svelte";
  import Fader from "./Fader.svelte";
  import LED from "./LED.svelte";

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

  // LEDs colors (just below encoders)
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

  // Buttons - We use labeled buttons as in the image
  // Labeled buttons A-P
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

  function handleButtonClick(event: CustomEvent<{ id: string }>) {
    const { id } = event.detail;
    dispatch("buttonClick", { id });
  }

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
    <div class="encoder-row">
      <!-- Top row encoders -->
      <div class="encoder-container">
        <Encoder id="encoder-1" value={encoder1Value} active={encoder1Active} />
        <Button
          id="encoder-1"
          color={encoder1ButtonColor}
          on:click={handleButtonClick}
        />
      </div>

      <div class="encoder-container">
        <Encoder id="encoder-2" value={encoder2Value} active={encoder2Active} />
        <Button
          id="encoder-2"
          color={encoder2ButtonColor}
          on:click={handleButtonClick}
        />
      </div>

      <div class="encoder-container">
        <Encoder id="encoder-3" value={encoder3Value} active={encoder3Active} />
        <Button
          id="encoder-3"
          color={encoder3ButtonColor}
          on:click={handleButtonClick}
        />
      </div>

      <div class="encoder-container">
        <Encoder id="encoder-4" value={encoder4Value} active={encoder4Active} />
        <Button
          id="encoder-4"
          color={encoder4ButtonColor}
          on:click={handleButtonClick}
        />
      </div>
    </div>

    <!-- Row of LEDs under encoders -->
    <div class="led-row">
      <LED id="led-1" color={led1Color} on:click={handleLedClick} />
      <LED id="led-2" color={led2Color} on:click={handleLedClick} />
      <LED id="led-3" color={led3Color} on:click={handleLedClick} />
      <LED id="led-4" color={led4Color} on:click={handleLedClick} />
    </div>

    <!-- First row of knobs and buttons -->
    <div class="control-row">
      <div class="control-cell">
        <Knob id="knob-1" value={knob1Value} />
        <Button
          id="button-1"
          color={button1Color}
          on:click={handleButtonClick}
        />
      </div>

      <div class="control-cell">
        <Knob id="knob-2" value={knob2Value} />
        <Button
          id="button-2"
          color={button2Color}
          on:click={handleButtonClick}
        />
      </div>

      <div class="control-cell">
        <Knob id="knob-3" value={knob3Value} />
        <Button
          id="button-3"
          color={button3Color}
          on:click={handleButtonClick}
        />
      </div>

      <div class="control-cell">
        <Knob id="knob-4" value={knob4Value} />
        <Button
          id="button-4"
          color={button4Color}
          on:click={handleButtonClick}
        />
      </div>
    </div>

    <!-- Second row of knobs and buttons -->
    <div class="control-row">
      <div class="control-cell">
        <Knob id="knob-5" value={knob5Value} />
        <Button
          id="button-5"
          color={button5Color}
          on:click={handleButtonClick}
        />
      </div>

      <div class="control-cell">
        <Knob id="knob-6" value={knob6Value} />
        <Button
          id="button-6"
          color={button6Color}
          on:click={handleButtonClick}
        />
      </div>

      <div class="control-cell">
        <Knob id="knob-7" value={knob7Value} />
        <Button
          id="button-7"
          color={button7Color}
          on:click={handleButtonClick}
        />
      </div>

      <div class="control-cell">
        <Knob id="knob-8" value={knob8Value} />
        <Button
          id="button-8"
          color={button8Color}
          on:click={handleButtonClick}
        />
      </div>
    </div>

    <!-- Third row of knobs and buttons -->
    <div class="control-row">
      <div class="control-cell">
        <Knob id="knob-9" value={knob9Value} />
        <Button
          id="button-9"
          color={button9Color}
          on:click={handleButtonClick}
        />
      </div>

      <div class="control-cell">
        <Knob id="knob-10" value={knob10Value} />
        <Button
          id="button-10"
          color={button10Color}
          on:click={handleButtonClick}
        />
      </div>

      <div class="control-cell">
        <Knob id="knob-11" value={knob11Value} />
        <Button
          id="button-11"
          color={button11Color}
          on:click={handleButtonClick}
        />
      </div>

      <div class="control-cell">
        <Knob id="knob-12" value={knob12Value} />
        <Button
          id="button-12"
          color={button12Color}
          on:click={handleButtonClick}
        />
      </div>
    </div>

    <!-- Row of faders -->
    <div class="fader-row">
      <Fader id="fader-1" value={fader1Value} />
      <Fader id="fader-2" value={fader2Value} />
      <Fader id="fader-3" value={fader3Value} />
      <Fader id="fader-4" value={fader4Value} />
    </div>

    <!-- 4x4 grid of labeled buttons -->
    <div class="button-grid">
      <!-- Row 1: A-D -->
      <div class="button-row">
        <Button
          id="A"
          color={buttonAColor}
          label="A"
          on:click={handleButtonClick}
        />
        <Button
          id="B"
          color={buttonBColor}
          label="B"
          on:click={handleButtonClick}
        />
        <Button
          id="C"
          color={buttonCColor}
          label="C"
          on:click={handleButtonClick}
        />
        <Button
          id="D"
          color={buttonDColor}
          label="D"
          on:click={handleButtonClick}
        />
      </div>

      <!-- Row 2: E-H -->
      <div class="button-row">
        <Button
          id="E"
          color={buttonEColor}
          label="E"
          on:click={handleButtonClick}
        />
        <Button
          id="F"
          color={buttonFColor}
          label="F"
          on:click={handleButtonClick}
        />
        <Button
          id="G"
          color={buttonGColor}
          label="G"
          on:click={handleButtonClick}
        />
        <Button
          id="H"
          color={buttonHColor}
          label="H"
          on:click={handleButtonClick}
        />
      </div>

      <!-- Row 3: I-L -->
      <div class="button-row">
        <Button
          id="I"
          color={buttonIColor}
          label="I"
          on:click={handleButtonClick}
        />
        <Button
          id="J"
          color={buttonJColor}
          label="J"
          on:click={handleButtonClick}
        />
        <Button
          id="K"
          color={buttonKColor}
          label="K"
          on:click={handleButtonClick}
        />
        <Button
          id="L"
          color={buttonLColor}
          label="L"
          on:click={handleButtonClick}
        />
      </div>

      <!-- Row 4: M-P -->
      <div class="button-row">
        <Button
          id="M"
          color={buttonMColor}
          label="M"
          on:click={handleButtonClick}
        />
        <Button
          id="N"
          color={buttonNColor}
          label="N"
          on:click={handleButtonClick}
        />
        <Button
          id="O"
          color={buttonOColor}
          label="O"
          on:click={handleButtonClick}
        />
        <Button
          id="P"
          color={buttonPColor}
          label="P"
          on:click={handleButtonClick}
        />
      </div>
    </div>
  </div>

  <!-- Bottom row with Layer, encoders 5-6, Exit Setup -->
  <div class="bottom-row">
    <Button
      id="layer"
      color={layerButtonColor}
      label="LAYER"
      on:click={handleButtonClick}
    />

    <div class="encoder-container">
      <Encoder id="encoder-5" value={encoder5Value} active={encoder5Active} />
      <Button
        id="encoder-5"
        color={encoder5ButtonColor}
        on:click={handleButtonClick}
      />
    </div>

    <div class="encoder-container">
      <Encoder id="encoder-6" value={encoder6Value} active={encoder6Active} />
      <Button
        id="encoder-6"
        color={encoder6ButtonColor}
        on:click={handleButtonClick}
      />
    </div>

    <Button
      id="exit-setup"
      color={exitSetupButtonColor}
      label="EXIT SETUP"
      on:click={handleButtonClick}
    />
  </div>
</div>

<style>
  .k2-surface {
    width: 600px;
    background-color: #1a1a1a;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    gap: 15px;
    border: 1px solid #444;
  }

  .k2-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 10px;
    border-bottom: 1px solid #666;
    padding-bottom: 10px;
  }

  .k2-logo {
    font-weight: bold;
    font-size: 18px;
    color: #fff;
  }

  .k2-manufacturer {
    font-weight: bold;
    font-size: 18px;
    color: #fff;
  }

  .k2-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .encoder-row {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }

  .led-row {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: -10px;
  }

  .control-row {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }

  .control-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .fader-row {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin: 10px 0;
  }

  .button-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .button-row {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }

  .bottom-row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0;
    margin-top: 10px;
    border-top: 1px solid #666;
    padding-top: 15px;
  }

  .encoder-container {
    position: relative;
    width: 60px;
    height: 60px;
  }

  .encoder-container :global(.k2-button) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 20px;
    opacity: 0;
    pointer-events: all;
  }
</style>
