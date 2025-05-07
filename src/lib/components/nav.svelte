<script>
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Menu } from "lucide-svelte";
  import { base } from "$app/paths";
  import { analyticsEvent } from "$lib/boringOne";
  import GMI from "$lib/components/gmi.svelte";
  import ContactFormModal from "$lib/components/contactForm.svelte";

  export let data;
  let defaultPattern = data.site?.pattern || "squares";

  let showContactModal = false;
  function openContactModal() {
    showContactModal = true;
  }
  function closeContactModal() {
    showContactModal = false;
  }
</script>

<div class="relative">
  <div class="{defaultPattern}-pattern"></div>
</div>

<header class="blurry-bg sticky top-3 z-50 mx-auto">
  <div class="container flex h-16 max-w-[970px] items-center border bg-card px-3 md:rounded-md">
    <a rel="external" href={data.site.home ? data.site.home : base}>
      <GMI src={data.site.logo} classList="w-8" alt={data.site.title} srcset="" />
    </a>
    {#if data.site.siteName}
      <span class="  inline-block text-[15px] font-bold lg:text-base">
        {data.site.siteName}
      </span>
    {/if}

    <div class="flex flex-1 justify-end">
      <button
        class="flex rounded-md px-3 py-2 text-card-foreground transition-all ease-linear hover:bg-background"
        on:click={openContactModal}
      >
        <span>Ayuda</span>
      </button>
      {#if data.site.nav}
        <nav class=" hidden flex-wrap items-center text-sm font-medium md:flex">
          {#each data.site.nav as navItem}
            <a
              rel="external"
              href={navItem.url}
              class="flex rounded-md px-3 py-2 text-card-foreground transition-all ease-linear hover:bg-background"
              on:click={() => analyticsEvent("nav", navItem.name)}
            >
              {#if navItem.iconURL}
                <GMI src={navItem.iconURL} classList="mr-1.5 mt-0.5 inline h-4" alt={navItem.name} />
              {/if}
              <span>{navItem.name}</span>
            </a>
          {/each}
        </nav>
        <div class="flex md:hidden">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="outline" size="sm">
                <Menu size={14} />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {#each data.site.nav as navItem}
                <DropdownMenu.Group>
                  <DropdownMenu.Item>
                    <a rel="external" href={navItem.url}> {navItem.name} </a>
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
              {/each}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      {/if}
    </div>
  </div>
</header>

{#if showContactModal}
  <ContactFormModal on:close={closeContactModal} />
{/if}
