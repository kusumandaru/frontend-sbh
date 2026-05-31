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
            Register your tenant here 🚀
          </b-card-title>
          <b-card-text class="mb-2">
            Start certification here
          </b-card-text>

          <!-- form -->
          <validation-observer
            ref="registerForm"
            #default="{invalid}"
          >
            <b-form
              class="auth-register-form mt-2"
              @submit.prevent="register"
            >
              <!-- first name -->
              <b-form-group
                label="First Name"
                label-for="register-first-name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="firstname"
                  vid="firstname"
                  rules="required"
                >
                  <b-form-input
                    id="register-first-name"
                    v-model="firstName"
                    name="register-first-name"
                    :state="errors.length > 0 ? false:null"
                    placeholder="John"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- last name -->
              <b-form-group
                label="Last Name"
                label-for="register-last-name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="lastname"
                  vid="lastname"
                  rules="required"
                >
                  <b-form-input
                    id="register-last-name"
                    v-model="lastName"
                    name="register-last-name"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Doe"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- tenant name -->
              <b-form-group
                label="Company / Tenant Name"
                label-for="register-tenant-name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="tenantname"
                  vid="tenantname"
                  rules="required"
                >
                  <b-form-input
                    id="register-tenant-name"
                    v-model="tenantName"
                    name="register-tenant-name"
                    :state="errors.length > 0 ? false:null"
                    placeholder="PT Satria Perkasa"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- email -->
              <b-form-group
                label="Email"
                label-for="register-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  vid="email"
                  rules="required|email"
                >
                  <b-form-input
                    id="register-email"
                    v-model="userEmail"
                    name="register-email"
                    :state="errors.length > 0 ? false:null"
                    placeholder="john@example.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- password -->
              <b-form-group
                label-for="register-password"
                label="Password"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  vid="password"
                  rules="required|password"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="register-password"
                      v-model="registerPassword"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      :state="errors.length > 0 ? false:null"
                      name="register-password"
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
                  <small class="text-danger">{{ errors[0] }}</small>
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

              <b-form-group>
                <b-form-checkbox
                  id="register-privacy-policy"
                  v-model="status"
                  name="checkbox-1"
                >
                  I agree to
                  <b-link>privacy policy & terms</b-link>
                </b-form-checkbox>
              </b-form-group>

              <b-button
                variant="primary"
                block
                type="submit"
                :disabled="invalid"
              >
                Sign up
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
  BRow, BCol, BLink, BButton, BForm, BFormCheckbox, BFormGroup, BFormInput, BInputGroup, BInputGroupAppend, BImg, BCardTitle, BCardText,
} from 'bootstrap-vue'
import { required, email, password } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import useJwt from '@/auth/jwt/useJwt'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { roleAbility, initialAbility } from '@/libs/acl/config'

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
    BFormCheckbox,
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
      status: '',
      firstName: '',
      lastName: '',
      userEmail: '',
      registerPassword: '',
      repeatPassword: '',
      tenantName: '',
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
    register() {
      this.$refs.registerForm.validate().then(success => {
        if (success) {
          useJwt.register({
            firstName: this.firstName,
            lastName: this.lastName,
            tenantName: this.tenantName,
            email: this.userEmail,
            password: this.registerPassword,
          })
            .then(response => {
              useJwt.setToken(response.data.accessToken)
              useJwt.setRefreshToken(response.data.refreshToken)
              localStorage.setItem('userData', JSON.stringify(response.data.userData))
              const data = roleAbility[response.data.userData.roles]
              this.$ability.update(initialAbility.concat(data))
              this.$router.replace('/')
                .then(() => {
                  this.$toast({
                    component: ToastificationContent,
                    position: 'top-right',
                    props: {
                      title: `Welcome ${response.data.fullName || response.data.username}`,
                      icon: 'CoffeeIcon',
                      variant: 'success',
                      text: `You have successfully logged in as ${response.data.roles[0]}. Now you can start to explore!`,
                    },
                  })
                })
            })
            .catch(error => {
              this.showToast('danger', 'Cannot Save', error.response.data.error)
            })
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
