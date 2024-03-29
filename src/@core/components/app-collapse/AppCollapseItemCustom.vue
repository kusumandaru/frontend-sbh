<template>
  <b-card
    no-body
    :class="{'open': visible}"
    @mouseenter="collapseOpen"
    @mouseleave="collapseClose"
  >
    <b-card-header

      :class="{'collapsed': !visible}"
      :aria-expanded="visible ? 'true' : 'false'"
      :aria-controls="collapseItemID"
      :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
      role="tab"
      data-toggle="collapse"
      @click="updateVisible(!visible)"
    >
      <slot name="header">
        <span class="lead collapse-title">{{ title }}</span>
        <small
          v-if="subtitle"
          class="notification-text"
        >{{ subtitle }}</small>
      </slot>
    </b-card-header>

    <b-collapse
      :id="collapseItemID"
      v-model="visible"
      :accordion="accordion"
      role="tabpanel"
    >
      <b-card-body>
        <slot />
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardBody, BCollapse,
} from 'bootstrap-vue'
import { v4 as uuidv4 } from 'uuid'

export default {
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BCollapse,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    headerBgVariant: {
      type: String,
      default: 'primary',
    },
    headerTextVariant: {
      type: String,
      default: 'white',
    },
  },
  data() {
    return {
      visible: false,
      collapseItemID: '',
      openOnHover: this.$parent.hover,
    }
  },
  computed: {
    accordion() {
      return this.$parent.accordion ? `accordion-${this.$parent.collapseID}` : null
    },
  },
  created() {
    this.collapseItemID = uuidv4()
    this.visible = this.isVisible
  },
  methods: {
    updateVisible(val = false) {
      if (this.headerBgVariant === 'primary') {
        this.visible = val
        this.$emit('visible', val)
      } else {
        this.visible = false
        this.$emit('visible', false)
      }
    },
    collapseOpen() {
      if (this.openOnHover) this.updateVisible(true)
    },
    collapseClose() {
      if (this.openOnHover) this.updateVisible(false)
    },
  },
}
</script>
