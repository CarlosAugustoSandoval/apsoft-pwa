<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
    <v-card tile>
      <v-toolbar dark color="primary">
        <v-toolbar-title>
          Registro ERP
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <ValidationObserver ref="formTamizaje" v-slot="{ invalid, validated }">
<!--        <ValidationObserver ref="formTamizaje">-->
          <form-tamizaje
            v-if="tamizaje"
            :tamizaje="tamizaje"
            @verificado="val => verificado = val"
          />
          <template v-if="tamizaje && verificado === 1 && autoriza">
            <form-sintomas
              :array-sintomas="tamizaje.sintomas"
              :fecha-sintomas="tamizaje.fecha_sintomas"
              @changeSintomas="val => tamizaje.sintomas = val"
              @changeFecha="val => tamizaje.fecha_sintomas = val"
            />
            <template>
              <v-row>
                <v-col cols="12">
                  <v-card outlined tile>
                    <v-card-text>
                      <c-check
                        v-model="tamizaje.signos_alarma"
                        label="Signos de Alarma"
                        :items="signosAlarma ? signosAlarma.filter(x => x.aplica_covid) : []"
                        item-text="descripcion"
                        item-value="id"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <form-comorbilidades
                  :array-comorbilidades="tamizaje.comorbilidades"
                  @changeComorbilidades="val => tamizaje.comorbilidades = val"
                ></form-comorbilidades>
                <v-col cols="12">
                  <v-checkbox
                    class="shrink mt-0 mb-1"
                    v-model="activaPR"
                    :label="activaPR ? 'Frecuencia de Pulso (PR)' : 'Toma de Frecuencia de Pulso (PR)'"
                    :ripple="!activaPR"
                    hide-details
                    @change="!activaPR ? tamizaje.frecuencia_pulso = null : ''"
                  />
                  <c-number
                    v-if="activaPR"
                    placeholder="Frecuencia de Pulso"
                    v-model="tamizaje.frecuencia_pulso"
                    name="frecuencia de pulso"
                    rules="required|min:0"
                    min="0"
                    step="1"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-checkbox
                    class="shrink mt-0 mb-1"
                    v-model="activaSPO2"
                    :label="activaSPO2 ? 'Saturación de Oxígeno (SPO2)' : 'Toma de Saturación de Oxígeno (SPO2)'"
                    :ripple="!activaSPO2"
                    hide-details
                    @change="!activaSPO2 ? tamizaje.saturacion_oxigeno = null : ''"
                  />
                  <c-number
                    v-if="activaSPO2"
                    placeholder="Saturación de Oxígeno"
                    v-model="tamizaje.saturacion_oxigeno"
                    name="saturación de oxígeno"
                    rules="required|min:0"
                    min="0"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-checkbox
                    class="shrink mt-0 mb-1"
                    v-model="activaTemperatura"
                    :label="activaTemperatura ? 'Temperatura' : 'Toma de Temperatura'"
                    :ripple="!activaTemperatura"
                    hide-details
                    @change="!activaTemperatura ? tamizaje.temperatura = null : ''"
                  />
                  <c-number
                    v-if="activaTemperatura"
                    placeholder="Temperatura"
                    v-model="tamizaje.temperatura"
                    name="temperatura"
                    suffix="°C"
                    rules="required|min:0"
                    min="0"
                  />
                </v-col>
              </v-row>
            </template>
            <v-row>
              <v-col cols="12" v-if="esMovil">
                <c-location
                  v-model="tamizaje.coordenadas"
                  label="Coordenadas"
                  :readonly="true"
                />
              </v-col>
<!--              <v-col cols="12">-->
<!--                <v-switch-->
<!--                  class="mt-0"-->
<!--                  label="Solicitar Toma de Muestra"-->
<!--                  v-model="tamizaje.estado_prueba"-->
<!--                  :false-value="null"-->
<!--                  true-value="Requiere Muestra"-->
<!--                  color="primary"-->
<!--                />-->
<!--              </v-col>-->
            </v-row>
          </template>
          <v-row v-if="tamizaje">
            <v-col cols="12" class="pb-0">
              <c-text-area
                v-model="tamizaje.observaciones"
                label="Observaciones"
              >
              </c-text-area>
            </v-col>
          </v-row>
<!--          <footer-app>-->
<!--            <v-alert-->
<!--              width="100%"-->
<!--              dark-->
<!--              tile-->
<!--              class="my-0 py-0 text-center"-->
<!--              dense-->
<!--              color="error"-->
<!--            >-->
<!--              <p class="caption mb-0 mx-2" v-if="invalid && validated">-->
<!--                Hay errores en el formulario-->
<!--              </p>-->
<!--              <p class="caption mb-0 mx-2" v-if="verificado < 1">-->
<!--                {{verificado === 0 ? 'No se ha verificado la identificación de la persona' : 'No aplica para nueva ERP'}}-->
<!--              </p>-->
<!--            </v-alert>-->
<!--          </footer-app>-->
          <v-card-actions>
            <v-btn
              large
              @click.stop="close"
            >
              Cerrar
            </v-btn>
            <v-spacer/>
            <v-btn
              :disabled="verificado !== 1"
              large
              color="primary"
              @click.stop="guardarTamizaje"
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
              <p class="caption mb-0 mx-2" v-if="verificado < 1">
                {{verificado === 0 ? 'No se ha verificado la identificación de la persona' : 'No aplica para nueva ERP'}}
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
import Erp from '@/class/Erp'
import FormTamizaje from '@/modules/covid/components/erp/FormTamizaje'
import FormSintomas from '@/modules/covid/components/erp/FormSIntomas'
import FormComorbilidades from '@/modules/covid/components/erp/FormComorbilidades'
var intervalo
export default {
  name: 'RegistroErp',
  props: {
    esNexo: {
      type: Boolean,
      default: false
    }
  },
  components: {
    FormComorbilidades,
    FormSintomas,
    FormTamizaje
  },
  data: () => ({
    loading: false,
    dialog: false,
    activaPR: true,
    activaSPO2: true,
    activaTemperatura: true,
    tamizaje: null,
    verificado: 0
  }),
  computed: {
    ...mapGetters([
      'signosAlarma',
      'datosMemoria',
      'user'
    ]),
    autoriza () {
      return !!(this && this.tamizaje && this.tamizaje.localiza_persona && this.tamizaje.contesta_encuesta)
    }
  },
  methods: {
    guardarTamizaje () {
      this.$refs.formTamizaje.validate().then(async result => {
        if (result) {
          this.loading = true
          this.tamizaje.nombre = [this.tamizaje.nombre1, this.tamizaje.nombre2, this.tamizaje.apellido1, this.tamizaje.apellido2].filter(x => x).join(' ')
          const tamizajeCopia = await this.cleanTamizaje(this.tamizaje)
          this.evaluaSolicitaPrueba(tamizajeCopia)
          if (!tamizajeCopia.idd) tamizajeCopia.created_at = this.moment().format('YYYY-MM-DD hh:mm:ss')
          tamizajeCopia.updated_at = this.moment().format('YYYY-MM-DD hh:mm:ss')
          tamizajeCopia.user_id = this.user.id
          if (this.esNexo) {
            this.$emit('guardarEncuestaNexo', tamizajeCopia)
          } else {
            this.$store.dispatch('guardarEncuestaERP', tamizajeCopia).then(response => {
              if (response) {
                this.$emit('guardado')
                this.close()
              }
            })
          }
        }
      })
    },
    evaluaSolicitaPrueba (tamizaje) {
      if (tamizaje.localiza_persona && tamizaje.contesta_encuesta) {
        tamizaje.estado_prueba = (tamizaje.riesgo_contacto || (tamizaje.sintomas && (tamizaje.sintomas.length && ((tamizaje.comorbilidades && tamizaje.comorbilidades.length) || (tamizaje.riesgo_procedencia || tamizaje.riesgo_ocupacional) || tamizaje.edad >= 60))))
          ? 'Requiere Muestra'
          : null
      } else {
        tamizaje.estado_prueba = null
      }
    },
    open (encuesta = null, datosNexo = null) {
      if (!encuesta) {
        const newTamizaje = new Erp()
        if (this.datosMemoria) {
          newTamizaje.llamada_entrante = this.datosMemoria.llamada_entrante
          newTamizaje.tipo_tamizaje = this.datosMemoria.tipo_tamizaje
          newTamizaje.tamizador_id = this.datosMemoria.tamizador_id
          newTamizaje.departamento_id = this.datosMemoria.departamento_id
          newTamizaje.municipio_id = this.datosMemoria.municipio_id
          newTamizaje.barrio_id = this.datosMemoria.barrio_id
          newTamizaje.localiza_persona = 1
          newTamizaje.contesta_encuesta = 1
        }
        if (datosNexo) {
          newTamizaje.tipo_identificacion = datosNexo.tipo_identificacion
          newTamizaje.identificacion = datosNexo.identificacion
          newTamizaje.nombre1 = datosNexo.nombre1
          newTamizaje.nombre2 = datosNexo.nombre2
          newTamizaje.apellido1 = datosNexo.apellido1
          newTamizaje.apellido2 = datosNexo.apellido2
          newTamizaje.sexo = datosNexo.sexo
          newTamizaje.celular = datosNexo.celular
          newTamizaje.direccion = datosNexo.direccion
          newTamizaje.departamento_id = datosNexo.departamento_id
          newTamizaje.municipio_id = datosNexo.municipio_id
          newTamizaje.eps_id = datosNexo.eps_id
          newTamizaje.observaciones = datosNexo.observaciones
        }
        this.tamizaje = newTamizaje
        this.activaPR = true
        this.activaSPO2 = true
        this.activaTemperatura = true
        intervalo = setInterval(() => {
          this.tamizaje.duracion++
        }, 1000)
      } else {
        this.activaPR = encuesta.frecuencia_pulso !== null
        this.activaSPO2 = encuesta.saturacion_oxigeno !== null
        this.activaTemperatura = encuesta.temperatura !== null
        encuesta.si_eps = encuesta.eps_id ? 1 : 0
        this.tamizaje = encuesta
      }
      this.dialog = true
    },
    close () {
      this.dialog = false
      this.loading = false
      setTimeout(() => {
        this.verificado = 0
        clearInterval(intervalo)
        this.$emit('close')
        this.tamizaje = null
        this.$refs.formTamizaje.reset()
      }, 400)
    },
    cleanTamizaje (tamizaje) {
      if (tamizaje) {
        if (tamizaje.localiza_persona) tamizaje.no_efectividad = null
        if (!tamizaje.localiza_persona || !tamizaje.contesta_encuesta) {
          tamizaje.riesgo_procedencia = null
          tamizaje.riesgo_ocupacional = null
          tamizaje.riesgo_contacto = null
          tamizaje.diagnosticado_covid = null
          tamizaje.positivo_covid = null
          tamizaje.fecha_diagnostico = null
          tamizaje.coordenadas = null
          tamizaje.fecha_ultima_evolucion = null
          tamizaje.orden_medica_id = null
          tamizaje.reasignar = null
          tamizaje.evoluciones = []
          tamizaje.sintomas = []
          tamizaje.fecha_sintomas = null
          tamizaje.nexos = []
          tamizaje.muestras = []
          tamizaje.tamizador = null
          tamizaje.evolucion = null
          tamizaje.prueba_rapida = null
          tamizaje.resultado_prueba_rapida = null
          tamizaje.estado_prueba = null
          tamizaje.hospitalizado = null
          tamizaje.grupo_atencion_especial_id = null
          tamizaje.grupo_atencion_especial = null
          tamizaje.solicitud_prueba = null
          tamizaje.clasificacion = null
          tamizaje.signos_alarma = []
          tamizaje.comorbilidades = []
          ///
          if (!tamizaje.localiza_persona) tamizaje.contesta_encuesta = null
          tamizaje.frecuencia_pulso = null
          tamizaje.saturacion_oxigeno = null
          tamizaje.temperatura = null
          tamizaje.estado_gestacion_lactancia = null
        }
        return tamizaje
      }
    }
  }
}
</script>

<style scoped>

</style>
