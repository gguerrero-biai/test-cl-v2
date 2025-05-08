<script lang="ts">
  import { AlertCircle, CheckCircle2, XCircle, ChevronDown, InfoIcon } from "lucide-svelte";
  import clsx from "clsx";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Tooltip } from "bits-ui";

  export let title: string;
  export let variant: "OK" | "DEGRADED" | "DOWN" = "OK";
  export let rowIndex: number;
  export let colIndex: number;
  export let lastRowIndex: number;
  export let monitorLength: number;
  export let typeMonitor = "normal";
  export let monitorGroup: {
    title: string;
    variant: "OK" | "DEGRADED" | "DOWN";
  }[] = [];
  export let description: string;

  let isOpen = false;

  const getIcon = () => {
    if (variant === "OK") {
      return CheckCircle2;
    }
    if (variant === "DEGRADED") {
      return AlertCircle;
    }
    return XCircle;
  };

  const getMessage = (variant: string) => {
    if (variant === "OK") {
      return "Normal";
    }
    if (variant === "DEGRADED") {
      return "Presentando problemas";
    }
    return "Fuera de servicio";
  };
</script>

{#if typeMonitor === "normal"}
  <div
    class={clsx(
      "flex items-center justify-between border-r border-t border-gray-600 bg-[#1e1e23] p-4",
      lastRowIndex === rowIndex && "border-b",
      colIndex === 0 && "border-l",
      colIndex === 0 && rowIndex === 0 && "rounded-tl-2xl",
      colIndex === 0 && lastRowIndex === rowIndex && "rounded-bl-2xl",
      colIndex === 0 && lastRowIndex === rowIndex && monitorLength % 2 !== 0 && "rounded-b-2xl",
      colIndex !== 0 && rowIndex === 0 && "rounded-tr-2xl",
      colIndex !== 0 && lastRowIndex === rowIndex && "rounded-br-2xl ",
      colIndex === 1 && monitorLength % 2 !== 0 && rowIndex === lastRowIndex - 1 && "rounded-br-2xl border-b"
    )}
  >
    <div class="flex flex-col">
      <div class="flex items-center justify-center gap-2">
        <p class="text-lg font-semibold text-white">{title}</p>
        {#if !!description}
          <Tooltip.Root openDelay={100}>
            <Tooltip.Trigger
              class=" text-ellipsis whitespace-nowrap text-xs font-medium tracking-normal text-muted-foreground"
            >
              <InfoIcon class="size-3 text-gray-500" />
            </Tooltip.Trigger>
            <Tooltip.Content class=" z-20 mt-11">
              <div
                class="max-w-[300px] items-center justify-center rounded border bg-white px-1.5 py-1 text-xs font-medium text-primary-foreground shadow-popover"
              >
                <span>{description}</span>
              </div>
            </Tooltip.Content>
          </Tooltip.Root>
        {/if}
      </div>
      <p class="text-sm text-gray-500">{getMessage(variant)}</p>
    </div>
    <svelte:component
      this={getIcon()}
      class={clsx(
        `h-6 w-6`,
        variant === "OK" && "text-[#2A5AF4]",
        variant === "DEGRADED" && "text-[#FFA337]",
        variant === "DOWN" && "text-[#FF554E]"
      )}
    />
  </div>
{/if}
{#if typeMonitor === "dropdown"}
  <DropdownMenu.Root onOpenChange={(open) => (isOpen = open)}>
    <DropdownMenu.Trigger
      class={clsx(
        "flex h-[81px] w-full items-center justify-between border-r border-t border-gray-600 bg-[#1e1e23] p-4",
        lastRowIndex === rowIndex && "border-b",
        colIndex === 0 && "border-l",
        colIndex === 0 && rowIndex === 0 && "rounded-tl-2xl",
        colIndex === 0 && lastRowIndex === rowIndex && "rounded-bl-2xl",
        colIndex !== 0 && rowIndex === 0 && "rounded-tr-2xl",
        colIndex !== 0 && lastRowIndex === rowIndex && "rounded-br-2xl",
        colIndex === 1 && monitorLength % 2 !== 0 && "border-b"
      )}
    >
      <div class="flex flex-col items-start">
        <div class="flex items-center justify-center gap-2">
          <span class="text-lg font-semibold text-white">{title}</span>
          <ChevronDown class={clsx("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </div>
        <span class="text-sm text-gray-500">{getMessage(variant)}</span>
      </div>
      <svelte:component
        this={getIcon()}
        class={clsx(
          `h-6 w-6`,
          variant === "OK" && "text-[#2A5AF4]",
          variant === "DEGRADED" && "text-[#FFA337]",
          variant === "DOWN" && "text-[#FF554E]"
        )}
      />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="border border-gray-600 bg-[#1e1e23]">
      {#each monitorGroup as group}
        <DropdownMenu.Item class="flex max-h-[50px] w-[390px] justify-between p-4 hover:bg-[#2e2e34]">
          <div class="flex flex-col">
            <span class="text-sm text-white">{group.title}</span>
            <span class="text-sm text-gray-500">{getMessage(group.variant)}</span>
          </div>
          <svelte:component
            this={getIcon()}
            class={clsx(
              `h-6 w-6`,
              variant === "OK" && "text-[#2A5AF4]",
              variant === "DEGRADED" && "text-[#FFA337]",
              variant === "DOWN" && "text-[#FF554E]"
            )}
          />
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{/if}
