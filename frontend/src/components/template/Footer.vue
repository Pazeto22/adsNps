<template>
  <div class="footer">
    <span>Desenvolvido por <strong>Xandinho Corp</strong> © 2020</span>
  </div>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style>
.footer {
  grid-area: footer;
  background-color: #2c2c2c;
  color: #f4f4f4;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.3rem 1rem;
}
</style>
