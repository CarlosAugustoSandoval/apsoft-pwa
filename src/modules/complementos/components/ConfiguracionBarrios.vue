<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="!isOnline"
        color="primary"
        small
        fab
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-card tile>
      <v-card-title>
        Configuración Barrios
        <v-spacer/>
        <v-btn
          icon
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <template v-if="isOnline">
            <v-col cols="12" md="6" offset-md="3">
              <c-select-complete
                v-model="departamento_id"
                label="Departamento"
                :items="departamentos"
                item-text="nombre"
                item-value="id"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6" offset-md="3">
              <c-select-complete
                :disabled="!departamento_id"
                v-model="municipio_id"
                label="Municipio"
                :items="departamentos && departamentos.length && departamento_id && departamentos.find(x => x.id === departamento_id) ? departamentos.find(x => x.id === departamento_id).municipios : []"
                item-text="nombre"
                item-value="id"
                hide-details
              />
            </v-col>
          </template>
          <v-col cols="12" md="6" offset-md="3">
            <template v-if="seleccionados && seleccionados.length">
              <v-list two-line class="pa-0">
                <v-subheader>Municipios seleccionados</v-subheader>
                <template
                  v-for="(seleccionado, indexChip) in seleccionados"
                >
                  <v-list-item :key="`item${indexChip}`">
                    <v-list-item-content class="py-0">
                      <v-list-item-title>{{ seleccionado.nombre }}</v-list-item-title>
                      <v-list-item-subtitle>{{ seleccionado.departamento.nombre }}</v-list-item-subtitle>
                      <v-list-item-subtitle>{{ seleccionado.cantidadBarrios ? seleccionado.cantidadBarrios : 0 }} Barrio{{ seleccionado.cantidadBarrios === 1 ? '' : 's'}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn
                        :disabled="!isOnline"
                        color="red"
                        fab
                        depressed
                        small
                        @click="seleccionados.splice(indexChip, 1)"
                      >
                        <v-icon color="white">mdi-close</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider :key="`divider${indexChip}`"/>
                </template>
              </v-list>
              <v-card-actions>
                <v-btn
                  large
                  @click.stop="close"
                >
                  Cerrar
                </v-btn>
                <v-spacer/>
                <v-btn
                  :disabled="!isOnline"
                  large
                  color="primary"
                  @click.stop="sincronizarBarrios"
                >
                  Sincronizar Barrios
                </v-btn>
              </v-card-actions>
            </template>
            <div v-else align="center">
              <v-icon>mdi-alert</v-icon>
              No hay municipios seleccionados
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <loading v-model="loading"></loading>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ConfiguracionBarrios',
  data: () => ({
    loading: false,
    dialog: false,
    departamento_id: null,
    municipio_id: null,
    seleccionados: []
  }),
  computed: {
    ...mapGetters([
      'departamentos',
      'municipiosSeleccionadosBarrios'
    ])
  },
  watch: {
    departamento_id: {
      handler () {
        this.municipio_id = null
      }
    },
    municipio_id: {
      handler (val) {
        if (val) this.asignarSeleccionado()
      }
    },
    dialog: {
      handler (val) {
        if (val) this.getSeleccionados()
      },
      immediate: false
    },
    seleccionados: {
      handler (val, prev) {
        if (prev.length && !val.length && this.dialog) this.sincronizarBarrios()
      },
      immediate: false
    }
  },
  methods: {
    asignarSeleccionado () {
      if (!this.seleccionados.find(x => x.id === this.municipio_id)) {
        this.seleccionados.push(this.departamentos.find(x => x.id === this.departamento_id).municipios.find(z => z.id === this.municipio_id))
      }
    },
    getSeleccionados () {
      this.seleccionados = JSON.parse(JSON.stringify(this.municipiosSeleccionadosBarrios))
    },
    sincronizarBarrios () {
      this.loading = true
      this.$store.dispatch('sincronizarBarrios', this.seleccionados).then(response => {
        this.loading = false
      })
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.departamento_id = null
        this.municipio_id = null
        this.seleccionados = []
      }, 500)
    }
  }
}
</script>

<style scoped>

</style>
