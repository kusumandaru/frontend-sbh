<template>
  <div>
    <!-- User Info: Input Fields -->
    <validation-observer
      ref="userRules"
      #default="{ handleSubmit }"
    >
      <b-form
        @submit.prevent="handleSubmit(onSubmit)"
        @reset.prevent="resetForm"
      >
        <b-row>
          <!-- Field: Current Password -->
          <b-col
            cols="12"
            md="4"
          >
            <validation-provider
              #default="validationContext"
              name="Current Password"
              rules="required"
            >
              <b-form-group
                label="Current Password"
                label-for="current-password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="validationContext.errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                    id="current-password"
                    v-model="currentPassword"
                    :type="password1FieldType"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="password1ToggleIcon"
                      @click="togglePassword1Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <div class="invalid-feedback d-block">
                  {{ validationContext.errors[0] }}
                </div>
              </b-form-group>
            </validation-provider>
          </b-col>

          <!-- Field: New Password -->
          <b-col
            cols="12"
            md="4"
          >
            <validation-provider
              #default="validationContext"
              name="New Password"
              vid="Password"
              rules="required|password"
            >
              <b-form-group
                label="New Password"
                label-for="current-password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="validationContext.errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                    id="new-password"
                    v-model="newPassword"
                    :type="password2FieldType"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="password2ToggleIcon"
                      @click="togglePassword2Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <div class="invalid-feedback d-block">
                  {{ validationContext.errors[0] }}
                </div>
              </b-form-group>
            </validation-provider>
          </b-col>

          <!-- confirm password -->
          <b-form-group
            label-for="reset-password-confirm"
            label="Confirm Password"
          >
            <validation-provider
              #default="validationContext"
              name="Confirm Password"
              rules="required|password|confirmed:Password"
            >
              <b-input-group
                class="input-group-merge"
                :class="validationContext.errors.length > 0 ? 'is-invalid':null"
              >
                <b-form-input
                  id="password-confirm"
                  v-model="repeatPassword"
                  :type="password2FieldType"
                  class="form-control-merge"
                  :state="validationContext.errors.length > 0 ? false:null"
                  name="password-confirm"
                  placeholder="············"
                />
                <b-input-group-append is-text>
                  <feather-icon
                    class="cursor-pointer"
                    :icon="password2ToggleIcon"
                    @click="togglePassword2Visibility"
                  />
                </b-input-group-append>
              </b-input-group>
              <small class="text-danger">{{ validationContext.errors[0] }}</small>
            </validation-provider>
          </b-form-group>
        </b-row>
      </b-form>
    </validation-observer>

    <!-- Action Buttons -->
    <b-button
      variant="primary"
      type="submit"
      class="mb-1 mb-sm-0 mr-0 mr-sm-1"
      @click="updatePassword"
    >
      Save Changes
    </b-button>
  </div>
</template>

<script>
import {
  BButton, BRow, BCol, BFormGroup, BFormInput, BForm, BInputGroupAppend, BInputGroup,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {
  required, password, confirmed,
} from '@validations'
import {
  ref, onUnmounted,
} from '@vue/composition-api'
import router from '@/router'
import store from '@/store'
import { avatarText } from '@core/utils/filter'
import userStoreModule from './userStoreModule'

export default {
  components: {
    BButton,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BInputGroup,
    BInputGroupAppend,
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      disabled: true,
      avatar: null,
      successShow: false,
      result: {},
      resultId: null,
      isLoading: false,
      required,
      password,
      confirmed,
      newPassword: '',
      currentPassword: '',
      repeatPassword: '',

      // Toggle Password
      password1FieldType: 'password',
      password2FieldType: 'password',
    }
  },
  computed: {
    password1ToggleIcon() {
      return this.password1FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    password2ToggleIcon() {
      return this.password2FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    togglePassword1Visibility() {
      this.password1FieldType = this.password1FieldType === 'password' ? 'text' : 'password'
    },
    togglePassword2Visibility() {
      this.password2FieldType = this.password2FieldType === 'password' ? 'text' : 'password'
    },
    resetAvatar() {
      this.avatar = null
    },
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
    updatePassword() {
      this.$refs.userRules.validate().then(success => {
        if (success) {
          this.isLoading = true

          const request = new URLSearchParams()
          request.append('new_password', this.newPassword)
          request.append('current_password', this.currentPassword)

          const config = {
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }

          this.$http.patch('/engine-rest/user/profile/password', request, config).then(res => {
            this.result = JSON.parse(JSON.stringify(res.data))
            this.successShow = true
            this.isLoading = false

            this.showToast('success', 'Password changed', 'successfully')
            this.reloadPage()
          }).catch(error => {
            this.isLoading = false
            console.error(error)
            this.showToast('danger', 'Cannot Save Password', error.response.data.message)
          })
        } else {
          this.showToast('danger', 'Cannot Save Password', 'There is any empty data')
        }
      })
    },
    reloadPage() {
      router.go()
    },
  },
  setup() {
    const roleOptions = [
      { label: 'User', value: 'user' },
      { label: 'Admin', value: 'admin' },
      { label: 'Verificator', value: 'verificator' },
    ]

    const statusOptions = [
      { label: 'Pending', value: 'pending' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ]

    const avatarUrl = ref(null)

    const USER_APP_STORE_MODULE_NAME = 'app-user'

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    })

    return {
      avatarText,
      roleOptions,
      statusOptions,
      avatarUrl,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
