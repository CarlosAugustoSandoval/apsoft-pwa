<template>
  <v-menu bottom left offset-y origin="top right" transition="scale-transition">
    <template v-slot:activator="{ on }">
      <v-btn dark icon v-on="on" class="mr-2">
        <v-badge color="red" dot>
          <v-icon>mdi-message</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-list>
      <h4 class="px-5 pt-2 py-3 font-weight-medium title">Mensajes</h4>
      <v-divider></v-divider>
      <v-list-item v-for="(item, i) in messages" :key="i" @click="href">
        <v-list-item-title>
          <div class="d-flex align-center py-3">
            <div class="mr-3">
              <v-badge bordered bottom :color="item.avatarstatus" dot offset-x="10" offset-y="10">
                <v-avatar>
                  <img
                      :src="'https://www.wrappixel.com/demos/admin-templates/materialpro-bootstrap-latest/material-pro/src/assets/images/users/' + item.avatar + '.jpg'"
                      :alt="item.title"
                  />
                </v-avatar>
              </v-badge>
            </div>
            <div>
              <h4 class="font-weight-medium">{{ item.title }}</h4>
              <span class="text--secondary caption descpart d-block text-truncate">{{item.desc}}</span>
              <small class="text--secondary">{{item.time}}</small>
            </div>
          </div>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
// Utilities
// import { mapState } from 'vuex'
export default {
  name: 'Messages',
  data: () => ({
    messages: [
      {
        title: 'Sonu Nigam',
        avatar: '1',
        avatarstatus: 'success',
        desc: 'Singing Show tonigh at 9pm!',
        time: '9:30AM'
      },
      {
        title: 'Sonu Nigam',
        avatar: '2',
        avatarstatus: 'error',
        desc: 'The greate malody songs ever sung',
        time: '10:30AM'
      },
      {
        title: 'Arijit singh',
        avatar: '3',
        avatarstatus: 'warning',
        desc: 'You can customize this template as you want',
        time: '11:30AM'
      },
      {
        title: 'Pavan Kumar',
        avatar: '4',
        avatarstatus: 'success',
        desc: 'Sent you an notification',
        time: '12:30AM'
      }
    ],
    href () {
      return undefined
    }
  }),
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss">

</style>
