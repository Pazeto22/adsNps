<template>
  <div class="user-dropdown">
    <div class="user-button">
      <span class="d-none d-sm-block">
        {{ user.name }}
      </span>
      <div class="user-dropdown-img">
        <Gravatar :emal="user.email" alt="Foto do usuáro" />
      </div>
      <i class="fa fa-angle-down" />
    </div>
    <div class="user-dropdown-content">
      <a href=""><i class="fa fa-cog" />Administração</a>
      <a href=""><i class="fa fa-sign-out-alt" />Sair</a>
    </div>
  </div>
</template>

<script>
import Gravatar from "vue-gravatar";
import { mapState } from "vuex";

export default {
  name: "UserDropdown",
  components: { Gravatar },
  computed: mapState(["user"]),
};
</script>

<style></style>
