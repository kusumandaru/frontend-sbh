<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">
      <!-- Brand logo-->
      <b-link class="brand-logo">
        <vuexy-logo />
        <h2 class="brand-text text-primary ml-1">
          Sertifikasi Bangunan Hijau
        </h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Register V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Register-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >
          <b-card-title class="mb-1">
            Reset your password
          </b-card-title>
          <b-card-text class="mb-2">
            Here
          </b-card-text>

          <!-- form -->
          <validation-observer
            ref="resetPasswordForm"
            #default="{invalid}"
          >
            <b-form
              class="auth-register-form mt-2"
              @submit.prevent="savePassword"
            >
              <!-- password -->
              <b-form-group
                label-for="register-password"
                label="Password"
              >
                <validation-provider
                  #default="validationContext"
                  name="New Password"
                  vid="password"
                  rules="required|password"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="validationContext.errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="new-password"
                      v-model="newPassword"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      :state="validationContext.errors.length > 0 ? false:null"
                      name="new-password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        :icon="passwordToggleIcon"
                        class="cursor-pointer"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ validationContext.errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                label-for="reset-password-confirm"
                label="Confirm Password"
              >
                <validation-provider
                  #default="validationContext"
                  name="Confirm Password"
                  rules="required|password|confirmed:password"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="validationContext.errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="password-confirm"
                      v-model="repeatPassword"
                      :type="passwordFieldType"
                      class="form-control-merge"
                      :state="validationContext.errors.length > 0 ? false:null"
                      name="password-confirm"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ validationContext.errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-button
                variant="primary"
                block
                type="submit"
                :disabled="invalid"
              >
                Reset Password
              </b-button>
            </b-form>
          </validation-observer>

          <p class="text-center mt-2">
            <span>Already have an account?</span>
            <b-link :to="{name:'auth-login'}">
              <span>&nbsp;Sign in instead</span>
            </b-link>
          </p>

          <!-- divider -->
          <div class="divider my-2">
            <div class="divider-text">
              or
            </div>
          </div>

          <div class="auth-footer-btn d-flex justify-content-center">
            <b-button
              variant="facebook"
              href="javascript:void(0)"
            >
              <feather-icon icon="FacebookIcon" />
            </b-button>
            <b-button
              variant="twitter"
              href="javascript:void(0)"
            >
              <feather-icon icon="TwitterIcon" />
            </b-button>
            <b-button
              variant="google"
              href="javascript:void(0)"
            >
              <feather-icon icon="MailIcon" />
            </b-button>
            <b-button
              variant="github"
              href="javascript:void(0)"
            >
              <feather-icon icon="GithubIcon" />
            </b-button>
          </div>
        </b-col>
      </b-col>
    <!-- /Register-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BRow, BCol, BLink, BButton, BForm, BFormGroup, BFormInput, BInputGroup, BInputGroupAppend, BImg, BCardTitle, BCardText,
} from 'bootstrap-vue'
import { required, email, password } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import router from '@/router'

export default {
  components: {
    VuexyLogo,
    BRow,
    BImg,
    BCol,
    BLink,
    BButton,
    BForm,
    BCardText,
    BCardTitle,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BInputGroupAppend,
    // validations
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      userToken: null,
      newPassword: '',
      repeatPassword: '',
      sideImg: require('@/assets/images/pages/login-v5.jpeg'),
      // validation
      required,
      email,
      password,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v5.jpeg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  created() {
    this.retrieveToken()
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
    retrieveToken() {
      this.$http.get(`engine-rest/user/reset_password/${router.currentRoute.params.id}`)
        .then(res => {
          this.userToken = res.data
        }).catch(error => {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Invalid token',
              icon: 'CoffeeIcon',
              variant: 'error',
              text: error.response.data.message,
            },
          })

          this.$router.push({ name: 'auth-login' })
        })
    },
    savePassword() {
      this.$refs.resetPasswordForm.validate().then(success => {
        if (success) {
          this.isLoading = true

          const request = new URLSearchParams()
          request.append('password', this.newPassword)
          request.append('token', router.currentRoute.params.id)

          const config = {
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }

          this.$http.patch('/engine-rest/user/reset_password', request, config).then(res => {
            this.result = JSON.parse(JSON.stringify(res.data))
            this.successShow = true
            this.isLoading = false

            this.$router.push({ name: 'auth-login' })
          }).catch(error => {
            this.isLoading = false
            console.error(error)
            this.showToast('danger', 'Cannot Reset Password', error.response.data.message)
          })
        } else {
          this.showToast('danger', 'Cannot Reset Password', 'There is any empty data')
        }
      })
    },
  },
}
/* eslint-disable global-require */
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
