<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { PUBLIC_HUBSPOT } from "$env/static/public";
  export let displayName; // User's display name, pass from parent
  export let email; // User's email, pass from parent
  const dispatch = createEventDispatcher();

  function close() {
    dispatch("close");
  }
</script>

<div class="fixed inset-0 z-50 flex justify-end">
  <div class="flex-1" on:click={close}>
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
  </div>
  <div
    class="relative h-full w-[500px] max-w-full translate-x-0 transform bg-white shadow-xl transition-transform duration-300 ease-in-out"
  >
    <!-- Close button -->
    <button on:click={close} class="absolute right-2 top-2 text-gray-600 hover:text-gray-900" aria-label="Cerrar"
      >✕</button
    >

    <!-- Embedded HubSpot form via iframe -->
    <iframe
      class="h-full w-full"
      src={`https://share.hsforms.com/${PUBLIC_HUBSPOT}?nombre_y_apellido=${displayName}&email=${email}`}
      frameBorder="0"
      title="Support Request Form"
    />
  </div>
</div>
