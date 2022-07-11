
<template>
  <v-app>
    <v-system-bar color="primary">
      <v-icon icon="mdi-wifi-strength-4" class="ml-2"></v-icon>

      <v-icon icon="mdi-signal-cellular-outline" class="ml-2"></v-icon>

      <v-icon icon="mdi-battery" class="ml-2"></v-icon>

      <span class="ml-2">08:30</span>
    </v-system-bar>


    <v-app-bar color="primary" density="compact">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Photos</v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>


    <v-navigation-drawer expand-on-hover rail>
      <v-list>
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" title="Sandra Adams"
          subtitle="sandra_a88@gmailcom"></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
        <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
        <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
      </v-list>
    </v-navigation-drawer>


    <v-main>
      <v-container fill-height>
        <router-view />
      </v-container>
    </v-main>


    <v-footer fixed>
      footer
    </v-footer>


    <v-bottom-navigation >
      <v-btn value="recent">
        <span>Recent</span>

        <v-icon>mdi-history</v-icon>
      </v-btn>

      <v-btn value="favorites">
        <span>Favorites</span>

        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn value="nearby">
        <span>Nearby</span>

        <v-icon>mdi-map-marker</v-icon>
      </v-btn>
    </v-bottom-navigation>

  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  data() {
    return {
      //
    }
  },
})
</script>
