"use strict";

Vue.component("reality-machines-header", {
  data() {
    return {
      realityMachines: new Decimal(0),
      imaginaryMachines: new Decimal(0),
      unlockedIM: false,
    };
  },
  methods: {
    update() {
      this.realityMachines.copyFrom(Currency.realityMachines);
      this.imaginaryMachines.copyFrom(Currency.imaginaryMachines);
      this.unlockedIM = this.imaginaryMachines.gt(0) || Currency.realityMachines.value.exponent >= 1000;
    }
  },
  template: `
    <div class="c-reality-tab__header">
      You have
      <span class="c-reality-tab__reality-machines">
        {{ format(realityMachines, 2) }}
        <span v-if="unlockedIM"> + {{ format(imaginaryMachines, 2) }}i</span>
      </span>
      {{ "Reality Machine" | pluralize(realityMachines) }}.
    </div>`
});
