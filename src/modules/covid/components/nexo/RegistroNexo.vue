<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
    <v-card tile>
      <v-toolbar dark color="primary">
        <v-toolbar-title>
          Registro Conviviente
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <ValidationObserver ref="formNexo" v-slot="{ invalid, validated }">
          <v-row v-if="nexo">
            <v-col cols="12" md="6">
              <c-texto
                v-model="nexo.identificacion"
                label="Identificación"
              />
            </v-col>
            <v-col cols="12" md="6">
              <c-select-complete
                v-model="nexo.tipo_identificacion"
                label="Tipo identificación"
                :items="tiposIdentificacion"
                item-text="descripcion"
                item-value="id"
              />
            </v-col>
            <v-col cols="12" md="6">
              <c-texto
                v-model="nexo.nombre1"
                label="Primer Nombre"
                rules="required"
                name="primer nombre"
                upper-case
              />
            </v-col>
            <v-col cols="12" md="6">
              <c-texto
                v-model="nexo.nombre2"
                label="Segundo Nombre"
                upper-case
              />
            </v-col>
            <v-col cols="12" md="6">
              <c-texto
                v-model="nexo.apellido1"
                label="Primer Apellido"
                rules="required"
                name="primer apellido"
                upper-case
              />
            </v-col>
            <v-col cols="12" md="6">
              <c-texto
                v-model="nexo.apellido2"
                label="Segundo Apellido"
                upper-case
              />
            </v-col>
            <v-col cols="12" md="6">
              <c-texto
                v-model="nexo.celular"
                label="Celular"
                rules="required|numeric|minlength:10|maxlength:10"
                name="celular"
              />
            </v-col>
            <v-col cols="12" md="6">
              <c-select-complete
                v-model="nexo.parentesco_id"
                label="Parentesco"
                rules="required"
                name="parentesco"
                :items="parentescos"
                item-value="id"
                item-text="descripcion"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-card outlined>
                <v-card-text class="pt-3 pb-4">
                  <c-radio
                    v-model="nexo.sexo"
                    label="Sexo"
                    rules="required"
                    name="sexo"
                    :items="sexosCovid"
                    item-text="text"
                    item-value="value"
                    :column="!$vuetify.breakpoint.smAndUp"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <c-number
                v-model="nexo.edad"
                label="Edad"
                rules="numeric"
                name="Edad"
                min="0"
                step="1"
              >
              </c-number>
            </v-col>
            <v-col class="pb-0" cols="12">
              <c-texto
                v-model="nexo.direccion"
                label="Dirección"
                rules="required|minlength:6|direccion"
                name="dirección"
                upper-case
              />
            </v-col>
            <v-col cols="12">
              <c-select-complete
                v-model="nexo.departamento_id"
                label="Departamento"
                name="departamento"
                rules="required"
                :items="departamentos"
                item-text="nombre"
                item-value="id"
              />
            </v-col>
            <v-col class="pb-0" cols="12">
              <c-select-complete
                :disabled="!nexo.departamento_id"
                v-model="nexo.municipio_id"
                label="Municipio"
                name="municipio"
                rules="required"
                :items="departamentos.length && nexo.departamento_id ? departamentos.find(x => x.id === nexo.departamento_id).municipios : []"
                item-text="nombre"
                item-value="id"
              />
            </v-col>
            <v-col cols="12">
              <c-select-complete
                v-model="nexo.eps_id"
                label="EPS"
                :items="epss"
                item-text="nombre"
                item-value="id"
              />
            </v-col>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                    v-model="nexo.PresupuestoComun"
                    label="¿Presupuesto Común?"
                    rules="required"
                    name="presupuesto común"
                    :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                    item-text="text"
                    item-value="value"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <c-text-area
                v-model="nexo.observaciones"
                label="Observaciones"
              >
              </c-text-area>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-btn
              large
              @click.stop="close"
            >
              Cerrar
            </v-btn>
            <v-spacer/>
            <v-btn
              large
              color="primary"
              @click.stop="guardarNexo"
            >
              Guardar
            </v-btn>
          </v-card-actions>
          <footer-app v-if="invalid && validated">
            <v-alert
              width="100%"
              dark
              tile
              class="my-0 py-0 text-center"
              dense
              color="error"
            >
              <p class="caption mb-0 mx-2">
                Hay errores en el formulario
              </p>
            </v-alert>
          </footer-app>
        </ValidationObserver>
      </v-container>
      <loading v-model="loading"></loading>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import Nexo from '@/class/Nexo'
var intervalo
export default {
  name: 'RegistroNexo',
  data: () => ({
    loading: false,
    dialog: false,
    encuesta: null,
    nexo: null,
    indexNexo: null,
    start: false
  }),
  computed: {
    ...mapGetters([
      'tiposIdentificacion',
      'parentescos',
      'sexosCovid',
      'departamentos',
      'epss'
    ])
  },
  watch: {
    'nexo.departamento_id': {
      handler () {
        if (this.nexo && this.start) {
          this.nexo.municipio_id = null
        }
      },
      immediate: false
    }
  },
  methods: {
    guardarNexo () {
      this.$refs.formNexo.validate().then(async result => {
        if (result) {
          this.loading = true
          this.nexo.nombres = [this.nexo.nombre1, this.nexo.nombre2, this.nexo.apellido1, this.nexo.apellido2].filter(x => x).join(' ')
          if (!this.nexo.uuid) this.nexo.created_at = this.moment().format('YYYY-MM-DD hh:mm:ss')
          this.nexo.updated_at = this.moment().format('YYYY-MM-DD hh:mm:ss')
          this.nexo.tamizaje_id = this.encuesta.id
          this.nexo.nombre_reportante = [this.encuesta.nombre1, this.encuesta.nombre2, this.encuesta.apellido1, this.encuesta.apellido2].filter(x => x).join(' ')
          this.nexo.celular_reportante = this.encuesta.celular
          this.$store.dispatch('guardarNexo', { encuestaIdd: this.encuesta.idd, nexo: this.nexo, indexNexo: this.indexNexo }).then(response => {
            if (response) {
              this.$emit('guardado')
              this.close()
            }
          })
        }
      })
    },
    open (encuesta, indexNexo = null) {
      this.encuesta = encuesta
      this.nexo = indexNexo ? JSON.parse(JSON.stringify(this.encuesta.nexos[indexNexo])) : new Nexo()
      this.indexNexo = indexNexo
      this.dialog = true
      if (!indexNexo) {
        intervalo = setInterval(() => {
          this.nexo.duracion++
        }, 1000)
      }
      setTimeout(() => {
        this.start = true
      }, 500)
    },
    close () {
      this.$refs.formNexo.reset()
      this.dialog = false
      this.loading = false
      this.start = false
      clearInterval(intervalo)
      this.$emit('close')
      this.nexo = null
      this.encuesta = null
    }
  }
}
</script>

<style scoped>

</style>
