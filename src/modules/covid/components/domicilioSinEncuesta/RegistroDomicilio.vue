<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
    <v-card tile>
      <v-toolbar dark color="primary">
        <v-toolbar-title>
          Registro Domicilio
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid v-if="domicilio">
        <ValidationObserver ref="formDomicilio" v-slot="{ invalid, validated }">
          <v-row>
            <v-col cols="12">
              <c-texto
                v-model="domicilio.direccion"
                label="Dirección"
                rules="minlength:6|direccion"
                name="dirección"
                upper-case
              />
            </v-col>
            <v-col cols="12" sm="12">
              <c-select-complete
                v-model="domicilio.departamento_id"
                label="Departamento"
                name="departamento"
                rules="required"
                :items="departamentos"
                item-text="nombre"
                item-value="id"
                @change="val => domicilio.municipio_id = val && domicilio.municipio_id && departamentos.find(x => x.id === val).municipios.find(z => z.id === domicilio.municipio_id) ? domicilio.municipio_id : null"
              />
            </v-col>
            <v-col cols="12" sm="12">
              <c-select-complete
                :disabled="!domicilio.departamento_id"
                v-model="domicilio.municipio_id"
                label="Municipio"
                name="municipio"
                :rules="domicilio.departamento_id ? 'required' : ''"
                :items="departamentos.length && domicilio.departamento_id && departamentos.find(x => x.id === domicilio.departamento_id) ? departamentos.find(x => x.id === domicilio.departamento_id).municipios : []"
                item-text="nombre"
                item-value="id"
              />
            </v-col>
            <v-col cols="12" sm="12">
              <c-select-complete
                :disabled="!domicilio.municipio_id"
                v-model="domicilio.barrio_id"
                :loading="loadingBarrios"
                label="Barrio"
                :items="barrios"
                item-text="nombre"
                item-value="id"
              />
            </v-col>
            <v-col cols="12" v-if="esMovil">
              <c-location
                v-model="domicilio.coordenadas"
                label="Coordenadas"
                :readonly="true"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-card outlined>
                <v-card-text class="pt-3 pb-4">
                  <c-radio
                    v-model="domicilio.tipificacion"
                    label="Tipificación"
                    rules="required"
                    name="tipificación"
                    :items="tipificacionesDomicilioSinEncuesta"
                    item-text="text"
                    item-value="value"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" class="pb-0">
              <c-text-area
                v-model="domicilio.observaciones"
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
              @click.stop="guardardomicilio"
            >
              Guardar
            </v-btn>
          </v-card-actions>
          <v-card-text
            class="pa-0"
            style="position: fixed !important; bottom: 0px !important; right: 0px !important;"
          >
            <v-alert
              width="100%"
              dark
              tile
              class="my-0 py-0 text-center"
              dense
              color="error"
            >
              <p class="caption mb-0 mx-2" v-if="invalid && validated">
                Hay errores en el formulario
              </p>
            </v-alert>
          </v-card-text>
        </ValidationObserver>
      </v-container>
      <loading v-model="loading"></loading>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import DomicilioSinEncuesta from '@/class/DomicilioSinEncuesta'
export default {
  name: 'RegistroDomicilio',
  data: () => ({
    loading: false,
    dialog: false,
    loadingBarrios: false,
    domicilio: null,
    barrios: []
  }),
  computed: {
    ...mapGetters([
      'departamentos',
      'tipificacionesDomicilioSinEncuesta',
      'user'
    ])
  },
  watch: {
    'domicilio.municipio_id': {
      handler (val) {
        if (this.domicilio) {
          this.domicilio.barrio_id = null
          this.barrios = []
          if (val) {
            this.getBarrios(val)
          }
        }
      },
      immediate: false
    }
  },
  methods: {
    guardardomicilio () {
      this.$refs.formDomicilio.validate().then(async result => {
        if (result) {
          this.loading = true
          this.domicilio.nombreDepartamento = this.domicilio.departamento_id ? this.departamentos.find(x => x.id === this.domicilio.departamento_id).nombre : null
          this.domicilio.nombreMunicipio = this.domicilio.departamento_id && this.domicilio.municipio_id ? this.departamentos.find(x => x.id === this.domicilio.departamento_id).municipios.find(z => z.id === this.domicilio.municipio_id).nombre : null
          this.domicilio.nombreBarrio = this.domicilio.barrio_id ? this.barrios.find(x => x.id === this.domicilio.barrio_id).nombre : null
          if (!this.domicilio.idd) this.domicilio.created_at = this.moment().format('YYYY-MM-DD hh:mm:ss')
          this.domicilio.updated_at = this.moment().format('YYYY-MM-DD hh:mm:ss')
          this.domicilio.user_id = this.user.id
          this.$store.dispatch('guardarDomicilio', this.domicilio).then(response => {
            if (response) {
              this.$emit('guardado')
              this.close()
            }
          })
        }
      })
    },
    getBarrios (municipioId) {
      this.loadingBarrios = true
      this.$store.dispatch('getBarriosMunicipio', municipioId).then(response => {
        this.barrios = response
        this.loadingBarrios = false
      })
    },
    open (domicilio = null) {
      if (!domicilio) {
        this.domicilio = new DomicilioSinEncuesta()
      } else {
        this.domicilio = domicilio
      }
      this.dialog = true
    },
    close () {
      this.dialog = false
      this.loading = false
      setTimeout(() => {
        this.$emit('close')
        this.domicilio = null
        this.$refs.formDomicilio.reset()
      }, 400)
    }
  }
}
</script>

<style scoped>

</style>
