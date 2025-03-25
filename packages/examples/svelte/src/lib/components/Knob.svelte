<script lang="ts">
  export let value = 0; // Range from 0 to 1
  export let id = "";

  $: rotation = value * 310 - 150;
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
    background-color: #222;
    border: 1px solid #555;
    position: relative;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.7);
  }

  .indicator {
    position: absolute;
    top: 0;
    left: 50%;
    transform-origin: bottom center;
    width: 3px;
    height: 14px;
    background-color: #fff;
    margin-left: -1.5px;
    border-radius: 1.5px;
  }
</style>
