<template>
  <div>
    <title-bar title="EDI - Encuestas Demanda Inducida" />
    <v-chip label color="orange" dark>V9</v-chip>
    <v-btn small color="primary" @click="cargarRegistros">
      Cargador de registros de demandas
    </v-btn>
    <div class="text-center pt-2">
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
      />
    </div>
    <v-data-table
      :loading="table.loading"
      :headers="table.headers"
      :items="table.items"
      :items-per-page="table.itemsPerPage"
      :page.sync="table.currentPage"
      class="elevation-1"
      :options.sync="table.options"
      :header-props="{
        mobile: true
      }"
      hide-default-footer
    >
      <template
        v-slot:body="{ items }"
      >
        <tbody>
        <tr
          v-for="item in items"
          :key="item.id"
        >
          <template v-if="$vuetify.breakpoint.xsOnly">
            <td class="px-0">
              <v-list color="transparent">
                <v-list-item>
                  <v-list-item-content class="px-0" style="width: 100% !important;">
                    <v-list-item-title>{{ [item.primer_nombre, item.segundo_nombre, item.primer_apellido, item.segundo_apellido].filter(x => x).join(' ') }}</v-list-item-title>
                    <v-list-item-subtitle>Ubicado en: {{ item.municipio }}</v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <v-icon color="green">mdi-face-shimmer</v-icon>
                      <v-icon color="red">mdi-tag-faces</v-icon>
                      <v-icon color="purple">mdi-face-woman-shimmer</v-icon>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action class="flex-row-reverse">
                    <v-btn
                      depressed
                      fab
                      x-small
                      color="blue"
                      @click="dialog = true"
                      class="ml-1"
                    >
                      <v-icon color="white">mdi-clipboard-file</v-icon>
                    </v-btn>
                    <v-btn
                      depressed
                      fab
                      x-small
                      color="blue"
                      @click="dialog = true"
                    >
                      <v-icon color="white">mdi-clipboard-file</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </td>
          </template>
          <template v-else>
            <td>{{ item.id }}</td>
            <td>{{ item.numero_identificacion }}</td>
            <td>{{ [item.primer_nombre, item.segundo_nombre, item.primer_apellido, item.segundo_apellido].filter(x => x).join(' ') }}</td>
            <td>{{ item.municipio }}</td>
            <td>{{ item.erp_id ? `ERP: ${item.erp_id}` : '' }}</td>
            <td>{{ item.diagnostico_febrero }}</td>
            <td>{{ item.cronico }}</td>
            <td>{{ item.maternoperinatal }}</td>
            <td>{{ item.alto_costo }}</td>
            <td>
              <v-btn
                depressed
                fab
                small
                color="blue"
                @click="dialog = true"
              >
                <v-icon color="white">mdi-clipboard-file</v-icon>
              </v-btn>
            </td>
          </template>
        </tr>
        </tbody>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <span class="title grey--text text--darken-1 text-center caption pa-1">
              Registros del {{ table.from }} al {{ table.to }} de {{ table.total }} totales
            </span>
      <v-pagination
        v-model="table.currentPage"
        :length="table.totalPage"
        :total-visible="7"
        @input="getRegistros"
      ></v-pagination>
    </div>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Una modal para registrar
        </v-card-title>

        <v-card-text>
          Coontenido de la modal
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <footer-app />
    <loading v-model="table.loading"></loading>
  </div>
</template>

<script>
export default {
  name: 'Encuestados',
  data: () => ({
    dialog: false,
    table: {
      search: '',
      options: {},
      changeSearch: false,
      items: [],
      loading: false,
      currentPage: 1,
      from: 0,
      to: 0,
      total: 0,
      totalPage: 1,
      itemsPerPage: 20,
      headers: [
        {
          text: 'Identificador',
          value: 'id',
          sortable: true
        },
        {
          text: 'Identificación',
          sortable: true,
          value: 'numero_identificacion'
        },
        {
          text: 'Afiliado',
          sortable: false
        },
        {
          text: 'Ubicación',
          value: 'municipio',
          sortable: false
        },
        {
          text: 'ERP',
          sortable: false
        },
        {
          text: 'Diagnóstico',
          value: 'diagnostico_febrero',
          sortable: true
        },
        {
          text: 'Crónico',
          value: 'cronico',
          sortable: true
        },
        {
          text: 'Maternoperinatal',
          value: 'maternoperinatal',
          sortable: true
        },
        {
          text: 'Alto costo',
          value: 'alto_costo',
          sortable: true
        },
        {
          text: 'Opciones',
          sortable: false
        }
      ]
    }
  }),
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
  },
  methods: {
    cargarRegistros () {
      this.table.loading = true
      this.$store.dispatch('downloadDataDemandaInducida').then(() => {
        this.getRegistros()
      })
    },
    async getRegistros () {
      this.table.loading = true
      this.$store.dispatch('getDatosTabla', this.table).then(data => {
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
