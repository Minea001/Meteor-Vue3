<template>
  <q-drawer show-if-above v-model="drawer" :width="250" side="left">
    <!-- Sidebar header -->
    <q-toolbar class="app-sidebar-header shadow-none absolute-top">
      <img src="/images/rabbit.png" width="30" height="30" class="q-ml-xs" />
      <q-toolbar-title class="text-white text-subtitle1 text-weight-medium">
       SALE SYSTEM
      </q-toolbar-title>
    </q-toolbar>

    <!-- Sidebar content -->
    <q-scroll-area class="app-sidebar-scroll-area">
      <q-list padding class="app-menu">
        <template v-for="(menuItem, index) in navbarItems" :key="index">
          <!-- Header -->
          <q-item-label
            v-if="menuItem.header"
            header
            class="q-pa-sm text-caption"
          >
            {{ menuItem.header }}
          </q-item-label>

          <!-- Separator -->
          <q-separator v-else-if="menuItem.separator" />

          <!-- Have sub menu -->
          <div
            v-else-if="menuItem.children"
            :id="menuItem.group"
            @mouseenter="hoverMenuWithChild(menuItem, true)"
            @mouseleave="hoverMenuWithChild(menuItem, false)"
          >
            <q-expansion-item
              :value="activeGroup == menuItem.group"
              :expand-separator="false"
              :icon="menuItem.icon"
              :label="menuItem.title"
              :duration="500"
              expanded-icon="none"
              group="once"
              :class="activeGroupClass(menuItem)"
              expand-icon-class="hidden"
              @click="pushRouter(menuItem.route)"
            >
              <template #header>
                <q-item-section v-if="menuItem.icon" avatar>
                  <q-icon :name="menuItem.icon" size="16px" />
                </q-item-section>
                <q-item-section>{{ menuItem.title }}</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>
              </template>

              <q-item
                v-for="(childMenuItem, childIndex) in menuItem.children"
                :key="childIndex"
                v-ripple
                :active="activeSubMenu(childMenuItem)"
                clickable
                class="is-sub-item"
                @click="pushRouter(childMenuItem.route)"
              >
                <q-item-section v-if="childMenuItem.icon" avatar>
                  <q-icon :name="childMenuItem.icon" size="16px" />
                </q-item-section>
                <q-item-section>{{ childMenuItem.title }}</q-item-section>
              </q-item>
            </q-expansion-item>
          </div>

          <!-- No sub menu -->
          <q-item
            v-else
            v-ripple
            clickable
            :active="activeRouterName === menuItem?.route?.name"
            @click="pushRouter(menuItem.route)"
          >
            <q-item-section v-if="menuItem.icon" avatar>
              <q-icon :name="menuItem.icon" size="16px" />
            </q-item-section>
            <q-item-section>{{ menuItem.title }}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-scroll-area>

    <q-menu
      :value="!!subMenuTarget"
      :target="subMenuTarget"
      no-parent-event
      square
      anchor="top right"
      self="top left"
      transition-show="none"
      transition-hide="none"
      content-style="box-shadow: none"
    >
      <q-list
        class="app-sidebar-sub-level-item"
        @mouseenter="hoverChildMenu(true)"
        @mouseleave="hoverChildMenu(false)"
      >
        <q-item
          v-for="(item, index) in subMenuList"
          :key="index"
          :active="activeSubMenu(item)"
          clickable
          @click="pushRouter(item.route)"
        >
          <q-item-section>{{ item.title }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-drawer>
</template>
<script>
export default {
  name: 'SideBar',
}
</script>
<script setup>
import { reactive, watch, nextTick, ref } from 'vue'
// withDefaults,
//   defineProps,
//   defineEmits,
import { debounce, flatten, map, filter } from 'lodash'
import { useRoute, useRouter } from 'vue-router'
// Sidebar items
import navbar from '../navbar'

// Quasar
import {
  QDrawer,
  QScrollArea,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QSeparator,
  QIcon,
  QExpansionItem,
  QToolbar,
  QToolbarTitle,
  QMenu,
} from 'quasar'

const route = useRoute()
const router = useRouter()

const props =
  // withDefaults(
  defineProps({
    drawerState: Boolean,
  })
//   ,
//   {
//     drawerState: true,
//   }
// )

const emit = defineEmits(['state-change'])

const drawer = ref(true) //props.drawerState,
const activeRouterName = ref(route.name || 'admin')
const activeGroup = ref(null)
const subMenuTarget = ref(false)
const subMenuList = ref([])
const isHovering = ref(false)
const navbarItems = ref([...navbar])

// Methods
const findActiveGroup = (activeRouterName) => {
  // Get all child list
  let childrenItem = flatten(
    filter(map(navbarItems.value, 'children'), (childList) => {
      return childList
    })
  )

  let activeMenuItem = filter(childrenItem, (o) => {
    let activeName = o.route.name
    let activeParam = o.route.params?.activeCom || ''
    let activeRoute = activeName + activeParam
    return activeRoute === activeRouterName
  })

  // Set active group value
  if (activeMenuItem.length) activeGroup.value = activeMenuItem[0].group
  else activeGroup.value = null
}

const activeGroupClass = (menuItem) => {
  let isActive =
    menuItem.group === activeGroup.value ||
    (menuItem.route && menuItem.route.name === activeRouterName.value)

  return isActive ? 'expansion-item--active' : ''
}

const activeSubMenu = (childMenuItem) => {
  let activeName = childMenuItem.route.name
  let activeParam = childMenuItem.route.params?.activeCom || ''
  let activeRoute = activeName + activeParam
  return activeRouterName.value === activeRoute
}

const hoverMenuWithChild = (item, hover = false) => {
  if (item.group == activeGroup.value) {
    return checkHideSubMenu(false, false)
  }

  if (hover) {
    isHovering.value = true
    subMenuList.value = item.children
    // Check target changed for recreat new menu
    if (subMenuTarget.value != `#${item.group}`) subMenuTarget.value = false
    // Set target
    nextTick(() => {
      subMenuTarget.value = `#${item.group}`
    })
  } else {
    isHovering.value = false
    checkHideSubMenu()
  }
}

const hoverChildMenu = (hover = false) => {
  if (hover) {
    isHovering.value = true
  } else {
    isHovering.value = false
    checkHideSubMenu()
  }
}

const checkHideSubMenu = (isHovering = true, isDelay = true) => {
  if (isDelay) {
    debounce(() => {
      if (!isHovering.value || !isHovering) {
        subMenuList.value = []
        subMenuTarget.value = false
      }
    }, 300)()
  } else {
    subMenuList.value = []
    subMenuTarget.value = false
  }
}

// push router
const pushRouter = (sideBarRoute) => {
  router.push(sideBarRoute)
}

// Watcher
watch(
  route,
  (routeVal) => {
    if (routeVal) {
      let activeName
      // Check if router has link-active
      if (routeVal.meta.linkActive) activeName = routeVal.meta.linkActive
      else activeName = routeVal.name
      // Active router param
      let activeParam = routeVal.params?.activeCom || ''
      // Active router
      activeRouterName.value = activeName + activeParam
      // Active group
      findActiveGroup(activeRouterName.value)
    }

    // Hide sub menu
    checkHideSubMenu(!true)
  },
  { immediate: true }
)
watch(
  () => drawer.value,
  (newState) => {
    emit('state-change', newState)
  }
)
watch(
  () => props.drawerState,
  (newState) => {
    drawer.value = newState
  }
)
</script>

<style lang="scss" scoped>
.app-sidebar-header {
  background-color: #212121;
  border-bottom: 1px solid rgba(229, 229, 229, 0.25);
  color: #ffff;
  align-items: center;
}
.app-sidebar-scroll-area {
  height: calc(100% - 50px);
  margin-top: 50px;
  background-color: #2e323a !important;
}

.app-sidebar-sub-level-item {
  min-width: 150px;
  border-radius: 0;
  background-color: #2e323a !important;
  border-left: 1px solid rgba(255, 255, 255, 0.32);

  .q-item {
    color: #ffffff !important;
    letter-spacing: 0.5px;
    font-size: 12px;
    font-weight: 700;
    box-sizing: border-box;
    letter-spacing: 0.5px;

    .q-focus-helper {
      width: 100%;
      color: rgba(255, 255, 255, 0.23);
    }

    &.q-item--active {
      color: #ffd04b !important;
      font-weight: bold;
      background: rgba(255, 255, 255, 0.23);
      &:before {
        background: rgba(255, 255, 255, 0.23);
      }
    }
  }
}

.app-menu {
  .q-item {
    color: #ffffff !important;
    letter-spacing: 0.5px;
    font-size: 12px;
    font-weight: 700;
    box-sizing: border-box;
    letter-spacing: 0.5px;

    .q-focus-helper {
      width: 100%;
      color: rgba(255, 255, 255, 0.23);
    }

    .q-item__section--avatar {
      color: #fff;
      min-width: auto;
      padding-right: 10px;
      padding-left: 5px;
      i {
        font-size: 16px !important;
      }
    }
  }

  .q-item--active {
    color: #ffd04b !important;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.23);
    &:before {
      background: rgba(255, 255, 255, 0.23);
    }

    .q-item__section--avatar {
      color: #ffd04b !important;
    }
  }

  .q-expansion-item {
    :deep(.q-expansion-item__container) {
      .q-item {
        color: #ffffff !important;
        letter-spacing: 0.5px;
        font-size: 12px;
        font-weight: 700;
        box-sizing: border-box;
        letter-spacing: 0.5px;

        .q-focus-helper {
          width: 100%;
          color: rgba(255, 255, 255, 0.23);
        }

        .q-item__section--avatar {
          color: #fff;
          min-width: auto;
          padding-right: 10px;
          padding-left: 5px;
          i {
            font-size: 16px !important;
          }
        }
      }

      .q-expansion-item__content {
        background-color: rgba(0, 0, 0, 0.12) !important;
        .is-sub-item {
          padding-left: 40px;
        }
      }
    }

    &.expansion-item--active {
      :deep(.q-expansion-item__container) {
        .q-item {
          // .q-item__section--avatar {
          //   color: #ffd04b !important;
          // }

          &:not(.is-sub-item) {
            font-weight: bold;
            color: #ffd04b !important;
            background: rgba(255, 255, 255, 0.23);

            &.disabled {
              color: #212121;
              font-weight: normal;
            }
            &:before {
              background: rgba(255, 255, 255, 0.23);
            }

            .q-item__section--avatar {
              color: #ffd04b !important;
            }
          }

          &.is-sub-item {
            &.q-item--active {
              color: #ffd04b !important;
              background: rgba(255, 255, 255, 0.23);
            }
          }
        }
      }
    }
  }
}
</style>
