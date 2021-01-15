<template>
  <div>
    <v-row>
      <v-col cols="12" v-if="esTamizaje && tamizaje && tamizaje.tipo_tamizaje !== 'email'">
        <v-card outlined tile>
          <v-card-text>
            <c-radio
              v-model="tamizaje.tipo_tamizaje"
              label="Tipo de Encuesta de Riesgo Poblacional: "
              rules="required"
              name="tipo de encuesta de riesgo poblacional"
              :items="tiposTamizaje"
              item-text="nombre"
              item-value="id"
              :column="!$vuetify.breakpoint.smAndUp"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" v-if="esTamizaje && tamizaje.tipo_tamizaje === 'telefónico'">
        <v-card outlined tile>
          <v-card-text>
            <c-radio
              v-model="tamizaje.llamada_entrante"
              label="Tipo de llamada: "
              rules="required"
              name="tipo de llamada"
              :items="[{value: 1, text: 'Entrante'}, {value: 0, text: 'Saliente'}]"
              item-text="text"
              item-value="value"
              :column="!$vuetify.breakpoint.smAndUp"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <template v-if="esTamizaje">
        <v-col class="pb-0" cols="12">
          <c-select-complete
            label="¿Dónde se Diligencia?"
            v-model="tamizaje.tamizador_id"
            placeholder="Punto contacto"
            rules="required"
            name="punto contacto"
            :items="tamizadores ? tamizadores.filter(x => x.id !== 891) : []"
            item-text="nombre"
            item-value="id"
          />
        </v-col>
        <v-col cols="12" class="pb-0" v-if="[888,897,900].find(x => tamizaje.tamizador_id === x)">
          <buscador-ips
            ref="buscadorips"
            label="IPS"
            v-model="tamizaje.codIpsBai"
            rules="required"
            name="IPS"
          />
        </v-col>
        <v-col class="pb-0" cols="12" v-if="tamizaje.tamizador_id === 890">
          <c-texto
            v-model="tamizaje.entidad_reporta_sivigila"
            label="Entidad que reporta a SIVIGILA"
            rules="required"
            name="entidad que reporta a SIVIGILA"
            upper-case
          />
        </v-col>
      </template>
    </v-row>
    <form-persona
        v-model="tamizaje"
        @verificado="val => verificar(val)"
        @responsetamizaje="val => respuestaPersona = val"
        :tipo="tipo"
    />
    <v-row>
      <template v-if="verificado === 1">
        <v-col cols="12" v-if="esTamizaje">
          <v-card outlined tile>
            <v-card-text>
              <c-radio
                  v-model="tamizaje.localiza_persona"
                  label="¿Se localiza al paciente?"
                  rules="required"
                  name="localiza al paciente"
                  :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                  item-text="text"
                  item-value="value"
                  :column="!$vuetify.breakpoint.smAndUp"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <template v-if="tamizaje.localiza_persona">
          <v-col cols="12">
            <v-card outlined tile>
              <v-card-text>
                <c-radio
                    v-model="tamizaje.contesta_encuesta"
                    label="Dando cumplimiento a lo dispuesto en la Ley 1581 de 2012, manifiesto que he sido informado por la EPS de lo siguiente:  Que la finalidad de la recolección de mis datos personales, consiste en: Conocer mi estado de salud, así como mi situación actual con respecto a la pandemia de Covid-19.  ¿Autoriza la realización de la Encuesta?"
                    rules="required"
                    name="autorización de la encuesta"
                    :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                    item-text="text"
                    item-value="value"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <template v-if="tamizaje.contesta_encuesta">
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <label class="orange--text">
                    <v-icon color="orange">mdi-alert</v-icon>
                    Según el instructivo del Instituto Nacional de Salud, se recomienda tener especial atención con
                    personas que esten incluidas en alguno de estos grupos.
                  </label>
                  <c-radio
                      v-model="tamizaje.grupo_atencion_especial_id"
                      label="Grupo de atención especial"
                      rules="required"
                      name="grupo de atención especial"
                      :items="gruposAtencionEspecial"
                      item-text="nombre"
                      item-value="id"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" v-if="mujerGestante">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                    v-model="tamizaje.estado_gestacion_lactancia"
                    label="¿Se encuentra en estado de gestación o lactancia?"
                    rules="required"
                    name="estado de gestación o lactancia"
                    :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                    item-text="text"
                    item-value="value"
                    :column="!$vuetify.breakpoint.smAndUp"
                  >
                  </c-radio>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                      v-model="tamizaje.riesgo_procedencia"
                      label="Antecedentes de Viaje: ¿Ud realizó algún viaje desde o hacia las zonas donde se presenta el virus o ha tenido cercanía con personas contagiadas en los últimos 14 días?"
                      rules="required"
                      name="riesgo de procedencia"
                      :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                      item-text="text"
                      item-value="value"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                      v-model="tamizaje.riesgo_ocupacional"
                      label="¿Es Trabajador de la salud u otro personal del ámbito hospitalario que haya tenido contacto estrecho* con caso confirmado para enfermedad por nuevo coronavirus (COVID-19)?"
                      rules="required"
                      name="riesgo trabajador de la salud"
                      :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                      item-text="text"
                      item-value="value"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                      v-model="tamizaje.riesgo_contacto"
                      label="¿Ha tenido contacto estrecho* en los últimos 14 días con un caso confirmado con infección respiratoria aguda grave asociada al nuevo coronavirus 2019 (COVID-19)?"
                      rules="required"
                      name="riesgo de contacto"
                      :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                      item-text="text"
                      item-value="value"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" v-if="tamizaje.tamizador_id === 890">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                      v-model="tamizaje.hospitalizado"
                      label="¿Ha estado hospitalizado?"
                      rules="required"
                      name="hospitalizado"
                      :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                      item-text="text"
                      item-value="value"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                      v-model="tamizaje.prueba_rapida"
                      :label="`¿Le han realizado prueba rápida para Covid-19?`"
                      rules="required"
                      name="le tomaron prueba rápida"
                      :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                      item-text="text"
                      item-value="value"
                  />
                </v-card-text>
                <v-card-text v-if="tamizaje.prueba_rapida === 1">
                  <c-radio
                      v-model="tamizaje.resultado_prueba_rapida"
                      :label="`Resultado de la prueba rápida`"
                      rules="required"
                      name="resultado de la prueba rápida"
                      :items="resultadosPCR.map(x => {return {text: x, value: x}})"
                      item-text="text"
                      item-value="value"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                      v-model="tamizaje.diagnosticado_covid"
                      label="¿Ha sido diagnósticado con covid-19?"
                      rules="required"
                      name="diagnósticado"
                      :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                      item-text="text"
                      item-value="value"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col class="pb-0" cols="12" v-if="tamizaje.diagnosticado_covid">
              <c-date
                  v-model="tamizaje.fecha_diagnostico"
                  rules="required"
                  label="Fecha del diagnóstico"
                  name="fecha del diagnóstico"
                  :max="moment().format('YYYY-MM-DD')"
              />
            </v-col>
          </template>
        </template>
        <template v-if="tamizaje.localiza_persona === 0">
          <v-col cols="12 pb-0">
            <c-select-complete
                v-model="tamizaje.no_efectividad"
                label="Motivo de no localización"
                rules="required"
                name="motivo de no localización"
                :items="tiposNoEfectiva || []"
            />
          </v-col>
        </template>
      </template>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FormPersona from '@/modules/covid/components/erp/FormPersona'
export default {
  name: 'FormTamizaje',
  components: {
    FormPersona
  },
  props: {
    tamizaje: {
      type: Object,
      default: null
    },
    llamada: {
      type: Object,
      default: null
    },
    tipo: {
      type: String,
      default: 'tamizaje'
    }
  },
  data: () => ({
    verificado: 0,
    loadingidentidad: false,
    mujerGestante: 0
  }),
  computed: {
    esTamizaje () {
      return this.tipo === 'tamizaje'
    },
    ...mapGetters([
      'tamizadores',
      'tiposTamizaje',
      'resultadosPCR',
      'gruposAtencionEspecial',
      'tiposNoEfectiva'
    ])
  },
  watch: {
    'tamizaje.edad': {
      handler () {
        this.verificaGestante()
      },
      immediate: true
    },
    'tamizaje.sexo': {
      handler () {
        this.verificaGestante()
      },
      immediate: true
    },
    'tamizaje.localiza_persona': {
      handler (val) {
        if (!val) {
          this.tamizaje.contesta_encuesta = null
        }
      },
      immediate: false
    },
    'tamizaje.tamizador_id': {
      handler (val) {
        if (val !== 890) {
          this.tamizaje.entidad_reporta_sivigila = null
          this.tamizaje.hospitalizado = null
        }
        if ((val !== 888) && (val !== 897) && (val !== 900)) {
          this.tamizaje.codIpsBai = null
        }
      },
      immediate: false
    },
    'tamizaje.prueba_rapida': {
      handler (val) {
        if (!val) {
          this.tamizaje.resultado_prueba_rapida = null
        }
      },
      immediate: false
    },
    'tamizaje.departamento_id': {
      handler (val) {
        if (!val) {
          this.tamizaje.municipio_id = null
        }
      },
      immediate: false
    },
    'tamizaje.tipo_tamizaje': {
      handler (val) {
        val && val === 'presencial' && (this.tamizaje.llamada_entrante = null)
      },
      immediate: false
    },
    'tamizaje.diagnosticado_covid': {
      handler (val) {
        !val && (this.tamizaje.fecha_diagnostico = null)
      },
      immediate: false
    },
    'tamizaje.si_eps': {
      handler (val) {
        !val && (this.tamizaje.eps_id = null)
      },
      immediate: false
    },
    'tamizaje.eps_id': {
      handler (val) {
        !val && (this.tamizaje.tipo_afiliacion = null)
      },
      immediate: false
    },
    'tamizaje.tipo_afiliacion': {
      handler (val) {
        if (!val || val !== 'Régimen Especial') {
          this.tamizaje.regimen_especial = null
        }
      },
      immediate: false
    }
  },
  created () {
    setTimeout(() => {
      if (this.$refs.buscadorips) this.$refs.buscadorips.assign(this.tamizaje.ips_bai)
    }, 600)
  },
  methods: {
    verificaGestante () {
      if (this && this.tamizaje) {
        this.mujerGestante = (this.tamizaje.sexo === 'F' && this.tamizaje.edad > 12) ? 1 : 0
        if (!this.mujerGestante) this.tamizaje.estado_gestacion_lactancia = null
      }
    },
    verificar (val) {
      this.verificado = val
      this.$emit('verificado', val)
    }
  }
}
</script>

<style scoped>

</style>
