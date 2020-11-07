<template>
  <header class="header">
    <a class="toggle" @click="toggleMenu" v-if="!hideToggle">
      <i class="fa fa-lg" :class="icon"></i>
    </a>
    <h1 class="title">
      {{ title }}
    </h1>
    <UserDropdown v-if="!hideUserDropdon" />
  </header>
</template>

<script>
import UserDropdown from "./UserDropdown";

export default {
  name: "Header",
  components: { UserDropdown },
  props: {
    title: String,
    hideToggLe: Boolean,
    hideUserDropdon: Boolean,
  },
  computed: {
    icon() {
      return this.$store.state.isMenuVisible
        ? "fa-angle-left"
        : "fa-angle-down";
    },
  },
  methods: {
    toggleMenu() {
      this.$store.commit("toggleMenu");
    },
  },
};
</script>

<style>
.header {
  grid-area: header;
  color: #f4f4f4;
  background-color: #2c2c2c;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  font-size: 1.2rem;
  font-weight: 100;
  flex-grow: 1;
  text-align: center;
}

.title a {
  text-decoration: none;
}

header.header > a.toggle {
  width: 60px;
  height: 100%;
  text-decoration: none;
  display: flex;
  justify-self: flex-start;
  justify-content: center;
  align-items: center;
}

header.header > a.toggle:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
