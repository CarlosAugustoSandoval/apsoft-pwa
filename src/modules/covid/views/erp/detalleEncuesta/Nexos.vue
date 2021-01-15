<template>
  <v-card>
    <v-row>
      <template v-if="encuesta && encuesta.nexos && encuesta.nexos.length">
        <v-col class="py-0" cols="12">
          <v-list class="py-0">
            <template v-for="(item, indexItem) in encuesta.nexos">
              <v-list-item
                :key="`nexo${indexItem}`"
                class="px-1"
                @click="$router.push({ name: 'DetalleNexo', params: { idd: encuesta.idd, index: indexItem }})"
              >
                <v-list-item-avatar class="mr-1" color="orange">
                  <v-icon dark>
                    mdi-{{item.sexo ? item.sexo === 'M' ? 'face' : 'face-woman' : 'account-question'}}
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="px-0" style="width: 100% !important;">
                  <v-list-item-subtitle :class="`${item.tamizaje ? 'green' : 'red'}--text`">
                    {{ item.tamizaje ? 'ERP Registrada' : 'No Registra ERP' }}
                  </v-list-item-subtitle>
                  <v-list-item-title>
                    <v-icon
                      v-if="item.uuid !== null || (item.tamizaje && item.tamizaje.uuid !== null)"
                      small
                      color="orange"
                    >mdi-sync</v-icon>
                    {{ item.nombres }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ tiposIdentificacion.length && item.tipo_identificacion ? tiposIdentificacion.find(x => x.id === item.tipo_identificacion).tipo : '' }}{{ item.identificacion }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <template v-if="item.celular">
                      <v-icon small>mdi-cellphone-iphone</v-icon>
                      {{item.celular}}
                    </template>
                    <template v-else-if="item.direccion">
                      <v-icon small>mdi-sign-direction</v-icon>
                      {{item.direccion}}
                    </template>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action class="flex-row-reverse align-center" v-if="!item.id">
                  <v-btn
                    dark
                    depressed
                    fab
                    small
                    color="red"
                    @click.stop="eliminarNexo(item, indexItem)"
                    class="mr-1"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-divider :key="`dividererp${indexItem}`"/>
            </template>
          </v-list>
        </v-col>
      </template>
      <v-col v-else cols="12" class="text-center title">
        No hay Contactos registrados
      </v-col>
    </v-row>
    <v-dialog
      v-model="eliminar.dialog"
      persistent
      max-width="300"
    >
      <v-card>
        <v-card-text
          class="pt-3 text-center"
        >
          {{eliminar.texto}}
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            @click="cancelaEliminacion"
            :loading="loading"
          >
            Cancelar
          </v-btn>
          <v-spacer/>
          <v-btn
            dark
            color="red"
            @click="confirmaEliminar"
            :loading="loading"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Nexos',
  props: {
    encuesta: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    eliminar: {
      dialog: false,
      texto: '',
      item: null,
      index: null
    },
    dialog: false,
    loading: false
  }),
  computed: {
    ...mapGetters([
      'tiposIdentificacion'
    ])
  },
  created () {
    this.$store.commit('SET_ASSIGN_DB_COMPLEMENTOS')
  },
  methods: {
    eliminarNexo (item, index) {
      this.eliminar.item = item
      this.eliminar.index = index
      this.eliminar.texto = `¿Está seguro de eliminar el registro de ${[item.nombre1, item.apellido1].filter(x => x).join(' ')}?`
      this.eliminar.dialog = true
    },
    cancelaEliminacion () {
      this.eliminar.dialog = false
      setTimeout(() => {
        this.eliminar.texto = ''
        this.eliminar.item = null
        this.eliminar.index = null
      }, 500)
    },
    async confirmaEliminar () {
      this.loading = true
      const encuestaCopia = JSON.parse(JSON.stringify(this.encuesta))
      encuestaCopia.nexos.splice(this.eliminar.index, 1)
      this.$store.dispatch('eliminarNexo', encuestaCopia).then(response => {
        if (response) {
          this.cancelaEliminacion()
          this.$emit('refresh')
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
