<template>
  <v-menu bottom left offset-y origin="top right" transition="scale-transition">
    <template v-slot:activator="{ on }">
      <v-btn dark icon v-on="on" class="mr-1">
        <v-badge color="red" dot>
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-list>
      <h4 class="px-5 py-3 pt-2 font-weight-medium title">Notificaciones</h4>
      <v-divider></v-divider>
      <v-list-item v-for="(item, i) in notifications" :key="i" @click="href">
        <v-list-item-title>
          <div class="d-flex align-center py-3">
            <div class>
              <v-btn class="mr-3" depressed fab small dark :color="item.iconbg">
                <v-icon dark>{{ item.icon }}</v-icon>
              </v-btn>
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
  name: 'Notifications',
  data: () => ({
    notifications: [
      {
        title: 'Launch Admin',
        iconbg: 'error',
        icon: 'mdi-link-variant',
        desc: 'Just see the my new admin!',
        time: '9:30AM'
      },
      {
        title: 'Event today',
        iconbg: 'success',
        icon: 'mdi-calendar-check',
        desc: 'Just a reminder that you have event',
        time: '10:30AM'
      },
      {
        title: 'Settings',
        iconbg: 'info',
        icon: 'mdi-cog',
        desc: 'You can customize this template as you want',
        time: '11:30AM'
      },
      {
        title: 'Pavan Kumar',
        iconbg: 'indigo',
        icon: 'mdi-account',
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
