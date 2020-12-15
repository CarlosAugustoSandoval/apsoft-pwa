<template>
  <div class="overflow-hidden">
    <v-card>
      <template v-if="(encuesta && step === 0) || (nexo && !nexo.tamizaje && step === 1)">
        <v-list class="py-0">
          <v-list-item class="px-0">
            <v-list-item-avatar class="mr-1" color="primary">
              <v-icon dark>
                mdi-{{encuesta.sexo ? encuesta.sexo === 'M' ? 'face' : 'face-woman' : 'account-question'}}
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content class="px-0">
              <v-list-item-subtitle>
                Quien Reporta
              </v-list-item-subtitle>
              <v-list-item-title>{{ encuesta.nombre }}</v-list-item-title>
              <v-list-item-subtitle v-if="encuesta.celular">
                <v-icon small>mdi-cellphone-iphone</v-icon>
                {{encuesta.celular}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider/>
      </template>
      <v-window v-model="step" v-if="idd && encuesta && index !== null">
        <v-window-item :value="0">
          <detalle :encuesta="encuesta" :nexo="nexo"/>
        </v-window-item>
        <v-window-item :value="1">
          <template v-if="nexo.tamizaje">
            <v-list>
              <v-list-item class="px-1">
                <v-list-item-avatar class="mr-1" color="primary">
                  <v-icon dark>
                    mdi-{{nexo.tamizaje.sexo ? nexo.tamizaje.sexo === 'M' ? 'face' : 'face-woman' : 'account-question'}}
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="px-0" style="width: 100% !important;">
                  <v-list-item-title>
                    {{ nexo.tamizaje.nombre }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ tiposIdentificacion.length && nexo.tamizaje.tipo_identificacion ? tiposIdentificacion.find(x => x.id === nexo.tamizaje.tipo_identificacion).tipo : '' }}{{ nexo.tamizaje.identificacion }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <template v-if="nexo.tamizaje.celular">
                      <v-icon small>mdi-cellphone-iphone</v-icon>
                      {{nexo.tamizaje.celular}}
                    </template>
                    <template v-else-if="nexo.tamizaje.direccion">
                      <v-icon small>mdi-sign-direction</v-icon>
                      {{nexo.tamizaje.direccion}}
                    </template>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider/>
            <detalle-encuesta :encuesta="nexo.tamizaje"/>
          </template>
          <v-col v-else cols="12" class="text-center title">
            No tiene encuesta registrada
          </v-col>
        </v-window-item>
      </v-window>
    </v-card>
    <footer-app>
      <v-btn
        v-if="step === 0 && (nexo && !nexo.id)"
        color="orange"
        dark
        absolute
        top
        right
        fab
        @click="editarNexo"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <template v-if="step === 1 && permisos.tamizajeCrear && nexo">
        <v-btn
          v-if="!nexo.tamizaje"
          color="primary"
          dark
          absolute
          top
          right
          fab
          @click="crearEncuesta"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          v-if="nexo.tamizaje && !nexo.tamizaje.id"
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
      </template>
      <v-bottom-navigation
        v-model="step"
        color="primary"
      >
        <v-btn>
          <span>Detalle Conviviente</span>
          <v-icon>mdi-card-account-details</v-icon>
        </v-btn>
        <v-btn v-if="encuesta && encuesta.localiza_persona && encuesta.contesta_encuesta">
          <span>ERP Conviviente</span>
          <v-icon>mdi-clipboard-text</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </footer-app>
    <registro-erp
      ref="registroERP"
      es-nexo
      @guardarEncuestaNexo="val => guardarEncuestaNexo(val)"
    />
    <registro-nexo
      ref="registroNexo"
      @guardado="getencuesta"
    />
  </div>
</template>

<script>
import RegistroErp from '@/modules/covid/components/erp/RegistroErp'
import RegistroNexo from '@/modules/covid/components/nexo/RegistroNexo'
import Detalle from '@/modules/covid/views/nexo/detalleNexo/Detalle'
import DetalleEncuesta from '@/modules/covid/views/erp/detalleEncuesta/Detalle'
import { mapGetters } from 'vuex'
export default {
  name: 'DetalleNexo',
  components: {
    Detalle,
    DetalleEncuesta,
    RegistroNexo,
    RegistroErp
  },
  props: {
    idd: {
      type: [Number, String],
      default: null
    },
    index: {
      type: [Number, String],
      default: null
    }
  },
  data: () => ({
    step: 0,
    loading: false,
    encuesta: null,
    nexo: null
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
    this.$store.commit('SET_GOBACK', { name: 'DetalleERP', params: { idd: this.idd, step: 1 } })
    this.$store.commit('SET_ASSIGN_DB_COMPLEMENTOS')
    this.getencuesta()
  },
  methods: {
    editarNexo () {
      this.$refs.registroNexo.open(this.encuesta, this.index)
    },
    async getencuesta () {
      this.loading = true
      this.$store.dispatch('obtenerERP', this.idd).then(encuesta => {
        if (encuesta) {
          this.encuesta = encuesta
          this.nexo = this.encuesta.nexos[this.index]
        }
        this.loading = false
      })
    },
    crearEncuesta () {
      this.$refs.registroERP.open(null, this.nexo)
    },
    editarEncuesta () {
      this.$refs.registroERP.open(JSON.parse(JSON.stringify(this.nexo.tamizaje)))
    },
    guardarEncuestaNexo (encuesta) {
      this.$store.dispatch('guardarEncuestaERPNexo', { encuestaIdd: this.encuesta.idd, indexNexo: this.index, encuesta: encuesta }).then(response => {
        if (response) {
          this.getencuesta()
          this.$refs.registroERP.close()
        } else {
          this.$refs.registroERP.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
