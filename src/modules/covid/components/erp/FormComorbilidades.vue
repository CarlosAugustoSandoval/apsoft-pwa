<template>
  <v-row>
    <v-col class="pb-0" cols="12">
      <v-card outlined tile>
        <v-card-text>
          <c-check
            v-model="lasComorbilidades"
            label="Comorbilidades"
            :rules="sinComorbilidades ? '' : 'required'"
            name="comorbilidades"
            :items="comorbilidades"
            item-text="descrip"
            item-value="codigo"
            :disabled="sinComorbilidades"
          >
          </c-check>
          <v-checkbox
            class="mt-1 ml-2"
            v-model="sinComorbilidades"
            label="Ninguna de las anteriores"
            hide-details
          ></v-checkbox>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FormSIntomas',
  props: {
    arrayComorbilidades: {
      type: [Array, String, Number, Boolean],
      default: () => []
    }
  },
  data: () => ({
    sinComorbilidades: false,
    lasComorbilidades: []
  }),
  computed: {
    ...mapGetters([
      'comorbilidades'
    ])
  },
  watch: {
    arrayComorbilidades: {
      handler (val) {
        this.lasComorbilidades = val
      },
      immediate: true
    },
    sinComorbilidades: {
      handler (val) {
        if (val) {
          this.$emit('changeComorbilidades', [])
        }
      },
      immediate: false
    },
    lasComorbilidades: {
      handler (val) {
        this.$emit('changeComorbilidades', val)
      },
      immediate: false
    }
  }
}
</script>

<style scoped>

</style>
