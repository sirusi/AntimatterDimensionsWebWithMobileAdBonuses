"use strict";

Vue.component("singularity-milestone", {
  props: ["milestone", "suppressGlow"],
  data: () => ({
    isMaxed: false,
    progressToNext: "",
    remainingSingularities: 0,
    description: "",
    effectDisplay: "",
    isUnique: false,
    nextEffectDisplay: "",
    start: 0,
    completions: 0,
    limit: 0,
    showingCondense: false,
    singularitiesPerCondense: 0,
  }),
  computed: {
    barProgressStyle() {
      let color;
      if (this.isMaxed) color = "";
      else if (this.isUnique) color = "var(--color-accent)";
      else if (Number.isFinite(this.limit)) color = "var(--color-good-dark)";
      else color = "var(--color-good)";
      return {
        background: color,
        width: this.progressToNext
      };
    },
    backgroundStyle() {
      let color;
      if (this.isUnique && this.isMaxed) color = "var(--color-accent)";
      else if (Number.isFinite(this.limit) && this.completions >= 1) {
        if (this.isMaxed) color = "var(--color-good-dark)";
        else color = "var(--color-good)";
      } else {
        color = "";
      }
      return {
        "background-color": color
      };
    },
    newGlowStyle() {
      if (this.suppressGlow) return {};
      const newMilestones = SingularityMilestones.unseenMilestones;
      for (let rep = 0; this.completions === 0 || rep < this.completions; rep++) {
        const thisLevel = this.milestone.start * Math.pow(this.milestone.repeat, rep);
        if (newMilestones.includes(thisLevel)) return { "box-shadow": "0 0 0.3rem 0.3rem var(--color-celestials)" };
        if (Currency.singularities.lt(thisLevel)) break;
      }
      return {};
    },
    upgradeDirectionIcon() {
      switch (this.milestone.config.upgradeDirection) {
        case LAITELA_UPGRADE_DIRECTION.SELF_BOOST: return `<b>ᛝ</b>`;
        case LAITELA_UPGRADE_DIRECTION.BOOSTS_MAIN: return `<i class="fas fa-arrows-alt"></i>`;
        case LAITELA_UPGRADE_DIRECTION.BOOSTS_LAITELA: return `<i class="fas fa-compress-arrows-alt"></i>`;
        default: throw new Error("Unspecified Lai'tela upgrade direction in singularity milestone");
      }
    },
    completionsDisplay() {
      if (!Number.isFinite(this.limit)) {
        return quantifyInt("completion", this.completions);
      }
      if (this.isUnique) return this.isMaxed ? "Completed" : "Not completed";
      return `${formatInt(this.completions)}/${formatInt(this.limit)} ${pluralize("completion", this.completions)}`;
    },
    progressDisplay() {
      if (this.showingCondense) {
        return `Condense ${format(this.remainingSingularities / this.singularitiesPerCondense, 2, 2)} times`;
      }
      return `In ${quantify("Singularity", this.remainingSingularities, 2)}`;
    }
  },
  methods: {
    update() {
      this.isMaxed = this.milestone.isMaxed;
      this.progressToNext = this.milestone.progressToNext;
      this.remainingSingularities = this.milestone.remainingSingularities;
      this.description = this.milestone.description;
      this.effectDisplay = this.milestone.effectDisplay;
      this.isUnique = this.milestone.isUnique;
      if (!this.isUnique && !this.isMaxed) this.nextEffectDisplay = this.milestone.nextEffectDisplay;
      this.completions = this.milestone.completions;
      this.limit = this.milestone.limit;
      this.showingCondense = player.options.showCondenseToMilestone;
      this.singularitiesPerCondense = Singularity.singularitiesGained;
    },
  },
  template: `
    <div class="c-laitela-milestone"
      :class="{ 'c-laitela-milestone--completed': isUnique && isMaxed }"
      :style="[backgroundStyle, newGlowStyle]"
    >
      <div class="c-laitela-milestone__progress" :style="barProgressStyle" />
      <b v-if="!isMaxed">
        {{ progressDisplay }}
      </b>
      <p>
        <span v-html="upgradeDirectionIcon" /> {{ description }}
      </p>
      <br>
      <b>
        {{ effectDisplay }}
        <span v-if="!isUnique && !isMaxed">➜ {{ nextEffectDisplay }}</span>
      </b>
      <div class="c-laitela-milestone__completions">
        {{ completionsDisplay }}
      </div>
    </div>`
});
