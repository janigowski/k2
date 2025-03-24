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
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
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
