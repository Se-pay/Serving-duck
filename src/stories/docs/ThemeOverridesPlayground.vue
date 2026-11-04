<script lang="ts" setup>
import { computed, type ComputedRef, ref, type Ref } from 'vue';

import SDLabel from '@/components/atoms/SDLabel.vue';
import SDTitle from '@/components/atoms/SDTitle.vue';

interface IThemePreset {
  name: string;
  primary: string;
  primaryHover: string;
  accent: string;
  bgCanvas: string;
  bgSurface: string;
  borderColor: string;
}

const presets: Record<string, IThemePreset> = {
  royal: {
    name: 'Royal Duck (Default)',
    primary: '#6366f1',
    primaryHover: '#818cf8',
    accent: '#fbbf24',
    bgCanvas: '#020617',
    bgSurface: '#0f172a',
    borderColor: '#334155',
  },
  cyberpunk: {
    name: 'Cyberpunk Neon',
    primary: '#06b6d4',
    primaryHover: '#22d3ee',
    accent: '#f43f5e',
    bgCanvas: '#09090b',
    bgSurface: '#18181b',
    borderColor: '#27272a',
  },
  emerald: {
    name: 'Emerald Fleet',
    primary: '#10b981',
    primaryHover: '#34d399',
    accent: '#f59e0b',
    bgCanvas: '#022c22',
    bgSurface: '#064e3b',
    borderColor: '#065f46',
  },
  crimson: {
    name: 'Crimson Vanguard',
    primary: '#e11d48',
    primaryHover: '#fb7185',
    accent: '#fbbf24',
    bgCanvas: '#1c1917',
    bgSurface: '#292524',
    borderColor: '#44403c',
  },
};

const activePresetKey: Ref<string> = ref<string>('royal');
const customPrimary: Ref<string> = ref<string>(presets['royal']?.primary ?? '#6366f1');
const customAccent: Ref<string> = ref<string>(presets['royal']?.accent ?? '#fbbf24');
const customCanvas: Ref<string> = ref<string>(presets['royal']?.bgCanvas ?? '#020617');
const customSurface: Ref<string> = ref<string>(presets['royal']?.bgSurface ?? '#0f172a');
const customBorder: Ref<string> = ref<string>(presets['royal']?.borderColor ?? '#334155');

const copied: Ref<boolean> = ref<boolean>(false);

const applyPreset = (key: string): void => {
  activePresetKey.value = key;
  const p: IThemePreset | undefined = presets[key];
  if (p) {
    customPrimary.value = p.primary;
    customAccent.value = p.accent;
    customCanvas.value = p.bgCanvas;
    customSurface.value = p.bgSurface;
    customBorder.value = p.borderColor;
  }
};

const previewStyle: ComputedRef<Record<string, string>> = computed((): Record<string, string> => {
  return {
    '--sd-primary': customPrimary.value,
    '--sd-accent': customAccent.value,
    '--sd-bg-canvas': customCanvas.value,
    '--sd-bg-surface': customSurface.value,
    '--sd-border-default': customBorder.value,
  };
});

const generatedCss: ComputedRef<string> = computed((): string => {
  return `/* Scoped theme override */
.custom-theme-scope {
  --sd-primary: ${customPrimary.value};
  --sd-accent: ${customAccent.value};
  --sd-bg-canvas: ${customCanvas.value};
  --sd-bg-surface: ${customSurface.value};
  --sd-border-default: ${customBorder.value};
}`;
});

const copyCss = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(generatedCss.value);
    copied.value = true;
    setTimeout((): void => {
      copied.value = false;
    }, 2000);
  } catch {
    copied.value = false;
  }
};
</script>

<template>
  <div
    class="flex flex-col gap-6 p-6 rounded-sd-lg border border-sd-border bg-sd-surface text-sd-fg"
  >
    <div>
      <SDTitle
        as="h3"
        size="md"
        status="accent"
        title="Interactive Color Override Playground"
      />

      <p
        class="text-sm text-sd-fg-muted mt-2"
      >
        Customize semantic CSS custom properties below or pick a preset. The preview container updates instantly using scoped CSS custom properties.
      </p>
    </div>

    <!-- Preset Buttons -->
    <div
      class="flex flex-wrap items-center gap-2"
    >
      <span
        class="text-xs font-semibold uppercase tracking-wider text-sd-fg-muted mr-1"
      >
        Presets:
      </span>

      <button
        v-for="(preset, key) in presets"
        :key="key"
        type="button"
        class="px-3 py-1.5 text-xs font-medium rounded-sd-sm border transition-colors cursor-pointer"
        :class="[
          activePresetKey === key
            ? 'border-sd-primary bg-sd-elevated text-sd-fg font-semibold'
            : 'border-sd-border hover:bg-sd-elevated text-sd-fg-muted',
        ]"
        @click="applyPreset(String(key))"
      >
        {{ preset.name }}
      </button>
    </div>

    <!-- Color Pickers Grid -->
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-4 rounded-sd-md bg-sd-canvas border border-sd-border"
    >
      <div
        class="flex flex-col gap-1.5"
      >
        <SDLabel
          for="override-primary"
          size="xs"
        >
          --sd-primary
        </SDLabel>

        <div
          class="flex items-center gap-2"
        >
          <input
            id="override-primary"
            v-model="customPrimary"
            type="color"
            class="w-8 h-8 rounded-sd-sm border border-sd-border bg-transparent cursor-pointer"
          />

          <span
            class="text-xs font-mono text-sd-fg-muted"
          >
            {{ customPrimary }}
          </span>
        </div>
      </div>

      <div
        class="flex flex-col gap-1.5"
      >
        <SDLabel
          for="override-accent"
          size="xs"
        >
          --sd-accent
        </SDLabel>

        <div
          class="flex items-center gap-2"
        >
          <input
            id="override-accent"
            v-model="customAccent"
            type="color"
            class="w-8 h-8 rounded-sd-sm border border-sd-border bg-transparent cursor-pointer"
          />

          <span
            class="text-xs font-mono text-sd-fg-muted"
          >
            {{ customAccent }}
          </span>
        </div>
      </div>

      <div
        class="flex flex-col gap-1.5"
      >
        <SDLabel
          for="override-canvas"
          size="xs"
        >
          --sd-bg-canvas
        </SDLabel>

        <div
          class="flex items-center gap-2"
        >
          <input
            id="override-canvas"
            v-model="customCanvas"
            type="color"
            class="w-8 h-8 rounded-sd-sm border border-sd-border bg-transparent cursor-pointer"
          />

          <span
            class="text-xs font-mono text-sd-fg-muted"
          >
            {{ customCanvas }}
          </span>
        </div>
      </div>

      <div
        class="flex flex-col gap-1.5"
      >
        <SDLabel
          for="override-surface"
          size="xs"
        >
          --sd-bg-surface
        </SDLabel>

        <div
          class="flex items-center gap-2"
        >
          <input
            id="override-surface"
            v-model="customSurface"
            type="color"
            class="w-8 h-8 rounded-sd-sm border border-sd-border bg-transparent cursor-pointer"
          />

          <span
            class="text-xs font-mono text-sd-fg-muted"
          >
            {{ customSurface }}
          </span>
        </div>
      </div>

      <div
        class="flex flex-col gap-1.5"
      >
        <SDLabel
          for="override-border"
          size="xs"
        >
          --sd-border-default
        </SDLabel>

        <div
          class="flex items-center gap-2"
        >
          <input
            id="override-border"
            v-model="customBorder"
            type="color"
            class="w-8 h-8 rounded-sd-sm border border-sd-border bg-transparent cursor-pointer"
          />

          <span
            class="text-xs font-mono text-sd-fg-muted"
          >
            {{ customBorder }}
          </span>
        </div>
      </div>
    </div>

    <!-- Live Preview Scope Container -->
    <div
      class="p-6 rounded-sd-md border transition-all duration-300"
      :style="previewStyle"
      style="background-color: var(--sd-bg-canvas); border-color: var(--sd-border-default);"
    >
      <div
        class="flex flex-col gap-4 p-5 rounded-sd-md border"
        style="background-color: var(--sd-bg-surface); border-color: var(--sd-border-default);"
      >
        <div
          class="flex items-center justify-between flex-wrap gap-2"
        >
          <SDTitle
            as="h4"
            size="md"
            status="primary"
            title="Scoped Override Live Preview"
          />

          <span
            class="text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider"
            style="background-color: var(--sd-accent); color: var(--sd-accent-fg, #0f172a);"
          >
            Accent Badge
          </span>
        </div>

        <div
          class="flex flex-col gap-1"
        >
          <SDLabel
            for="demo-input"
            required
            size="xs"
          >
            Tactical Callsign
          </SDLabel>

          <input
            id="demo-input"
            type="text"
            readonly
            value="Vanguard-One"
            class="px-3 py-2 text-sm rounded-sd-sm border text-sd-fg focus:outline-none"
            style="background-color: var(--sd-bg-canvas); border-color: var(--sd-border-default);"
          />
        </div>

        <div
          class="flex flex-wrap items-center gap-3 pt-2"
        >
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold rounded-sd-md shadow-sm transition-transform active:scale-95 cursor-pointer text-sd-primary-fg"
            style="background-color: var(--sd-primary);"
          >
            Primary Action
          </button>

          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold rounded-sd-md border transition-transform active:scale-95 cursor-pointer"
            style="border-color: var(--sd-border-default); color: var(--sd-fg-primary);"
          >
            Secondary Action
          </button>
        </div>
      </div>
    </div>

    <!-- Generated CSS Output -->
    <div
      class="flex flex-col gap-2"
    >
      <div
        class="flex items-center justify-between"
      >
        <SDLabel
          size="xs"
        >
          Generated CSS
        </SDLabel>

        <button
          type="button"
          class="text-xs px-2.5 py-1 rounded-sd-sm border border-sd-border hover:bg-sd-elevated text-sd-fg-muted cursor-pointer transition-colors"
          @click="copyCss"
        >
          {{ copied ? 'Copied to Clipboard!' : 'Copy CSS' }}
        </button>
      </div>

      <pre
        class="p-4 rounded-sd-md bg-sd-canvas border border-sd-border text-xs font-mono text-sd-fg overflow-x-auto"
      ><code>{{ generatedCss }}</code></pre>
    </div>
  </div>
</template>

