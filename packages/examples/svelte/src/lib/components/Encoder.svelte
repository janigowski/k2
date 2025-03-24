<script lang="ts">
  export let value = 0; // Rotation value (0 to 1)
  export let active = false; // Whether the encoder is activated
  export let id = ""; // Identifier for the encoder
</script>

<div class="encoder-container">
  <div class="encoder" class:active>
    <div class="indicator" style="transform: rotate({value * 360}deg)"></div>
  </div>
</div>

<style>
  .encoder-container {
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .encoder {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #111;
    border: 1px solid #555;
    position: relative;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.7);
  }

  .encoder.active {
    box-shadow:
      0 0 5px rgba(255, 255, 255, 0.5),
      inset 0 0 5px rgba(0, 0, 0, 0.7);
  }

  .indicator {
    position: absolute;
    top: 5px;
    left: 50%;
    transform-origin: bottom center;
    width: 2px;
    height: 15px;
    background-color: #fff;
    margin-left: -1px;
  }
</style>
