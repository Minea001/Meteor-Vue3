<script setup>
import { ref } from 'vue'
import SideBar from './Sidebar.vue'
import Notification from './_Notification.vue'
import AdminSetting from './_AdminSetting.vue'
import Breadcrumb from './_Breadcrumb.vue'

const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
const stateChange = (val) => {
  leftDrawerOpen.value = val
}
</script>

<template>
  <q-layout view="lHr LpR lfr">
    <!-- Header -->
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
        />

        <q-toolbar-title class="app-breadcrumb-toolbar">
          <Breadcrumb />
        </q-toolbar-title>
        <div class="q-gutter-x-xs">
          <!-- Notification -->
          <Notification />
          <!-- Full screen -->
          <q-btn
            flat
            round
            dense
            @click="$q.fullscreen.toggle()"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          />

          <!-- Admin Setting -->
          <AdminSetting />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <SideBar :drawer-state="leftDrawerOpen" @state-change="stateChange" />

    <!-- Content -->
    <q-page-container class="bg-grey-2">
      <q-page class="overflow-hidden q-pa-md">
        <router-view v-slot="{ Component, route }">
          <!-- <transition name="fade-x" mode="out-in"> -->
          <component :is="Component" :key="route.fullPath" />
          <!-- </transition> -->
        </router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style lang="scss" scoped>
.app-header-toolbar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.app-breadcrumb-toolbar {
  line-height: 1.5;
  font-size: 14px;
}
</style>
