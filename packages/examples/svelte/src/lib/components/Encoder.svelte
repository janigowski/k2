<script lang="ts">
  export let value = 0; // Rotation value (0 to 1)
  export let active = false; // Whether the encoder is activated
  export let id = ""; // Identifier for the encoder

  // Calculate rotation angle based on value (0-1)
  // Using negative rotation value to rotate in the opposite direction
  $: rotation = -value * 360;
</script>

<div class="encoder-container">
  <svg
    class="encoder-marks"
    width="40"
    height="40"
    style="transform: rotate({rotation}deg)"
  >
    <circle
      cx="20"
      cy="20"
      r="15"
      fill="#151515"
      stroke="#3a3a3a"
      stroke-width="1"
    />

    <!-- 14 lines evenly spaced around the circle -->
    {#each Array(14) as _, i}
      <line
        x1="20"
        y1="5"
        x2="20"
        y2="9"
        stroke="#aaa"
        stroke-width="2"
        transform="rotate({i * 25.7}, 20, 20)"
      />
    {/each}
  </svg>

  <div class="encoder" class:active></div>
</div>

<style>
  .encoder-container {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .encoder-marks {
    position: absolute;
    z-index: 2;
    transition: transform 0.1s ease;
  }

  .encoder {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: #151515;
    border: 1px solid #3a3a3a;
    position: relative;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.8);
    z-index: 1;
  }

  .encoder.active {
    box-shadow:
      0 0 8px rgba(255, 255, 255, 0.6),
      inset 0 0 5px rgba(0, 0, 0, 0.7);
    border-color: #888;
  }
</style>
