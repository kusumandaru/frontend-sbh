<template>
  <b-sidebar
    id="add-new-user-sidebar"
    :visible="isAddNewUserSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Add New User
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />

      </div>

      <!-- BODY -->
      <validation-observer
        #default="{ handleSubmit }"
        ref="refFormObserver"
      >
        <!-- Form -->
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(submitUser)"
          @reset.prevent="resetForm"
        >
          <!-- First Name -->
          <validation-provider
            #default="validationContext"
            name="first_name"
            rules="required"
          >
            <b-form-group
              label="First Name"
              label-for="code"
            >
              <b-form-input
                id="firstName"
                v-model="userData.firstName"
                :state="getValidationState(validationContext)"
                trim
              />

              <div class="invalid-feedback d-block">
                {{ validationContext.errors[0] }}
              </div>
            </b-form-group>
          </validation-provider>

          <!-- Last Name -->
          <validation-provider
            #default="validationContext"
            name="Last Name"
            rules="required"
          >
            <b-form-group
              label="Last Name"
              label-for="last_name"
            >
              <b-form-input
                id="lastName"
                v-model="userData.lastName"
                :state="getValidationState(validationContext)"
                trim
              />

              <div class="invalid-feedback d-block">
                {{ validationContext.errors[0] }}
              </div>
            </b-form-group>
          </validation-provider>

          <!-- Email -->
          <validation-provider
            #default="validationContext"
            name="Email"
            rules="required|email"
          >
            <b-form-group
              label="Email"
              label-for="email"
            >
              <b-form-input
                id="email"
                v-model="userData.email"
                type="email"
                :state="getValidationState(validationContext)"
                trim
              />

              <div class="invalid-feedback d-block">
                {{ validationContext.errors[0] }}
              </div>
            </b-form-group>
          </validation-provider>

          <!-- Password -->
          <validation-provider
            #default="validationContext"
            name="Password"
            rules="required|password"
          >
            <b-form-group
              label="Password"
              label-for="password"
            >
              <b-form-input
                id="password"
                v-model="userData.password"
                type="password"
                :state="getValidationState(validationContext)"
                trim
              />

              <div class="invalid-feedback d-block">
                {{ validationContext.errors[0] }}
              </div>
            </b-form-group>
          </validation-provider>

          <validation-provider
            #default="validationContext"
            name="Password Confirm"
            rules="required|password|confirmed:Password"
          >
            <b-form-group
              label="Password Confirm"
              label-for="password"
            >
              <b-form-input
                v-model="userData.passwordConf"
                :state="getValidationState(validationContext)"
                type="password"
                placeholder="Confirm Password"
              />
              <div class="invalid-feedback d-block">
                {{ validationContext.errors[0] }}
              </div>
            </b-form-group>
          </validation-provider>

          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              Add
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="hide"
            >
              Cancel
            </b-button>
          </div>

        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BButton,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { ref } from '@vue/composition-api'
import {
  required,
  alphaNum,
  email,
  password,
} from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Ripple from 'vue-ripple-directive'
import store from '@/store'

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BButton,
    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isAddNewUserSidebarActive',
    event: 'update:is-add-new-user-sidebar-active',
  },
  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      required,
      alphaNum,
      email,
      password,
    }
  },
  methods: {
    showToast(variant, titleToast, description) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: titleToast,
          icon: 'BellIcon',
          text: description,
          variant,
        },
      })
    },
    submitUser() {
      this.$http.post('/engine-rest/user/members', this.userData)
        .then(() => {
          this.$emit('refetch-data')
          this.$emit('update:is-add-new-user-sidebar-active', false)
        }).catch(error => {
          if (error.response.status === 400) {
            this.showToast('danger', 'Cannot Create User', error.response.data.message)
          }
          if (error.response.status === 404) {
            this.showToast('danger', 'Cannot Create User', error.response.data.message)
          }
          if (error.response.status === 500) {
            this.showToast('danger', 'Cannot Create User', error.response.data.message)
          }
        })
    },
  },
  setup(props, { emit }) {
    const blankUserData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    }
    const userData = ref(JSON.parse(JSON.stringify(blankUserData)))
    const resetuserData = () => {
      userData.value = JSON.parse(JSON.stringify(blankUserData))
    }

    const onSubmit = () => {
      store.dispatch('app-user-tenant/addUser', userData.value)
        .then(() => {
          emit('refetch-data')
          emit('update:is-add-new-user-sidebar-active', false)
        }).catch(error => {
          if (error.response.status === 400) {
            this.showToast('danger', 'Cannot Create User', error.response.data.message)
          }
          if (error.response.status === 404) {
            this.showToast('danger', 'Cannot Create User', error.response.data.message)
          }
        })
    }

    const {
      refFormObserver,
      getValidationState,
      resetForm,
    } = formValidation(resetuserData)

    return {
      userData,
      onSubmit,

      refFormObserver,
      getValidationState,
      resetForm,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
