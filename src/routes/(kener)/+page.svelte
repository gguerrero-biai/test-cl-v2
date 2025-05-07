<script>
  import MonitorLight from "$lib/components/monitorLigth.svelte";
  import { Button } from "$lib/components/ui/button";
  import { l } from "$lib/i18n/client";
  import { base } from "$app/paths";
  import { ChevronLeft, X, Dot, CheckCircle2, XCircle } from "lucide-svelte";
  import { hotKeyAction, clickOutsideAction } from "svelte-legos";
  import { onMount } from "svelte";
  import ShareMenu from "$lib/components/shareMenu.svelte";
  import { scale } from "svelte/transition";
  import { format } from "date-fns";
  import { clsx } from "clsx";

  export let data;

  let shareMenusToggle = false;
  function showShareMenu(e) {
    shareMenusToggle = true;
    activeMonitor = e.detail.monitor;
  }
  let activeMonitor = null;
  let pageLoaded = false;
  $: {
    if (pageLoaded) {
      if (shareMenusToggle) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  }

  onMount(() => {
    pageLoaded = true;
  });
  let kindFilter = "INCIDENT";
  function kindOfIncidents(kind) {
    kindFilter = kind;
  }

  if (data.allRecentIncidents.length == 0) {
    kindOfIncidents("MAINTENANCE");
  }

  $: monitorStatus = (() => {
    if (!data.monitors) return "OK";
    if (
      data.monitors.some((monitor) => {
        const status = monitor.pageData?.summaryStatus?.toLowerCase() || "";
        return status.includes("down");
      })
    ) {
      return "DOWN";
    }
    if (
      data.monitors.some((monitor) => {
        const status = monitor.pageData?.summaryStatus?.toLowerCase() || "";
        return status.includes("degraded");
      })
    ) {
      return "DEGRADED";
    }
    return "OK";
  })();

  const getMonitorStatus = (status) => {
    if (status === "api-down") {
      return "DOWN";
    }
    if (status === "api-degraded") {
      return "DEGRADED";
    }
    return "OK";
  };

  const hasIncidents = () => {
    return (
      data.allRecentIncidents.some((incident) => {
        return incident.state !== "RESOLVED";
      }) ||
      data.allRecentMaintenances.some((maintenance) => {
        return maintenance.status !== "CLOSED";
      })
    );
  };

  const getIncidentTitle = (incident) => {
    if (incident.state === "RESOLVED") {
      return "Resuelto";
    }
    if (incident.state === "MONITORING") {
      return "Monitoreando";
    }
    if (incident.state === "IDENTIFIED") {
      return "Identificado";
    }
    if (incident.state === "INVESTIGATING") {
      return "Investigando";
    }
    return incident.state;
  };
</script>

<svelte:head>
  <title>{data.pageTitle}</title>
  {#if !!data.pageDescription}
    <meta name="description" content={data.pageDescription} />
  {/if}
  {#if !!data.canonical}
    <link rel="canonical" href={data.canonical} />
  {/if}
  {#if data.site.metaTags}
    {#each data.site.metaTags as metaTag}
      {#if metaTag.key != "description"}
        <meta name={metaTag.key} content={metaTag.value} />
      {/if}
    {/each}
  {/if}
</svelte:head>

{#if data.hero}
  <!-- <section class="section-hero mx-auto mb-8 flex w-full max-w-[655px] flex-1 flex-col items-start justify-center">
    <div class="mx-auto max-w-screen-xl px-4 lg:flex lg:items-center">
      <div class="blurry-bg mx-auto max-w-3xl text-center">
        {#if data.hero.image}
          <GMI src={data.hero.image} classList="m-auto mb-2 h-14 w-14" alt="" srcset="" />
        {/if}
        {#if monitorStatus == "OK"}
          <div class="w-full bg-[#2A5AF4]">
            <h1>Celes esta en funcionamiento</h1>
          </div>
        {/if}
        {#if monitorStatus == "DEGRADED"}
          <div class="flex flex-col gap-5">
            <div class="relative mx-auto h-fit w-fit">
              <div class="absolute right-0 top-0 z-10 h-7 w-4 -translate-x-9 translate-y-8 bg-white" />
              <div class="absolute inset-0 z-0 h-full w-full rounded-full bg-[#FFA337] opacity-20 blur-md" />
              <img src={base + "/warning.svg"} class="relative z-20 inline-block h-20 w-20" alt="warning" />
            </div>
            <div>
              <h1 class="text-2xl">Celes tiene errores que no comprometen su funcionamiento</h1>
              <p class="color-[#414141] mt-1.5 w-full text-center text-lg">
                ¿Tienes problemas? Haz clic <button type="button" class="underline" on:click={openContactModal}>
                  aquí
                </button> para contactarnos.
              </p>
            </div>
          </div>
        {/if}
        {#if monitorStatus == "DOWN"}
          <div class="flex flex-col gap-5">
            <div class="relative mx-auto h-fit w-fit">
              <div class="absolute right-0 top-0 z-10 h-7 w-8 -translate-x-6 translate-y-8 bg-white" />
              <div class="absolute inset-0 z-0 h-full w-full rounded-full bg-[#FF554E] opacity-20 blur-md" />
              <img src={base + "/outage.svg"} class="relative z-20 inline-block h-20 w-20" alt="outage" />
            </div>
            <div>
              <h1 class="text-2xl">Celes está caído. Estamos trabajando para solucionarlo</h1>
              <p class="color-[#414141] mt-1.5 w-full text-center text-lg">
                ¿Tienes problemas? Haz clic <button type="button" class="underline" on:click={openContactModal}>
                  aquí
                </button> para contactarnos.
              </p>
            </div>
          </div>
        {/if}
        {#if data.hero.title}
          <h1
            class="bg-gradient-to-r from-white via-[#2A5AF4] to-[#2A5AF4] bg-clip-text text-5xl font-extrabold leading-tight text-transparent"
          >
            {@html data.hero.title}
          </h1>
        {/if}
        {#if data.hero.subtitle}
          <h2 class="mx-auto mt-4 max-w-xl sm:text-xl">
            {@html data.hero.subtitle}
          </h2>
        {/if}
      </div>
    </div>
  </section> -->
  <!-- svelte-ignore a11y-no-redundant-roles -->
  <section id="floating-section" class="flex justify-center py-20" role="region">
    <div class="flex flex-col items-center">
      <span class="text-7xl">Tu Copiloto para cadena</span>
      <span class="text-7xl">de suministro</span>
    </div>
  </section>
  <section class="section-hero relative mx-auto mb-8 w-full max-w-[800px] items-center justify-center">
    {#if monitorStatus == "OK"}
      <div class="flex w-full items-center gap-3 rounded-t-sm border border-[#2A5AF4] bg-[#2A5AF4] px-5 py-3">
        <CheckCircle2 class="fill-white font-extrabold text-[#2A5AF4]" />
        <h1 class="text-start text-xl font-bold text-white">Celes está en funcionamiento</h1>
      </div>
    {/if}
    {#if monitorStatus == "DEGRADED"}
      <div class="flex w-full items-center gap-3 rounded-t-sm border border-[#FFA337] bg-[#FFA337] px-5 py-3">
        <CheckCircle2 class="fill-white font-extrabold text-[#FFA337]" />
        <h1 class="text-start text-xl font-bold text-white">Celes está presentando problemas</h1>
      </div>
    {/if}
    {#if monitorStatus == "DOWN"}
      <div class="flex w-full items-center gap-3 rounded-t-sm border border-[#FF554E] bg-[#FF554E] px-5 py-3">
        <XCircle class="fill-white font-extrabold text-[#FF554E]" />
        <h1 class="text-start text-xl font-bold text-white">Celes está fuera de servicio</h1>
      </div>
    {/if}
    {#if hasIncidents()}
      <div
        class={clsx(
          "flex h-auto w-full flex-col gap-3 rounded-b-sm border bg-white px-6 py-8",
          monitorStatus === "DOWN" && "border-[#FF554E]",
          monitorStatus === "DEGRADED" && "border-[#FFA337]",
          monitorStatus === "OK" && "border-[#2A5AF4]"
        )}
      >
        {#each data.allRecentIncidents as incident}
          {#if incident.state !== "RESOLVED"}
            <div>
              <div class="flex w-full gap-1">
                <div class="flex gap-1">
                  <span class="font-bold capitalize text-gray-800">{getIncidentTitle(incident)}</span>
                  <span class="font-bold text-gray-800">-</span>
                  <div>
                    <span class="text-left font-normal text-gray-800"
                      >{incident.comments[incident.comments.length - 1].comment}</span
                    >
                    <span>-</span>
                    <span class="font-normal text-gray-400">
                      {format(new Date(incident.created_at), "MMM d, yyyy - HH:mm")} UTC
                    </span>
                  </div>
                </div>
                <div
                  class={clsx(
                    "ml-1 flex h-fit items-center rounded-full p-3 text-sm text-white",
                    monitorStatus === "DOWN" && "bg-[#FF554E]",
                    monitorStatus === "DEGRADED" && "bg-[#FFA337]",
                    monitorStatus === "OK" && "bg-[#2A5AF4]"
                  )}
                >
                  Incidencia
                </div>
              </div>
            </div>
            <div>
              {#each incident.comments as comment, index}
                {#if index < incident.comments.length - 1}
                  <div class="flex flex-col">
                    <div class="flex gap-2">
                      <div class="flex h-fit w-fit items-start justify-start">
                        <Dot class="text-gray-500" />
                      </div>
                      <div>
                        <span class="font-normal text-gray-800">
                          {comment.comment}
                        </span>
                        <span class="font-normal text-gray-400">
                          - {format(new Date(comment.created_at), "MMM d, yyyy - HH:mm")} UTC
                        </span>
                      </div>
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        {/each}

        {#each data.allRecentMaintenances as maintenance}
          <div>
            <div class="flex w-full gap-1">
              <span class="font-bold capitalize text-gray-800">{maintenance.state.toLowerCase()} - </span>
              <span class="font-normal text-gray-800"
                >{maintenance.comments[maintenance.comments.length - 1].comment}</span
              >
              <div
                class={clsx(
                  "ml-1 flex items-center rounded-full px-3 text-sm text-white",
                  monitorStatus === "DOWN" && "bg-[#FF554E]",
                  monitorStatus === "DEGRADED" && "bg-[#FFA337]",
                  monitorStatus === "OK" && "bg-[#2A5AF4]"
                )}
              >
                Mantenimiento
              </div>
            </div>
            <span class="font-normal text-gray-400">
              {format(new Date(maintenance.created_at), "MMM d, yyyy - HH:mm")} UTC
            </span>
          </div>
          <div>
            {#each maintenance.comments as comment, index}
              {#if index < maintenance.comments.length - 1}
                <div class="flex flex-col">
                  <div class="flex gap-2">
                    <div class="flex h-fit w-fit items-start justify-start">
                      <Dot class="text-gray-500" />
                    </div>
                    <div>
                      <span class="font-normal text-gray-800">
                        {comment.comment}
                      </span>
                      <span class="font-normal text-gray-400">
                        - {format(new Date(comment.created_at), "MMM d, yyyy - HH:mm")} UTC
                      </span>
                    </div>
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  </section>
{/if}
{#if data.pageType != "home"}
  <section class="section-back mx-auto mb-2 flex w-full max-w-[800px] flex-1 flex-col items-start justify-center">
    <Button
      variant="outline"
      class="bounce-left h-8  justify-start  pl-1.5"
      on:click={() => {
        if (data.pageType == "category") {
          return window.history.back();
        } else if (data.pageType == "monitor") {
          return (window.location.href = `${base}/`);
        } else if (data.pageType == "group") {
          return (window.location.href = `${base}/`);
        }
      }}
    >
      <ChevronLeft class="arrow mr-1 h-5 w-5" />
      {l(data.lang, "Back")}
    </Button>
  </section>
{/if}
{#if data.monitors.length > 0}
  <section
    class="section-legend mx-auto mb-4 flex w-full flex-1 flex-col items-start justify-center bg-transparent px-2 md:w-[800px]"
    id=""
  >
    <span class="text-2xl font-bold"> Estado Actual: Celes.ai </span>
  </section>
  <section class="section-monitors z-20 mx-auto mb-8 flex w-full flex-1 items-start justify-center md:w-[800px]">
    <table
      class="w-full table-fixed border-separate border-spacing-0 overflow-hidden rounded-sm border border-gray-500 bg-[#1e1e23]"
    >
      <colgroup>
        <col class="w-1/2" />
        <col class="w-1/2" />
      </colgroup>
      <tbody>
        {#each Array(Math.ceil(data.monitors.length / 2)) as _, rowIndex}
          <tr>
            <!-- First column -->
            <td class="border-r border-gray-600 p-0">
              <MonitorLight
                title={data.monitors[rowIndex * 2].name}
                variant={getMonitorStatus(data.monitors[rowIndex * 2].pageData.summaryColorClass)}
              />
            </td>
            <!-- Second column, if exists -->
            {#if data.monitors[rowIndex * 2 + 1]}
              <td class="p-0">
                <MonitorLight
                  title={data.monitors[rowIndex * 2 + 1].name}
                  variant={getMonitorStatus(data.monitors[rowIndex * 2 + 1].pageData.summaryColorClass)}
                />
              </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
{/if}
<!-- {#if data.site.categories && data.pageType == "home"}
  <section
    class="section-categories relative z-10 mx-auto mb-8 w-full max-w-[800px] flex-1 flex-col items-start backdrop-blur-[2px] md:w-[800px]"
  >
    {#each data.site.categories.filter((e) => e.name != "Home") as category}
      <a href={`?category=${category.name}`} rel="external">
        <Card.Root class="mb-4 hover:bg-secondary">
          <Card.Header class="bounce-right relative w-full cursor-pointer px-4  ">
            <Card.Title class="w-full ">
              {category.name}
              <Button
                variant="ghost"
                class="arrow absolute right-4 top-9 h-5 w-5 p-0 text-muted-foreground"
                size="icon"
              >
                <ArrowRight class="h-4 w-4" />
              </Button>
            </Card.Title>
            <Card.Description>
              {#if category.description}
                {@html category.description}
              {/if}
            </Card.Description>
          </Card.Header>
        </Card.Root>
      </a>
    {/each}
  </section>
{/if} -->
<!-- {#if data.allRecentIncidents.length + data.allRecentMaintenances.length > 0}
  <section
    class="section-events mx-auto mb-8 flex w-full max-w-[655px] flex-1 flex-col items-start justify-center backdrop-blur-[2px]"
    id=""
  >
    <div class="mb-2 grid w-full grid-cols-2 gap-4">
      <div class="col-span-2 flex gap-x-2 text-center md:text-left">
        {#if kindFilter == "INCIDENT"}
          {#if data.allRecentIncidents.length > 0}
            <Button class="h-8   text-sm  " on:click={() => kindOfIncidents("INCIDENT")}>
              {l(data.lang, "Recent Incidents")}
            </Button>
          {/if}
          {#if data.allRecentMaintenances.length > 0}
            <Button variant="secondary" class=" h-8 text-sm" on:click={() => kindOfIncidents("MAINTENANCE")}>
              {l(data.lang, "Recent Maintenances")}
            </Button>
          {/if}
        {:else}
          {#if data.allRecentIncidents.length > 0}
            <Button variant="secondary" class="h-8  text-sm " on:click={() => kindOfIncidents("INCIDENT")}>
              {l(data.lang, "Recent Incidents")}
            </Button>
          {/if}
          {#if data.allRecentMaintenances.length > 0}
            <Button class="h-8  text-sm" on:click={() => kindOfIncidents("MAINTENANCE")}>
              {l(data.lang, "Recent Maintenances")}
            </Button>
          {/if}
        {/if}
      </div>
    </div>
    <Card.Root class="w-full">
      {#if kindFilter == "INCIDENT"}
        <Card.Content class=" newincidents w-full overflow-hidden p-0">
          {#each data.allRecentIncidents as incident, index}
            <Incident {incident} lang={data.lang} index="incident-{index}" selectedLang={data.selectedLang} />
          {/each}
        </Card.Content>
      {:else if kindFilter == "MAINTENANCE"}
        {#each data.allRecentMaintenances as incident, index}
          <Incident {incident} lang={data.lang} index="incident-{index}" selectedLang={data.selectedLang} />
        {/each}
      {/if}
    </Card.Root>
  </section>
{/if} -->
<!-- <section
  class="section-browser-events mx-auto mb-2 flex w-full max-w-[655px] flex-1 flex-col items-start justify-center bg-transparent"
  id=""
>
  <a
    href="{base}/incidents/{format(new Date(), 'MMMM-yyyy')}"
    rel="external"
    class="bounce-right grid w-full cursor-pointer grid-cols-2 justify-between gap-4 rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
  >
    <div class="col-span-1 text-left">
      {l(data.lang, "Browse Events")}
    </div>
    <div class="text-right">
      <span class="arrow float-right mt-0.5">
        <ArrowRight class="h-4 w-4 text-muted-foreground hover:text-primary" />
      </span>
    </div>
  </a>
</section> -->

{#if shareMenusToggle}
  <div
    transition:scale={{ duration: 100 }}
    use:hotKeyAction={{
      code: "Escape",
      cb: () => (shareMenusToggle = false)
    }}
    class="moldal-container fixed left-0 top-0 z-30 h-screen w-full bg-card bg-opacity-30 backdrop-blur-sm"
  >
    <div
      use:clickOutsideAction
      on:clickoutside={() => {
        shareMenusToggle = false;
      }}
      class="absolute left-1/2 top-1/2 h-fit w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md border bg-background shadow-lg backdrop-blur-lg md:w-[568px]"
    >
      <Button
        variant="ghost"
        on:click={() => {
          shareMenusToggle = false;
        }}
        class="absolute right-2 top-2 z-40 h-6 w-6   rounded-full border bg-background p-1"
      >
        <X class="h-4 w-4   text-muted-foreground" />
      </Button>
      <div class="content">
        <ShareMenu monitor={activeMonitor} lang={data.lang} selectedLang={data.selectedLang} />
      </div>
    </div>
  </div>
{/if}
