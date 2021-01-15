<template>
  <div class="overflow-hidden">
    <v-card>
      <v-list v-if="encuesta">
        <v-list-item class="px-1">
          <v-list-item-avatar class="mr-1" color="primary">
            <v-icon dark>
              mdi-{{encuesta.sexo ? encuesta.sexo === 'M' ? 'face' : 'face-woman' : 'account-question'}}
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="px-0" style="width: 100% !important;">
            <v-list-item-title>
              {{ encuesta.nombre }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ tiposIdentificacion.length && encuesta.tipo_identificacion ? tiposIdentificacion.find(x => x.id === encuesta.tipo_identificacion).tipo : '' }}{{ encuesta.identificacion }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <template v-if="encuesta.celular">
                <v-icon small>mdi-cellphone-iphone</v-icon>
                {{encuesta.celular}}
              </template>
              <template v-else-if="encuesta.direccion">
                <v-icon small>mdi-sign-direction</v-icon>
                {{encuesta.direccion}}
              </template>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider/>
      <v-window v-model="window">
        <v-window-item :value="0">
          <detalle v-if="encuesta" :encuesta="encuesta" />
        </v-window-item>
        <v-window-item :value="1">
          <nexos v-if="encuesta" :encuesta="encuesta" @refresh="getencuesta"/>
        </v-window-item>
      </v-window>
    </v-card>
    <footer-app>
      <v-btn
        v-if="window === 0 && encuesta && encuesta.uuid"
        color="orange"
        dark
        absolute
        top
        right
        fab
        @click="editarEncuesta"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        v-if="window === 1 && permisos.nexoCrear"
        color="primary"
        dark
        absolute
        top
        right
        fab
        @click="crearNexo"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-bottom-navigation
        v-model="window"
        color="primary"
      >
        <v-btn>
          <span>Detalle ERP</span>
          <v-icon>mdi-clipboard-text</v-icon>
        </v-btn>
        <v-btn v-if="encuesta && encuesta.localiza_persona && encuesta.contesta_encuesta">
          <span>Contactos</span>
          <v-icon>mdi-human-queue</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </footer-app>
    <registro-erp
      ref="registroERP"
      @guardado="getencuesta"
    />
    <registro-nexo
      ref="registroNexo"
      @guardado="getencuesta(1)"
    />
  </div>
</template>

<script>
import RegistroErp from '@/modules/covid/components/erp/RegistroErp'
import RegistroNexo from '@/modules/covid/components/nexo/RegistroNexo'
import Detalle from '@/modules/covid/views/erp/detalleEncuesta/Detalle'
import Nexos from '@/modules/covid/views/erp/detalleEncuesta/Nexos'
import { mapGetters } from 'vuex'
export default {
  name: 'DetalleEncuesta',
  components: {
    Detalle,
    Nexos,
    RegistroNexo,
    RegistroErp
  },
  props: {
    idd: {
      type: [Number, String],
      default: null
    },
    step: {
      type: [Number, String],
      default: 0
    }
  },
  data: () => ({
    window: 0,
    loading: false,
    encuesta: null
  }),
  computed: {
    permisos () {
      return this.$store.getters.getPermissionModule('covid')
    },
    ...mapGetters([
      'tiposIdentificacion',
      'tamizadores',
      'sintomas'
    ])
  },
  created () {
    this.$store.commit('SET_GOBACK', { name: 'ERP' })
    this.$store.commit('SET_ASSIGN_DB_COMPLEMENTOS')
    this.getencuesta()
  },
  methods: {
    editarEncuesta () {
      this.$refs.registroERP.open(JSON.parse(JSON.stringify(this.encuesta)))
    },
    async getencuesta (window = null) {
      this.loading = true
      this.$store.dispatch('obtenerERP', this.idd).then(encuesta => {
        if (encuesta) {
          this.window = parseInt(window || this.step)
          this.encuesta = encuesta
        }
        this.loading = false
      })
    },
    crearNexo () {
      this.$refs.registroNexo.open(this.encuesta)
    }
  }
}
</script>

<style scoped>

</style>
