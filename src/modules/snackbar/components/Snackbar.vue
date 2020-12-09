<template>
  <v-snackbar
    multi-line
    v-model="show"
    :timeout="timeout"
    :color="color"
    top
  >
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn
        icon
        v-bind="attrs"
        @click="show = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Snackbar',
  data: () => ({
    timeout: -1,
    show: false,
    color: 'info',
    message: ''
  }),
  computed: {
    ...mapGetters(['snackbar'])
  },
  watch: {
    'snackbar' (val) {
      this.show = false
      if (val.message) {
        this.$nextTick(() => {
          this.color = val.color
          this.message = val.message
          this.timeout = val.timeout
          this.show = true
        })
      }
    }
  }
}
</script>
