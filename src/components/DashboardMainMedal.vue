<template>
  <b-card class="card-welcome">
    <h5>Have a nice day 🎉 {{ name }}</h5>
    <b-card-text class="font-small-3">
      You've won gold medal
    </b-card-text>
    <h3 class="mb-75 mt-2 pt-50">
      <b-link>${{ kFormatter(223) }}</b-link>
    </h3>
    <b-button
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      variant="primary"
    >
      View Sales
    </b-button>
    <b-img
      :src="require('@/assets/images/illustration/Pot2.svg')"
      class="congratulation-medal"
      alt="Medal Pic"
    />
  </b-card>
</template>

<script>
import { getUserData } from '@/auth/utils'
import { kFormatter } from '@core/utils/filter'
import {
  BCard, BCardText, BLink, BButton, BImg,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  name: 'DashboardMainMedal',
  components: {
    BCard,
    BCardText,
    BLink,
    BButton,
    BImg,
  },
  directives: {
    Ripple,
  },
  computed: {
    name() {
      return getUserData().first_name
    },
  },
  methods: {
    kFormatter,
  },
}
</script>
