<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
    <v-card tile>
      <v-toolbar dark color="primary">
        <v-toolbar-title>
          Registro Visita
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid v-if="domicilio">
        <ValidationObserver ref="formVisita" v-slot="{ invalid, validated }">
          <v-row>
            <v-col cols="12">
              <v-card outlined>
                <v-card-text class="pt-3 pb-4">
                  <c-radio
                    v-model="status"
                    label="Estado"
                    rules="required"
                    name="estado"
                    :items="[{value: 1, text: 'Fallida'}, {value: 0, text: 'Efectiva'}]"
                    item-text="text"
                    item-value="value"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" v-if="status">
              <v-card outlined>
                <v-card-text class="pt-3 pb-4">
                  <c-radio
                    v-model="tipificacion"
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
                v-model="observaciones"
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
              @click.stop="guardarVisita"
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
export default {
  name: 'RegistroVisita',
  data: () => ({
    loading: false,
    dialog: false,
    domicilio: null,
    tipificacion: null,
    observaciones: null,
    status: null
  }),
  computed: {
    ...mapGetters([
      'tipificacionesDomicilioSinEncuesta',
      'user'
    ])
  },
  watch: {
    status: {
      handler () {
        this.tipificacion = null
      },
      immediate: false
    }
  },
  methods: {
    guardarVisita () {
      this.$refs.formVisita.validate().then(async result => {
        if (result) {
          this.loading = true
          const domiCopia = JSON.parse(JSON.stringify(this.domicilio))
          domiCopia.updated_at = this.moment().format('YYYY-MM-DD hh:mm:ss')
          domiCopia.user_id = this.user.id
          domiCopia.tipificacion = this.tipificacion
          domiCopia.status = this.status
          const visitas = JSON.parse(domiCopia.observaciones)
          visitas.splice(0, 0, {
            tipificacion: domiCopia.tipificacion,
            fecha: domiCopia.updated_at,
            observacion: this.observaciones,
            user_id: this.user.id,
            usuario: this.user.name
          })
          domiCopia.observaciones = JSON.stringify(visitas)
          this.$store.dispatch('guardarDomicilio', domiCopia).then(response => {
            if (response) {
              this.$emit('guardado')
              this.close()
            }
          })
        }
      })
    },
    open (domicilio) {
      this.domicilio = domicilio
      this.dialog = true
    },
    close () {
      this.dialog = false
      this.loading = false
      setTimeout(() => {
        this.$emit('close')
        this.domicilio = null
        this.tipificacion = null
        this.observaciones = null
        this.status = null
        this.$refs.formVisita.reset()
      }, 400)
    }
  }
}
</script>

<style scoped>

</style>
