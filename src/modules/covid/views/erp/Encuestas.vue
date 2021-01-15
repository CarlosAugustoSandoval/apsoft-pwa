<template>
  <div>
    <title-bar title="ERP - Encuestas de Riesgo Poblacional" />
    <v-row>
      <template v-if="table && table.total || table.search !== null">
        <v-col cols="12">
          <v-text-field
            v-model="table.search"
            label="Buscar"
            dense
            clearable
            outlined
            :append-icon="table.search && esMovil ? 'mdi-magnify' : ''"
            @input="val => !val ? getRegistros() : ''"
            @click:append="getRegistros"
            @keyup.enter="getRegistros"
            hide-details
          />
        </v-col>
        <v-col class="pt-0" cols="12">
          <template v-if="table.items.length">
            <v-list>
              <template v-for="(item, indexItem) in table.items">
                <v-list-item
                  :key="`erp${indexItem}`"
                  class="px-1"
                  @click="$router.push({ name: 'DetalleERP', params: { idd: item.idd, step: 0 }})"
                >
                  <v-list-item-avatar class="mr-1" color="primary">
                    <v-icon dark>
                      mdi-{{item.sexo ? item.sexo === 'M' ? 'face' : 'face-woman' : 'account-question'}}
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content class="px-0" style="width: 100% !important;">
                    <v-list-item-subtitle
                      class="caption"
                      :class="`${!item.localiza_persona ? 'red' : item.contesta_encuesta === 0 ? 'orange' : 'green'}--text`"
                    >
                      Encuesta {{ item.localiza_persona === null ? 'Pendiente' : item.localiza_persona === 0 ? 'fallida' : item.contesta_encuesta === 0 ? 'no contestada' : 'efectiva' }}
                      <v-icon
                        v-if="item.uuid !== null || (item.nexos.length && item.nexos.find(z => z.uuid !== null || (z.tamizaje && z.tamizaje.uuid !== null)))"
                        :disabled="item.localiza_persona === null"
                        small
                        color="orange"
                        right
                      >mdi-sync</v-icon>
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.nombre }}
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
                  <v-list-item-action class="flex-row-reverse align-center">
                    <v-btn
                      dark
                      depressed
                      fab
                      small
                      color="red"
                      @click.stop="eliminarEncuesta(item)"
                      class="mr-1"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-divider :key="`dividererp${indexItem}`"/>
              </template>
            </v-list>
          </template>
          <template v-else>
            <div class="text-center pt-2">
            <span class="title grey--text text--darken-1 text-center caption pa-1">
              <v-icon>mdi-magnify</v-icon>
              No hay registros para mostrar
            </span>
            </div>
            <div class="text-center pt-2">
              <v-btn
                large
                color="primary"
                dark
                fab
                @click="crearEncuesta"
                v-if="permisos.tamizajeCrear"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </template>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12" class="text-center title">
          No hay encuestas registradas
        </v-col>
        <v-col cols="12" class="text-center title">
          <v-btn
            large
            color="primary"
            dark
            fab
            @click="crearEncuesta"
            v-if="permisos.tamizajeCrear"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </template>
      <loading v-model="table.loading"></loading>
    </v-row>
    <registro-erp
      ref="registroERP"
      @guardado="getRegistros"
    />
    <footer-app v-if="table.items.length">
      <v-btn
        color="primary"
        dark
        absolute
        top
        right
        fab
        @click="crearEncuesta"
        v-if="permisos.tamizajeCrear"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <div class="text-center px-2">
              <span class="title grey--text text--darken-1 text-center caption pa-1">
                Registros del {{ table.from }} al {{ table.to }} de {{ table.total }} totales
              </span>
        <v-pagination
          v-model="table.currentPage"
          :length="table.totalPage"
          :total-visible="7"
          @input="getRegistros"
        />
      </div>
    </footer-app>
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
          >
            Cancelar
          </v-btn>
          <v-spacer/>
          <v-btn
            dark
            color="red"
            @click="confirmaEliminar"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RegistroErp from '@/modules/covid/components/erp/RegistroErp'
import { mapGetters } from 'vuex'
export default {
  name: 'Encuestas',
  components: {
    RegistroErp
  },
  data: () => ({
    eliminar: {
      dialog: false,
      texto: '',
      item: null
    },
    dialog: false,
    table: {
      search: null,
      options: {},
      changeSearch: false,
      items: [],
      loading: false,
      currentPage: 1,
      from: 0,
      to: 0,
      total: 0,
      totalPage: 1,
      itemsPerPage: 20
    }
  }),
  computed: {
    permisos () {
      return this.$store.getters.getPermissionModule('covid')
    },
    ...mapGetters([
      'tiposIdentificacion'
    ])
  },
  watch: {
    'table.options': {
      handler (val) {
        if (val && val.sortBy && val.sortBy.length) this.table.search = null
        this.getRegistros()
      },
      deep: false
    },
    'table.search': {
      handler () {
        this.table.changeSearch = true
      },
      immediate: false
    }
  },
  created () {
    this.$store.commit('SET_GOBACK')
    this.getRegistros()
    this.$store.commit('SET_ASSIGN_DB_COMPLEMENTOS')
  },
  methods: {
    crearEncuesta () {
      this.$refs.registroERP.open()
    },
    eliminarEncuesta (item) {
      this.eliminar.item = item
      this.eliminar.texto = `¿Está seguro de eliminar el registro de ${[item.nombre1, item.apellido1].filter(x => x).join(' ')}?`
      this.eliminar.dialog = true
    },
    cancelaEliminacion () {
      this.eliminar.dialog = false
      setTimeout(() => {
        this.eliminar.texto = ''
        this.eliminar.item = null
      }, 500)
    },
    async confirmaEliminar () {
      this.table.loading = true
      this.$store.dispatch('eliminarERP', this.eliminar.item.idd).then(response => {
        if (response) {
          this.cancelaEliminacion()
          this.getRegistros()
        } else {
          this.table.loading = false
        }
      })
    },
    async getRegistros () {
      this.table.loading = true
      this.$store.dispatch('getERPTabla', this.table).then(data => {
        this.table.changeSearch = false
        this.table.currentPage = data.currentPage
        this.table.totalPage = data.totalPage
        this.table.items = data.items
        this.table.from = data.from
        this.table.to = data.to
        this.table.total = data.total
        this.table.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
