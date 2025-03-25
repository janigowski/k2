<script lang="ts">
  export let value = 0; // Range from 0 to 1
  export let id = "";

  // Convert value to rotation in degrees
  // 7 o'clock = 0 (210 degrees)
  // 5 o'clock = 1 (150 degrees)
  // Total range is 300 degrees, moving clockwise
  $: rotation = 210 - value * 300;
</script>

<div class="knob-container">
  <div class="knob">
    <div class="indicator" style="transform: rotate({rotation}deg)"></div>
  </div>
</div>

<style>
  .knob-container {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .knob {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #111;
    border: 1px solid #555;
    position: relative;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.7);
  }

  .indicator {
    position: absolute;
    top: 4px;
    left: 50%;
    transform-origin: bottom center;
    width: 2px;
    height: 10px;
    background-color: #fff;
    margin-left: -1px;
  }
</style>
