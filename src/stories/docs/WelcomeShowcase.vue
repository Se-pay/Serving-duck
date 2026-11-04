<script lang="ts" setup>
import SDLabel from '@/components/atoms/SDLabel.vue';
import SDTitle from '@/components/atoms/SDTitle.vue';
</script>

<template>
  <div
    class="w-full max-w-2xl mx-auto flex flex-col gap-6 p-6 rounded-sd-lg border border-sd-border bg-sd-surface text-sd-fg shadow-lg"
  >
    <!-- Header banner -->
    <div
      class="flex items-center justify-between border-b border-sd-border-subtle pb-4"
    >
      <div
        class="flex flex-col gap-1"
      >
        <span
          class="text-xs font-semibold uppercase tracking-wider text-sd-accent font-sd-mono"
        >
          Royal Duck Tactical Systems
        </span>

        <SDTitle
          as="h3"
          size="md"
          status="success"
          title="Command Deck 01"
        />
      </div>

      <div
        class="flex items-center gap-2"
      >
        <span
          class="px-2.5 py-1 text-xs font-semibold rounded-full bg-sd-elevated text-sd-status-success border border-sd-border"
        >
          ● Operational
        </span>
      </div>
    </div>

    <!-- Quick stats grid -->
    <div
      class="grid grid-cols-1 sm:grid-cols-3 gap-3"
    >
      <div
        class="p-4 rounded-sd-md bg-sd-canvas border border-sd-border flex flex-col gap-1"
      >
        <SDLabel
          size="xs"
        >
          Engine Status
        </SDLabel>

        <SDTitle
          as="h4"
          size="md"
          status="primary"
          title="99.98% Sync"
        />
      </div>

      <div
        class="p-4 rounded-sd-md bg-sd-canvas border border-sd-border flex flex-col gap-1"
      >
        <SDLabel
          size="xs"
        >
          Active Fleet
        </SDLabel>

        <SDTitle
          as="h4"
          size="md"
          status="accent"
          title="1,420 Ships"
        />
      </div>

      <div
        class="p-4 rounded-sd-md bg-sd-canvas border border-sd-border flex flex-col gap-1"
      >
        <SDLabel
          size="xs"
        >
          Threat Level
        </SDLabel>

        <SDTitle
          as="h4"
          size="md"
          status="warning"
          title="Elevated"
        />
      </div>
    </div>

    <!-- Interactive form element demo -->
    <div
      class="flex flex-col gap-3 p-4 rounded-sd-md bg-sd-canvas border border-sd-border"
    >
      <div
        class="flex flex-col gap-1.5"
      >
        <SDLabel
          for="operator-callsign"
          required
          size="xs"
        >
          Operator Callsign
        </SDLabel>

        <div
          class="flex items-center gap-3"
        >
          <input
            id="operator-callsign"
            type="text"
            readonly
            value="Vanguard-Ace"
            class="flex-1 px-3 py-2 text-sm rounded-sd-sm border border-sd-border bg-sd-surface text-sd-fg focus:outline-none focus:border-sd-primary font-sd-mono"
          />

          <button
            type="button"
            class="px-4 py-2 text-xs font-semibold rounded-sd-sm bg-sd-primary hover:bg-sd-primary-hover text-sd-primary-fg transition-colors cursor-pointer"
          >
            Deploy Unit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

