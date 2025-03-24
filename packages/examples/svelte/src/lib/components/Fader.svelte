<script lang="ts">
  export let value = 0; // Range from 0 to 1
  export let id = "";
</script>

<div class="fader-container">
  <div class="fader-track">
    <div class="fader-handle" style="bottom: calc({value * 100}% - 10px)"></div>
  </div>
</div>

<style>
  .fader-container {
    width: 30px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .fader-track {
    width: 10px;
    height: 90px;
    background-color: #111;
    border: 1px solid #555;
    position: relative;
    border-radius: 2px;
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.7);
  }

  .fader-handle {
    position: absolute;
    left: -5px;
    width: 20px;
    height: 20px;
    background-color: #ddd;
    border-radius: 3px;
    border: 1px solid #777;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
</style>
