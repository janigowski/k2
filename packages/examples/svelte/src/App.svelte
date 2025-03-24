<script lang="ts">
  import K2Controller from "./lib/K2Controller.svelte";

  let events: string[] = [];

  function handleEvent(message: string) {
    events = [message, ...events];
  }
</script>

<main>
  <h1>K2 Svelte Example</h1>
  <K2Controller {events} onEvent={handleEvent} />
  <div class="events">
    {#each events as event}
      <div>{event}</div>
    {/each}
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
    margin: 0;
    text-align: center;
  }

  .events {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 4px;
    min-height: 200px;
    color: #000;
    font-family: monospace;
  }
</style>
