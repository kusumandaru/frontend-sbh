<template>
  <b-overlay
    :show="isLoading"
    rounded="sm"
  >
    <div v-if="exercise">
      <b-card class="card-app-design">
        <div class="d-flex align-items-center">
          <b-avatar
            rounded
            size="42"
            variant="light-primary"
            class="mr-1"
          >
            <feather-icon
              icon="CheckSquareIcon"
              size="20"
            />
          </b-avatar>
          <div>
            <h4 class="mb-0">
              {{ exercise.exercise.name }}
            </h4>
            <span>{{ exercise.exercise.code }}</span>
          </div>

          <div
            class="design-planning-wrapper"
            style="position:absolute; right:20px;"
          >
            <div class="design-planning">
              <p class="card-text mb-25">
                {{ translateExerciseType(exercise) }}
              </p>
              <h6 class="mb-0">
                {{ exerciseMaxScore(exercise) }}
              </h6>
            </div>
          </div>
        </div>
      </b-card>

      <b-card v-if="eligibleScoreModifier(exercise)">
        <h6 class="section-label">
          Checklist
        </h6>
        <b-card
          v-for="(modifier, midx) in exercise.modifiers"
          :key="midx"
        >
          <b-media no-body>
            <b-media-body>
              <h6 class="font-weight-bolder mb-25">
                {{ modifier.master_score_modifier.title }}
              </h6>
              <b-form-checkbox
                v-model="modifier.enabled"
                @change="takeModifier(modifier, exercise)"
              >
                <div v-html="modifier.master_score_modifier.description" />
              </b-form-checkbox>
            </b-media-body>
          </b-media>
        </b-card>
      </b-card>

      <!-- collapse -->
      <app-collapse
        id="d-r-detail"
        accordion
        type="margin"
        class="mt-2"
      >
        <app-collapse-item
          v-for="( criteria,idx) in exercise.criterias"
          :ref="`collapse-item-ref-${criteria.id}`"
          :key="idx"
          :title="criteria.criteria.code"
          :subtitle="translateStatus(criteria)"
          :header-bg-variant="criteria.criteria.not_available ? 'warning' : 'primary'"
        >
          <p v-html="criteria.criteria.description" />

          <!-- Spacer -->
          <hr class="project-spacing">

          <!-- scoring -->
          <div v-if="exercise.exercise.exercise_type === 'score'">
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label="Nilai yang disetujui"
              label-for="input-default"
            >
              <b-form-input
                id="input-default"
                v-model="criteria.approved_score"
                :disabled="disabled"
              />
            </b-form-group>

            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label="Nilai yang diajukan"
              label-for="input-default"
            >
              <b-form-input
                id="input-default"
                v-model="criteria.submitted_score"
                :disabled="disabled"
              />
            </b-form-group>

            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              :label="criteria.criteria.exercise_type == 'score' ? 'Nilai' : 'Nilai yang dipilih'"
              label-for="input-default"
            >
              <!-- score -->
              <b-form-input
                v-if="criteria.criteria.exercise_type == 'score'"
                id="input-default"
                v-model="criteria.criteria.score"
                :disabled="disabled"
              />

              <v-select
                v-if="criteria.criteria.exercise_type == 'max_score'"
                v-model="criteria.submitted_score"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="scoreDictionary(criteria)"
                :reduce="val => val.value"
                :clearable="false"
                :disabled="criteria.approval_status == 2 || criteria.approval_status == 4"
                label="text"
                code="value"
              >
                <template #option="{ text }">
                  <span> {{ text }}</span>
                </template>
              </v-select>
            </b-form-group>
          </div>
          <!-- scoring -->

          <!-- take score -->
          <p />
          <b-col
            v-if="!readOnly"
            cols="12"
          >
            <b-button
              v-if="[1,3].includes(criteria.approval_status)"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              @click="takeScore(criteria)"
            >
              Take Point
            </b-button>
          </b-col>
          <!-- take score -->

          <!-- untake score -->
          <p />
          <b-col
            v-if="!readOnly"
            cols="12"
          >
            <b-button
              v-if="[2,3].includes(criteria.approval_status)"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="danger"
              @click="untakeScore(criteria)"
            >
              Cancel Take
            </b-button>
          </b-col>
          <!-- untake score -->

          <p />

          <!-- Spacer -->
          <hr class="project-spacing">

          <b-table
            :fields="docFields"
            :items="criteria.documents"
            responsive
            class="mb-0"
          >
            <template #cell(show_attachment)="row">
              <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
              <b-form-checkbox
                v-model="row.detailsShowing"
                @change="row.toggleDetails"
              >
                {{ row.detailsShowing ? 'Hide' : 'Show' }}
              </b-form-checkbox>
            </template>
            <template #cell(attachment_size)="row">
              {{ row.item.attachments.length }}
            </template>
            <!-- full detail on click -->
            <template #row-details="row">
              <b-card>
                <b-row class="mb-2">
                  <b-table
                    responsive
                    :items="row.item.attachments"
                    :fields="documentFields"
                    class="mb-0"
                  >
                    <template #cell(uploader_id)="uploader">
                      {{ uploader.item.user.first_name }} {{ uploader.item.user.last_name }}
                    </template>
                    <template #cell(filename)="doc">
                      <b-link
                        class="font-weight-bold d-block text-nowrap text-muted"
                        @click="getAttachment(doc.item)"
                      >
                        {{ doc.value }}
                      </b-link>
                    </template>
                    <template
                      v-if="!readOnly"
                      #cell(action)="drow"
                    >
                      <feather-icon
                        v-if="drow.item.submitted_at == undefined"
                        :id="`master-row-${row.item.id}-delete-icon`"
                        icon="Trash2Icon"
                        size="16"
                        class="mx-1"
                        @click="deleteAttachment(drow.item, criteria)"
                      />
                    </template>
                  </b-table>
                  <b-row v-if="criteria.approval_status !== 4 && !readOnly">
                    <b-col md="9">
                      <b-form-file
                        v-model="row.item.files"
                        placeholder="Choose a file or drop it here..."
                        drop-placeholder="Drop file here..."
                        multiple
                      />
                    </b-col>
                    <b-col md="2">
                      <b-button
                        size="14"
                        variant="outline-secondary"
                        @click="uploadFile(row.item, criteria)"
                      >
                        Upload
                      </b-button>
                    </b-col>
                  </b-row>
                </b-row>
              </b-card>
              <b-card>
                <b-button
                  size="sm"
                  variant="outline-secondary"
                  @click="row.toggleDetails"
                >
                  Hide Details
                </b-button>
              </b-card>
            </template>
            <template #cell(name)="name">
              <div v-html="name.value" />
            </template>
          </b-table>

          <!-- Spacer -->
          <hr class="project-spacing">

          <!-- placeholder -->
          <div v-if="criteria.additional_notes">
            <label for="textarea-default">Internal Notes</label>
            <quill-editor
              v-model="criteria.additional_notes"
              :disabled="readOnly"
              :exercise="snowOption"
            />
          <!-- <span v-html="criteria.placeholder"></span> -->
          </div>
          <b-col cols="12">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              @click="submitNote(criteria)"
            >
              Update Note
            </b-button>
          </b-col>
          <!-- placeholder -->

          <!-- Spacer -->
          <hr class="project-s  pacing">

          <!-- comment -->
          <b-col
            id="comment"
            cols="12"
            class="mt-2"
          >
            <h6 class="section-label">
              Comment
            </h6>
            <b-card
              v-for="(comment, cidx) in criteria.comments"
              :key="cidx"
            >
              <b-media no-body>
                <b-media-aside class="mr-75">
                  <b-avatar
                    :src="comment.avatar"
                    size="38"
                  />
                </b-media-aside>
                <b-media-body>
                  <h6 class="font-weight-bolder mb-25">
                    {{ comment.user.first_name }} {{ comment.user.last_name }}
                    <b-badge variant="light-success">
                      {{ comment.role }}
                    </b-badge>
                  </h6>
                  <b-card-text>{{ comment.created_at }}</b-card-text>
                  <b-card-text>
                    {{ comment.comment }}
                  </b-card-text>
                </b-media-body>
              </b-media>
            </b-card>
          </b-col>
          <!--/ blog comment -->

          <!-- Spacer -->
          <hr class="project-s  pacing">

          <!-- Leave a Blog Comment -->
          <b-col
            v-if="criteria.approval_status !== 4 && !readOnly"
            cols="12"
            class="mt-2"
          >
            <h6 class="section-label">
              Leave a Comment
            </h6>
            <b-card>
              <b-form>
                <b-row>
                  <b-col cols="12">
                    <b-form-group class="mb-2">
                      <b-form-textarea
                        v-model="criteriaComment"
                        name="textarea"
                        rows="4"
                        placeholder="comment here"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col cols="12">
                    <b-button
                      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                      variant="primary"
                      @click="submitComment(criteria)"
                    >
                      Post Comment
                    </b-button>
                  </b-col>
                </b-row>
              </b-form>
            </b-card>
          </b-col>
          <!--/ Leave a Blog Comment -->

          <template #code>
            {{ codeRowDetailsSupport }}
            {{ codeFormatterCallback }}
          </template>
        </app-collapse-item>
      </app-collapse>

      <!--/ collapse -->
    </div>
  </b-overlay>
</template>

<script>
import {
  BAvatar,
  BBadge,
  BCard,
  BTable,
  BButton,
  BFormCheckbox,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BMedia,
  BMediaAside,
  BMediaBody,
  BCardText,
  BForm,
  BFormTextarea,
  BFormFile,
  BLink,
  BOverlay,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import {
  ref, onUnmounted,
} from '@vue/composition-api'
import router from '@/router'
import store from '@/store'
import Ripple from 'vue-ripple-directive'
// eslint-disable-next-line
import 'quill/dist/quill.core.css'
// eslint-disable-next-line
import 'quill/dist/quill.snow.css'
// eslint-disable-next-line
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItemCustom.vue'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import masterDrStoreModule from './masterDrStoreModule'
import { codeFormatterCallback, codeRowDetailsSupport } from './code'

Vue.use(VueCookies)
// set default config
Vue.$cookies.config('7d')

export default {
  directives: {
    Ripple,
  },
  components: {
    BAvatar,
    BBadge,
    BCard,
    BTable,
    BButton,
    BFormCheckbox,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    AppCollapseItem,
    AppCollapse,
    BMedia,
    BMediaAside,
    BMediaBody,
    BCardText,
    BForm,
    BFormTextarea,
    BFormFile,
    BOverlay,
    BLink,
    vSelect,
    quillEditor,
  },
  props: {
    exercise: {
      type: Object,
      default: () => {},
    },
    rerenderScoreParent: {
      type: Function,
      default: () => {},
    },
    rerenderCriteriaParent: {
      type: Function,
      default: () => {},
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      light: '',
      success: '',
      criteriaComment: '',
      commentCheckmark: '',
      commentKey: 0,
      docFields: [
        'show_attachment',
        { key: 'document.name', label: 'Document Name' },
        'attachment_size',
      ],
      documentFields: [
        { key: 'filename', label: 'Document Name' },
        { key: 'uploader_id', label: 'Creator' },
        { key: 'created_at', label: 'Created At' },
        'action',
      ],
      documentStatus: [
        {
          1: 'belum diserahkan', 2: 'belum memenuhi tolok ukur', 3: 'telah memenuhi tolok ukur',
        },
        {
          1: 'light-danger', 2: 'light-warning', 3: 'light-success',
        },
      ],
      statusOptions: [
        { value: 1, text: 'Idle', icon: 'SearchIcon' },
        { value: 2, text: 'Under Review', icon: 'SearchIcon' },
        { value: 3, text: 'Rejected', icon: 'SlashIcon' },
        { value: 4, text: 'Accepted', icon: 'CheckCircleIcon' },
      ],
      exerciseTypeOptions: [
        { value: 'score', text: 'Max Score' },
        { value: 'prequisite', text: 'Prequisite' },
      ],
      codeFormatterCallback,
      codeRowDetailsSupport,
      snowOption: {
        theme: 'snow',
      },
      disabled: true,
    }
  },
  computed: {
  },
  mounted() {
    // eslint-disable-next-line prefer-arrow-callback
    this.$nextTick(() => {
      this.activateAccordion()
    })
  },
  setup() {
    const DR_APP_STORE_MODULE_NAME = 'app-dr-detail'

    // Register module
    if (!store.hasModule(DR_APP_STORE_MODULE_NAME)) store.registerModule(DR_APP_STORE_MODULE_NAME, masterDrStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(DR_APP_STORE_MODULE_NAME)) store.unregisterModule(DR_APP_STORE_MODULE_NAME)
    })
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
    // eslint-disable-next-line
    submitComment(criteria) {
      this.isLoading = true
      this.updateCriteriaId(criteria)
      const initCommentData = {
        criteriaScoringID: criteria.id,
        comment: this.criteriaComment,
      }

      // eslint-disable-next-line
      const commentData = ref(JSON.parse(JSON.stringify(initCommentData)))

      this.$http.post(`/engine-rest/new-building/criteria_scoring/${criteria.id}/comments`, commentData.value)
        .then(() => {
          this.isLoading = false
          this.rerenderCriteria()
          this.showToast('success', 'Saved', 'Comment successfully saved')
        }).catch(() => {
          this.isLoading = false
          this.showToast('danger', 'Cannot Save', 'There is error when submit comment, contact administrator')
        })
    },
    submitNote(criteria) {
      this.isLoading = true
      this.updateCriteriaId(criteria)

      const initAdditionalNoteData = {
        additionalNotes: criteria.additional_notes,
      }

      // eslint-disable-next-line
      const additionalNoteData = ref(JSON.parse(JSON.stringify(initAdditionalNoteData)))

      this.$http.post(`/engine-rest/new-building/criteria_scoring/${criteria.id}/additional_notes`, additionalNoteData.value)
        .then(() => {
          this.isLoading = false
          this.rerenderCriteria()
          this.showToast('success', 'Saved', 'Internal note successfully saved')
        }).catch(() => {
          this.isLoading = false
          this.showToast('danger', 'Cannot Save', 'There is error when submit internal note, contact administrator')
        })
    },
    uploadFile(document, criteria) {
      if (document.files === undefined) {
        return
      }
      this.isLoading = true
      this.updateCriteriaId(criteria)

      const request = new FormData()
      for (let i = 0; i < document.files.length; i += 1) {
        request.append('files', document.files[i])
      }
      request.append('document_id', document.id)
      request.append('task_id', router.currentRoute.params.id)
      const config = {
        header: {
          'Content-Type': 'multipart/form-data',
        },
      }
      this.$http.post('/engine-rest/new-building/attachments', request, config).then(() => {
        this.isLoading = false
        this.rerenderCriteria()
        this.showToast('success', 'Saved', 'Attachment successfully saved')
      }).catch(() => {
        this.isLoading = false
        this.showToast('danger', 'Cannot Save', 'There is error when submit attachment, contact administrator')
      })
    },
    getAttachment(attachment) {
      this.isLoading = true
      this.$http.get(`/engine-rest/new-building/attachments/${attachment.id}`).then(response => {
        // window.open(response.data.url)
        const downloadLink = document.createElement('a')
        downloadLink.href = response.data.url
        downloadLink.download = response.data.filename
        downloadLink.target = '_blank'
        downloadLink.rel = 'noopener noreferrer'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)

        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
        this.showToast('danger', 'Cannot Load Attachment', 'There is error when load attachment, contact administrator')
      })
    },
    deleteAttachment(attachment, criteria) {
      this.isLoading = true
      this.updateCriteriaId(criteria)
      this.$http.delete(`/engine-rest/new-building/attachments/${attachment.id}`).then(() => {
        this.isLoading = false
        this.rerenderCriteria()
        this.showToast('success', 'Deleted', 'Attachment successfully delete')
      }).catch(() => {
        this.isLoading = false
        this.showToast('danger', 'Cannot Delete', 'There is error when delete attachment, contact administrator')
      })
    },
    takeScore(criteria) {
      this.isLoading = true
      this.updateCriteriaId(criteria)
      const initCriteriaScoringData = {
        submittedScore: criteria.submitted_score,
      }

      // eslint-disable-next-line
      const criteriaScoringData = ref(JSON.parse(JSON.stringify(initCriteriaScoringData)))

      this.$http.post(`/engine-rest/new-building/criteria_scoring/${criteria.id}/take_score`, criteriaScoringData.value).then(() => {
        this.isLoading = false
        this.rerenderCriteria()
        this.rerenderScoreParent()
        this.showToast('success', 'Saved', 'Take score successfully')
      }).catch(error => {
        this.isLoading = false
        this.showToast('danger', 'Cannot Take Score', error.response.data.message)
      })
    },
    untakeScore(criteria) {
      this.isLoading = true
      this.updateCriteriaId(criteria)
      this.$http.post(`/engine-rest/new-building/criteria_scoring/${criteria.id}/untake_score`).then(() => {
        this.isLoading = false
        this.rerenderCriteria()
        this.rerenderScoreParent()
        this.showToast('success', 'Saved', 'Untake score successfully')
      }).catch(error => {
        this.isLoading = false
        this.showToast('danger', 'Cannot Untake Score', error.response.data.message)
      })
    },
    takeModifier(modifier, exercise) {
      this.isLoading = true
      this.updateCriteriaId(exercise.criterias[0])

      const request = new FormData()
      request.append('enabled', modifier.enabled)
      const config = {
        header: {
          'Content-Type': 'multipart/form-data',
        },
      }

      this.$http.post(`/engine-rest/new-building/exercise_score_modifier/${modifier.id}/enabled`, request, config).then(() => {
        this.isLoading = false
        this.rerenderCriteria()
        this.rerenderScoreParent()
        this.showToast('success', 'Saved', 'Update checklist successfully')
      }).catch(error => {
        this.isLoading = false
        this.showToast('danger', 'Cannot Update checklist', error.response.data.message)
      })
    },
    rerenderScore() {
      this.rerenderScoreParent()
    },
    rerenderCriteria() {
      this.rerenderCriteriaParent()
    },
    updateCriteriaId(criteria) {
      Vue.$cookies.set('_client_dr_criteria_id', criteria.id)
    },
    forceRerenderComment() {
      this.commentKey += 1
    },
    translateStatus(criteria) {
      // eslint-disable-next-line
      const filtered = this.statusOptions.filter(f => { 
        // eslint-disable-next-line
        return f.value === criteria.approval_status
      })
      return filtered[0].text
    },
    translateExerciseType(exercise) {
      // eslint-disable-next-line
      const filtered = this.exerciseTypeOptions.filter(f => { 
        // eslint-disable-next-line
        return f.value === exercise.exercise.exercise_type
      })
      return filtered[0].text
    },
    scoreDictionary(criteria) {
      const maxScore = criteria.criteria.score
      const scoreArray = []
      for (let index = 0; index <= maxScore; index += 1) {
        scoreArray.push({ value: index, text: index.toString() })
      }

      return scoreArray
    },
    activateAccordion() {
      const criteriaId = Vue.$cookies.get('_client_dr_criteria_id')
      if (this.$refs[`collapse-item-ref-${criteriaId}`] !== undefined) {
        this.$refs[`collapse-item-ref-${criteriaId}`][0].updateVisible(true)
      }
    },
    eligibleScoreModifier(exercise) {
      return exercise.modifiers.length > 0
    },
    exerciseMaxScore(exercise) {
      if (exercise.exercise.max_score === undefined) {
        return undefined
      }
      const filtered = exercise.modifiers.filter(m => m.enabled === true)

      let modifiedScore = 0.0
      filtered.forEach(f => {
        modifiedScore += f.master_score_modifier.score_modifier
      })
      return exercise.exercise.max_score + modifiedScore
    },
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/pages/app-email.scss";
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
