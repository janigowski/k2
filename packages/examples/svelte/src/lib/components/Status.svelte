<script lang="ts">
  export let isConnected: boolean;
</script>

<div
  class="status"
  class:connected={isConnected}
  class:disconnected={!isConnected}
>
  {isConnected ? "Connected" : "Disconnected"}
</div>

<style>
  .status {
    transition: all 0.2s;
  }

  .status.connected {
    background-color: #d4edda;
    color: #155724;
  }

  .status.disconnected {
    background-color: #f8d7da;
    color: #721c24;
  }
</style>
