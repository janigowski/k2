<script lang="ts">
  import { onMount } from "svelte";
  import K2Surface from "./lib/components/K2Surface.svelte";
  import { K2 } from "../../../core/K2";
  import { BrowserMIDIProvider } from "../../../core/BrowserMIDIProvider/BrowserMIDIProvider";
  import type { ButtonName } from "../../../core/controlls";

  let events: string[] = [];

  // K2Surface state
  let encoderValues: Record<string, number> = {
    encoder1: 0,
    encoder2: 0,
    encoder3: 0,
    encoder4: 0,
    encoder5: 0,
    encoder6: 0,
  };

  let encoderActives = {
    encoder1: false,
    encoder2: false,
    encoder3: false,
    encoder4: false,
    encoder5: false,
    encoder6: false,
  };

  // LED colors
  let ledColors: Record<string, "off" | "red" | "green" | "amber"> = {
    "led-1": "off",
    "led-2": "off",
    "led-3": "off",
    "led-4": "off",
  };

  let knobValues = {
    knob1: 0.5,
    knob2: 0.5,
    knob3: 0.5,
    knob4: 0.5,
    knob5: 0.5,
    knob6: 0.5,
    knob7: 0.5,
    knob8: 0.5,
    knob9: 0.5,
    knob10: 0.5,
    knob11: 0.5,
    knob12: 0.5,
  };

  let faderValues = {
    fader1: 0.5,
    fader2: 0.5,
    fader3: 0.5,
    fader4: 0.5,
  };

  // Store button colors
  let buttonColors: Record<string, "off" | "red" | "green" | "amber"> = {
    // Labeled buttons
    A: "off",
    B: "off",
    C: "off",
    D: "off",
    E: "off",
    F: "off",
    G: "off",
    H: "off",
    I: "off",
    J: "off",
    K: "off",
    L: "off",
    M: "off",
    N: "off",
    O: "off",
    P: "off",

    // Numbered buttons
    "button-1": "off",
    "button-2": "off",
    "button-3": "off",
    "button-4": "off",
    "button-5": "off",
    "button-6": "off",
    "button-7": "off",
    "button-8": "off",
    "button-9": "off",
    "button-10": "off",
    "button-11": "off",
    "button-12": "off",

    // Encoder buttons
    "encoder-1": "off",
    "encoder-2": "off",
    "encoder-3": "off",
    "encoder-4": "off",
    "encoder-5": "off",
    "encoder-6": "off",

    // Special buttons
    layer: "off",
    "exit-setup": "off",
  };

  function handleEvent(message: string) {
    events = [message, ...events];
  }

  // MIDI integration
  const channel = 2;
  const browserMIDIProvider = new BrowserMIDIProvider();
  let k2: K2;
  let isConnected = false;

  // Color cycle for UI interactions
  const colorCycle: Array<"off" | "red" | "green" | "amber"> = [
    "off",
    "red",
    "green",
    "amber",
  ];

  // Handle UI button clicks
  function handleButtonClick(event: CustomEvent<{ id: string }>) {
    const { id } = event.detail;

    // Check if the button ID exists in our colors map
    if (id in buttonColors) {
      const colorIndex = colorCycle.indexOf(buttonColors[id]);
      const nextColorIndex = (colorIndex + 1) % colorCycle.length;
      const newColor = colorCycle[nextColorIndex];

      buttonColors[id] = newColor;
      buttonColors = { ...buttonColors }; // Trigger reactivity

      handleEvent(`UI: Button clicked: ${id}, new color: ${newColor}`);

      // If it's an encoder button 1-4, also update the corresponding LED
      if (id.startsWith("encoder-") && parseInt(id.split("-")[1]) <= 4) {
        const encoderNum = id.split("-")[1];
        const ledId = `led-${encoderNum}`;

        // Update LED color in UI
        ledColors[ledId] = newColor;
        ledColors = { ...ledColors }; // Trigger reactivity

        // Only send LED command if we're connected to MIDI
        if (isConnected && k2) {
          try {
            if (newColor === "off") {
              // Turn off the LED on the physical device
              k2.unhighlightLED(id as any);
              handleEvent(`MIDI: Turned off LED for ${id}`);
            } else {
              // Highlight the LED on the physical device
              k2.highlightLED(id as any, newColor);
              handleEvent(`MIDI: Set LED for ${id} to ${newColor}`);
            }
          } catch (error) {
            handleEvent(`MIDI error: ${error}`);
          }
        }
      }

      // If it's an encoder button, activate it temporarily for visual feedback
      if (id.startsWith("encoder-")) {
        const encoderNumber = id.split("-")[1];
        const key = `encoder${encoderNumber}`;

        // Make active for a short time
        if (key in encoderActives) {
          encoderActives[key as keyof typeof encoderActives] = true;
          encoderActives = { ...encoderActives }; // Trigger reactivity

          // Reset active state after 300ms
          setTimeout(() => {
            encoderActives[key as keyof typeof encoderActives] = false;
            encoderActives = { ...encoderActives }; // Trigger reactivity
          }, 300);
        }
      }
    }
  }

  // Handle LED clicks in UI
  function handleLedClick(event: CustomEvent<{ id: string }>) {
    const { id } = event.detail;

    // Check if the LED ID exists in our colors map
    if (id in ledColors) {
      const colorIndex = colorCycle.indexOf(ledColors[id]);
      const nextColorIndex = (colorIndex + 1) % colorCycle.length;
      const newColor = colorCycle[nextColorIndex];

      ledColors[id] = newColor;
      ledColors = { ...ledColors }; // Trigger reactivity

      handleEvent(`UI: LED clicked: ${id}, new color: ${newColor}`);

      // Send MIDI message if connected
      if (isConnected && k2) {
        try {
          // Extract the encoder number from the LED id (led-1 -> 1)
          const encoderNum = id.split("-")[1];
          const encoderId = `encoder-${encoderNum}`;

          if (newColor === "off") {
            // Turn off the LED on the physical device
            k2.unhighlightLED(encoderId as any);
            handleEvent(`MIDI: Turned off LED for encoder-${encoderNum}`);
          } else {
            // Highlight the LED on the physical device
            k2.highlightLED(encoderId as any, newColor);
            handleEvent(
              `MIDI: Set LED for encoder-${encoderNum} to ${newColor}`
            );
          }
        } catch (error) {
          handleEvent(`MIDI error: ${error}`);
        }
      }
    }
  }

  onMount(async () => {
    try {
      await browserMIDIProvider.connect();
      k2 = new K2(channel, browserMIDIProvider);

      k2.on("connect", () => {
        isConnected = true;
        handleEvent("MIDI: K2 controller connected");
      });

      k2.on("connectionError", (event: unknown) => {
        const error = event as { message: string };
        isConnected = false;
        handleEvent(`MIDI: Connection error: ${error.message}`);
      });

      k2.on("button.press", (button: { name: ButtonName }) => {
        handleEvent(`MIDI: Button pressed: ${button.name}`);

        // Highlight the button in UI (if it's in our map)
        if (button.name in buttonColors) {
          // Toggle button color instead of just setting to red
          const colorIndex = colorCycle.indexOf(buttonColors[button.name]);
          const nextColorIndex = (colorIndex + 1) % colorCycle.length;
          const newColor = colorCycle[nextColorIndex];

          buttonColors[button.name] = newColor;
          buttonColors = { ...buttonColors }; // Trigger reactivity

          handleEvent(`MIDI: Button ${button.name} toggled to ${newColor}`);

          // If it's an encoder button 1-4, also update the corresponding LED
          if (
            button.name.startsWith("encoder-") &&
            parseInt(button.name.split("-")[1]) <= 4
          ) {
            const encoderNum = button.name.split("-")[1];
            const ledId = `led-${encoderNum}`;

            // Update LED in UI
            ledColors[ledId] = newColor;
            ledColors = { ...ledColors }; // Trigger reactivity

            handleEvent(
              `MIDI: LED ${ledId} updated to match button ${button.name}`
            );
          }
        }

        // If it's an encoder button, set active state
        if (button.name.startsWith("encoder-")) {
          const encoderNumber = button.name.split("-")[1];
          const key = `encoder${encoderNumber}`;

          if (key in encoderActives) {
            encoderActives[key as keyof typeof encoderActives] = true;
            encoderActives = { ...encoderActives }; // Trigger reactivity
          }
        }
      });

      k2.on("button.release", (button: { name: ButtonName }) => {
        handleEvent(`MIDI: Button released: ${button.name}`);

        // If it's an encoder button, reset the active state
        if (button.name.startsWith("encoder-")) {
          const encoderNumber = button.name.split("-")[1];
          const key = `encoder${encoderNumber}`;

          if (key in encoderActives) {
            // Wait a bit to reset active state
            setTimeout(() => {
              encoderActives[key as keyof typeof encoderActives] = false;
              encoderActives = { ...encoderActives }; // Trigger reactivity
            }, 100);
          }
        }
      });

      k2.on("knob.change", (knob: { name: string; value: number }) => {
        const knobNumber = knob.name.split("-")[1];
        if (knobNumber && `knob${knobNumber}` in knobValues) {
          knobValues[`knob${knobNumber}` as keyof typeof knobValues] =
            knob.value;
          knobValues = { ...knobValues };
          handleEvent(`MIDI: Knob changed: ${knob.name} ${knob.value}`);
        }
      });

      k2.on("fader.change", (fader: { name: string; value: number }) => {
        const faderNumber = fader.name.split("-")[1];
        if (faderNumber && `fader${faderNumber}` in faderValues) {
          faderValues[`fader${faderNumber}` as keyof typeof faderValues] =
            fader.value;
          faderValues = { ...faderValues };
          handleEvent(`MIDI: Fader changed: ${fader.name} ${fader.value}`);
        }
      });

      k2.on("encoder.turn", (encoder: { name: string; value: number }) => {
        const encoderNumber = encoder.name.split("-")[1];
        const key = `encoder${encoderNumber}`;
        if (encoderNumber && key in encoderValues) {
          encoderValues[key] = encoderValues[key] + encoder.value * 0.1;
          encoderValues = { ...encoderValues };
          handleEvent(`MIDI: Encoder turned: ${encoder.name} ${encoder.value}`);
        }
      });

      await k2.connect();
    } catch (error) {
      handleEvent(`Error initializing MIDI: ${error}`);
    }
  });
</script>

<main>
  <h1>K2 Svelte Example</h1>

  <div class="controller-container">
    <K2Surface
      encoder1Value={encoderValues.encoder1}
      encoder1Active={encoderActives.encoder1}
      encoder2Value={encoderValues.encoder2}
      encoder2Active={encoderActives.encoder2}
      encoder3Value={encoderValues.encoder3}
      encoder3Active={encoderActives.encoder3}
      encoder4Value={encoderValues.encoder4}
      encoder4Active={encoderActives.encoder4}
      encoder5Value={encoderValues.encoder5}
      encoder5Active={encoderActives.encoder5}
      encoder6Value={encoderValues.encoder6}
      encoder6Active={encoderActives.encoder6}
      led1Color={ledColors["led-1"]}
      led2Color={ledColors["led-2"]}
      led3Color={ledColors["led-3"]}
      led4Color={ledColors["led-4"]}
      knob1Value={knobValues.knob1}
      knob2Value={knobValues.knob2}
      knob3Value={knobValues.knob3}
      knob4Value={knobValues.knob4}
      knob5Value={knobValues.knob5}
      knob6Value={knobValues.knob6}
      knob7Value={knobValues.knob7}
      knob8Value={knobValues.knob8}
      knob9Value={knobValues.knob9}
      knob10Value={knobValues.knob10}
      knob11Value={knobValues.knob11}
      knob12Value={knobValues.knob12}
      fader1Value={faderValues.fader1}
      fader2Value={faderValues.fader2}
      fader3Value={faderValues.fader3}
      fader4Value={faderValues.fader4}
      buttonAColor={buttonColors.A}
      buttonBColor={buttonColors.B}
      buttonCColor={buttonColors.C}
      buttonDColor={buttonColors.D}
      buttonEColor={buttonColors.E}
      buttonFColor={buttonColors.F}
      buttonGColor={buttonColors.G}
      buttonHColor={buttonColors.H}
      buttonIColor={buttonColors.I}
      buttonJColor={buttonColors.J}
      buttonKColor={buttonColors.K}
      buttonLColor={buttonColors.L}
      buttonMColor={buttonColors.M}
      buttonNColor={buttonColors.N}
      buttonOColor={buttonColors.O}
      buttonPColor={buttonColors.P}
      button1Color={buttonColors["button-1"]}
      button2Color={buttonColors["button-2"]}
      button3Color={buttonColors["button-3"]}
      button4Color={buttonColors["button-4"]}
      button5Color={buttonColors["button-5"]}
      button6Color={buttonColors["button-6"]}
      button7Color={buttonColors["button-7"]}
      button8Color={buttonColors["button-8"]}
      button9Color={buttonColors["button-9"]}
      button10Color={buttonColors["button-10"]}
      button11Color={buttonColors["button-11"]}
      button12Color={buttonColors["button-12"]}
      encoder1ButtonColor={buttonColors["encoder-1"]}
      encoder2ButtonColor={buttonColors["encoder-2"]}
      encoder3ButtonColor={buttonColors["encoder-3"]}
      encoder4ButtonColor={buttonColors["encoder-4"]}
      encoder5ButtonColor={buttonColors["encoder-5"]}
      encoder6ButtonColor={buttonColors["encoder-6"]}
      layerButtonColor={buttonColors.layer}
      exitSetupButtonColor={buttonColors["exit-setup"]}
      on:buttonClick={handleButtonClick}
      on:ledClick={handleLedClick}
    />
  </div>

  <div class="events">
    <h2>Events</h2>
    <div class="event-list">
      {#each events as event}
        <div
          class={event.startsWith("UI:")
            ? "ui-event"
            : event.startsWith("MIDI:")
              ? "midi-event"
              : event.startsWith("DEBUG:")
                ? "debug-event"
                : "other-event"}
        >
          {event}
        </div>
      {/each}
    </div>
  </div>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background: #1a1a1a;
    color: #fff;
  }

  h1 {
    font-size: 2em;
    margin: 0 0 1rem 0;
    text-align: center;
  }

  h2 {
    font-size: 1.5em;
    margin: 1rem 0;
  }

  .controller-container {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }

  .events {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 4px;
    min-height: 200px;
    color: #000;
    font-family: monospace;
    text-align: left;
  }

  .event-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .event-list div {
    padding: 4px 8px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }

  .ui-event {
    background-color: #e6f7ff;
    border-left: 3px solid #1890ff;
  }

  .midi-event {
    background-color: #f6ffed;
    border-left: 3px solid #52c41a;
  }

  .debug-event {
    background-color: #fff7e6;
    border-left: 3px solid #faad14;
  }

  .other-event {
    background-color: #f9f9f9;
  }
</style>
