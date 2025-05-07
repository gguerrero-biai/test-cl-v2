<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const hubspotId = import.meta.env.VITE_PUBLIC_HUBSPOT;
  const dispatch = createEventDispatcher();

  function close() {
    console.log(import.meta.env);
    dispatch("close");
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="absolute inset-0 bg-black bg-opacity-50" on:click={close}></div>
  <div
    class="relative mx-4 h-[815px] w-full max-w-lg transform rounded-2xl bg-white shadow-xl transition duration-300 ease-in-out"
  >
    <button on:click={close} class="absolute right-2 top-2 text-gray-600 hover:text-gray-900" aria-label="Cerrar"
      >✕</button
    >
    <iframe
      class="h-full w-full rounded-2xl"
      src={`https://share.hsforms.com/${hubspotId}`}
      frameBorder="0"
      title="Support Request Form"
    />
  </div>
</div>
