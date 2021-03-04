<template>
  <b-img
    :src="require('@/assets/images/logo/logo.svg')"
    class="pts-logo"
  />
</template>

<script>
import { BImg } from 'bootstrap-vue'

export default {
  components: { BImg },
}
</script>

<style lang="scss">
.pts-logo {
  min-width: 36px;
}
</style>
