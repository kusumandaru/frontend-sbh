<template>
  <div>
    <!-- project information section -->
    <section id="fa-search-filter">
      <b-card
        no-body
        class="faq-search"
        :style="{backgroundImage:`url(${require('@/assets/images/banner/banner.png')})`}"
      >

        <!-- Header -->
        <b-card
          no-body
          class="project-preview-card"
        >
          <!-- alert -->
          <alert :key="alertKey" />
          <!-- alert -->

          <b-card-body class="project-padding pb-0">
            <div class="d-flex justify-content-between flex-md-row flex-column project-spacing mt-0">
              <!-- Header: Left Content -->
              <div>
                <div class="logo-wrapper">
                  <h3 class="text-primary project-logo">
                    {{ projectData.building_name }}
                  </h3>
                </div>
                <p class="card-text mb-25">
                  {{ projectData.building_address }}
                </p>
                <p class="card-text mb-25">
                  {{ projectData.city_name }}
                </p>
                <p class="card-text mb-25">
                  {{ projectData.province_name }}
                </p>
                <p class="card-text mb-25">
                  {{ projectData.postal_code }}
                </p>
                <p class="card-text mb-0">
                  <feather-icon icon="PhoneIcon" />
                  Telephone: {{ projectData.telephone }}
                </p>
                <p class="card-text mb-0">
                  <feather-icon icon="PhoneIcon" />
                  Handphone: {{ projectData.handphone }}
                </p>
                <p class="card-text mb-0">
                  <feather-icon icon="MailIcon" />
                  Email: {{ projectData.email }}
                </p>
                <p class="card-text mb-0">
                  <feather-icon icon="PrinterIcon" />
                  Faximile: {{ projectData.faximile }}
                </p>
              </div>

              <!-- Header: Right Content -->
              <div class="mt-md-0 mt-2">
                <h4 class="project-title">
                  Project ID
                  <span class="project-number">#{{ projectData.task_id }}</span>
                </h4>
                <div class="project-date-wrapper">
                  <p class="project-date-title">
                    Date Created:
                  </p>
                  <p class="project-date">
                    {{ projectData.created_at | moment("dddd, MMMM Do YYYY") }}
                  </p>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>

        <b-card-body class="text-center">
          <h1 class="text-primary">
            Final Assessment
          </h1>
          <b-card-text class="mb-2">
            <h2 class="text-primary">
              Evaluation
            </h2>
          </b-card-text>
          <div class="container h-100">
            <div class="row align-items-center h-100">
              <div class="col-6 mx-auto">
                <div class="card h-100 border-primary justify-content-center">
                  <div>
                    <card-analytic-goal-overview
                      :key="scoreKey"
                      :rerender-score-parent="forceRerenderScore"
                    />
                  </div>
                </div>
              </div>
              <upload-assessment
                :key="uploadAssessmentKey"
                :rerender-upload-assessment="forceRerenderUploadAssessment"
              />
              <!-- Spacer -->
              <hr class="project-spacing">
              <scoring-document />
            </div>
          </div>
        </b-card-body>
      </b-card>
    </section>

    <!--/ submit button -->
    <eligible-submit :key="eligibleSubmitKey" />

    <!--/ project information section -->
    <card-statistic :key="cardStatisticKey" />

    <!-- tab for evaluation -->
    <f-a-tab :rerender-score-parent="forceRerenderScore" />
    <!--/ tab for evaluation -->

  </div>
</template>

<script>
import {
  BCard,
  BCardBody,
  BCardText,
} from 'bootstrap-vue'
import {
  ref, onUnmounted,
} from '@vue/composition-api'
import router from '@/router'
import store from '@/store'
import Ripple from 'vue-ripple-directive'
import projectStoreModule from '@/views/projectStoreModule'
import FATab from './FATab.vue'
import CardAnalyticGoalOverview from './CardAnalyticGoalOverview.vue'
import CardStatistic from './CardStatistic.vue'
import UploadAssessment from './UploadAssessment.vue'
import ScoringDocument from './ScoringDocument.vue'
import EligibleSubmit from './EligibleSubmit.vue'
import Alert from './Alert.vue'

export default {
  components: {
    BCard,
    BCardBody,
    BCardText,
    FATab,
    CardAnalyticGoalOverview,
    CardStatistic,
    UploadAssessment,
    ScoringDocument,
    EligibleSubmit,
    Alert,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      eligibleSubmitKey: 1,
      scoreKey: 0,
      cardStatisticKey: 0,
      uploadAssessmentKey: 0,
      alertKey: 0,
    }
  },
  computed: {
    statusVariant() {
      const statusColor = {
        /* eslint-disable key-spacing */
        1 : 'light-primary',
        2 : 'light-success',
        3 : 'light-danger',
        /* eslint-enable key-spacing */
      }

      return status => statusColor[status]
    },
  },
  watch: {
  },
  methods: {
    forceRerenderScore() {
      this.scoreKey += 1
      this.cardStatisticKey += 1
      this.eligibleSubmitKey += 1
    },
    forceRerenderUploadAssessment() {
      this.uploadAssessmentKey += 1
      this.eligibleSubmitKey += 1
    },
  },
  setup() {
    const projectData = ref({})
    const PROJECT_APP_STORE_MODULE_NAME = 'app-project'

    // Register module
    if (!store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.registerModule(PROJECT_APP_STORE_MODULE_NAME, projectStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.unregisterModule(PROJECT_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-project/fetchClientProject', { id: router.currentRoute.params.id })
      .then(response => {
        projectData.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          projectData.value = undefined
        }
        if (error.response.status === 500) {
          projectData.value = undefined
        }
      })

    return {
      projectData,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-faq.scss';
@import '@core/scss/vue/pages/page-pricing.scss';
</style>
