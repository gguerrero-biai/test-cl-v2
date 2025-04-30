<script lang="ts">
  import { AlertCircle, CheckCircle2, XCircle } from "lucide-svelte";
  import clsx from "clsx";

  export let title: string;
  export let variant: "OK" | "DEGRADED" | "DOWN" = "OK";

  const getIcon = () => {
    if (variant === "OK") {
      return CheckCircle2;
    }
    if (variant === "DEGRADED") {
      return AlertCircle;
    }
    return XCircle;
  };

  const getMessage = () => {
    if (variant === "OK") {
      return "Normal";
    }
    if (variant === "DEGRADED") {
      return "Presentando problemas";
    }
    return "Fuera de servicio";
  };
</script>

<div class="flex items-center justify-between bg-[#1e1e23] p-4">
  <div class="flex flex-col">
    <p class="text-lg font-semibold text-white">{title}</p>
    <p class="text-sm text-gray-500">{getMessage()}</p>
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
