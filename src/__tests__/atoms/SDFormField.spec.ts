import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref, type Ref, type VNode } from 'vue';

import SDBaseInput from '@/components/atoms/SDBaseInput.vue';
import SDFormField from '@/components/atoms/SDFormField.vue';
import SDLabel from '@/components/atoms/SDLabel.vue';

describe('SDFormField', (): void => {
  it('renders a vertical flex container and projects default slot content', (): void => {
    const wrapper: VueWrapper = mount(SDFormField, {
      slots: {
        default: '<span data-testid="child">Field content</span>',
      },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toEqual(['flex', 'flex-col', 'gap-1']);
    expect(wrapper.find('[data-testid="child"]').text()).toBe('Field content');
  });

  it('auto-generates a shared fallback id when no id prop is provided', (): void => {
    const wrapper: VueWrapper = mount({
      components: { SDFormField, SDLabel, SDBaseInput },
      setup(): { text: Ref<string> } {
        const text: Ref<string> = ref('');
        return { text };
      },
      template: `
        <SDFormField>
          <SDLabel label="Callsign" />
          <SDBaseInput v-model="text" />
        </SDFormField>
      `,
    });

    const labelFor: string | undefined = wrapper.find('label').attributes('for');
    const inputId: string | undefined = wrapper.find('input').attributes('id');
    const inputName: string | undefined = wrapper.find('input').attributes('name');
    const inputAriaLabel: string | undefined = wrapper.find('input').attributes('aria-label');

    expect(labelFor).toBeTruthy();
    expect(inputId).toBe(labelFor);
    expect(inputName).toBe(labelFor);
    expect(inputAriaLabel).toBe(labelFor);
  });

  it('cascades id -> name -> label fallback hierarchy across injected context', (): void => {
    const idOnlyWrapper: VueWrapper = mount({
      components: { SDFormField, SDBaseInput },
      setup(): { val: Ref<string> } {
        const val: Ref<string> = ref('');
        return { val };
      },
      template: `
        <SDFormField id="fleet-code">
          <SDBaseInput v-model="val" />
        </SDFormField>
      `,
    });

    const idOnlyInput: ReturnType<VueWrapper['find']> = idOnlyWrapper.find('input');
    expect(idOnlyInput.attributes('id')).toBe('fleet-code');
    expect(idOnlyInput.attributes('name')).toBe('fleet-code');
    expect(idOnlyInput.attributes('aria-label')).toBe('fleet-code');

    const namedWrapper: VueWrapper = mount({
      components: { SDFormField, SDBaseInput },
      setup(): { val: Ref<string> } {
        const val: Ref<string> = ref('');
        return { val };
      },
      template: `
        <SDFormField id="fleet-id" name="fleet_name">
          <SDBaseInput v-model="val" />
        </SDFormField>
      `,
    });

    const namedInput: ReturnType<VueWrapper['find']> = namedWrapper.find('input');
    expect(namedInput.attributes('id')).toBe('fleet-id');
    expect(namedInput.attributes('name')).toBe('fleet_name');
    expect(namedInput.attributes('aria-label')).toBe('fleet_name');

    const fullWrapper: VueWrapper = mount({
      components: { SDFormField, SDBaseInput },
      setup(): { val: Ref<string> } {
        const val: Ref<string> = ref('');
        return { val };
      },
      template: `
        <SDFormField id="fleet-id" name="fleet_name" label="Fleet Designation">
          <SDBaseInput v-model="val" />
        </SDFormField>
      `,
    });

    const fullInput: ReturnType<VueWrapper['find']> = fullWrapper.find('input');
    expect(fullInput.attributes('id')).toBe('fleet-id');
    expect(fullInput.attributes('name')).toBe('fleet_name');
    expect(fullInput.attributes('aria-label')).toBe('Fleet Designation');
  });

  it('propagates reactive state updates to child SDLabel and SDBaseInput components', async (): Promise<void> => {
    const FieldHarness: ReturnType<typeof defineComponent> = defineComponent({
      props: {
        id: { type: String, default: 'server-host' },
        describedBy: { type: String, default: undefined },
        required: { type: Boolean, default: false },
        readonly: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        invalid: { type: Boolean, default: false },
      },
      setup(props: {
        id: string;
        describedBy: string | undefined;
        required: boolean;
        readonly: boolean;
        disabled: boolean;
        invalid: boolean;
      }): () => VNode {
        const model: Ref<string> = ref('eu-west-1');
        return (): VNode =>
          h(
            SDFormField,
            {
              id: props.id,
              describedBy: props.describedBy,
              required: props.required,
              readonly: props.readonly,
              disabled: props.disabled,
              invalid: props.invalid,
            },
            {
              default: (): VNode[] => [
                h(SDLabel, { label: 'Server Host' }),
                h(SDBaseInput, {
                  modelValue: model.value,
                  'onUpdate:modelValue': (v: string | null | undefined): void => {
                    model.value = v ?? '';
                  },
                }),
              ],
            },
          );
      },
    });

    const wrapper: VueWrapper = mount(FieldHarness);
    const label: ReturnType<VueWrapper['find']> = wrapper.find('label');
    const input: ReturnType<VueWrapper['find']> = wrapper.find('input');

    expect(label.attributes('for')).toBe('server-host');
    expect(input.attributes('id')).toBe('server-host');
    expect(input.attributes('required')).toBeUndefined();
    expect(input.attributes('readonly')).toBeUndefined();
    expect(input.attributes('disabled')).toBeUndefined();
    expect(input.attributes('aria-invalid')).toBe('false');
    expect(input.attributes('aria-describedby')).toBeUndefined();

    await wrapper.setProps({
      id: 'server-host-v2',
      describedBy: 'host-hint',
      required: true,
      readonly: true,
      disabled: true,
      invalid: true,
    });

    expect(label.attributes('for')).toBe('server-host-v2');
    expect(label.find('span[aria-hidden="true"]').exists()).toBe(true);
    expect(label.classes()).toContain('text-sd-fg-disabled');

    expect(input.attributes('id')).toBe('server-host-v2');
    expect(input.attributes('aria-describedby')).toBe('host-hint');
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('readonly')).toBeDefined();
    expect(input.attributes('disabled')).toBeDefined();
    expect(input.attributes('aria-invalid')).toBe('true');
  });
});
