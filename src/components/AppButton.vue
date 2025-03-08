<template>
  <v-btn
    :id="id"
    class="app-btn ma-1"
    :to="to"
    :loading="loading"
    :disabled="disabled"
    :color="color"
    :variant="variant"
    :icon="hasIconOnly ? icon : undefined"
    :density="density"
    @click.stop.prevent="btnClick"
  >
    <slot>
      <v-icon v-if="hasIcon">
        {{ icon }}
      </v-icon>
      <span v-if="hasLabel">
        {{ label }}
      </span>
    </slot>
    <v-tooltip
      v-if="tooltip"
      activator="parent"
    >
      {{ tooltip }}
    </v-tooltip>
  </v-btn>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: { type: String, default: 'button' },
  label: { type: String, default: '' },
  color: { type: String, default: '' },
  to: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  tooltip: { type: String, default: '' },
  icon: { type: String, default: '' },
  density: { type: String, default: 'default' },
  variant: { type: String, default: 'plain' }
});
const emit = defineEmits(['click']);

const hasIcon = computed(() => {
  return props.icon !== ''
})
const hasLabel = computed(() => {
  return props.label !== '' || !hasIcon.value
})
const hasIconOnly = computed(() => {
  return hasIcon.value && !hasLabel.value;
})
function btnClick(e) {
  emit('click', e);
}
</script>
