<template>
  <div>
    <b-row>
      <b-col
        v-if="adminShow"
        lg="3"
        sm="6"
      >
        <statistic-card-horizontal
          icon="ShoppingBagIcon"
          color="success"
          statistic-title="Tenant"
          :statistic="tenantCount"
        />
      </b-col>
      <b-col
        v-if="userShow"
        lg="3"
        sm="6"
      >
        <statistic-card-horizontal
          icon="UserIcon"
          color="primary"
          statistic-title="User"
          :statistic="userCount"
        />
      </b-col>

      <b-col
        v-if="adminShow"
        lg="4"
        md="6"
      >
        <admin-task-statistic />
      </b-col>

      <b-col
        v-if="adminShow"
        lg="4"
        md="6"
      >
        <tenant-list-statistic />
      </b-col>

      <b-col
        v-if="adminShow"
        lg="4"
        md="6"
      >
        <user-list-statistic />
      </b-col>

      <b-col
        v-if="verificatorShow"
        lg="4"
        md="6"
      >
        <verificator-task-statistic />
      </b-col>

      <b-col
        v-if="verificatorShow"
        lg="4"
        md="6"
      >
        <verificator-own-task-statistic />
      </b-col>

      <b-col
        v-if="userShow"
        lg="4"
        md="6"
      >
        <client-task-statistic />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'
import AdminTaskStatistic from './AdminTaskStatistic.vue'
import ClientTaskStatistic from './ClientTaskStatistic.vue'
import TenantListStatistic from './TenantListStatistic.vue'
import VerificatorTaskStatistic from './VerificatorTaskStatistic.vue'
import VerificatorOwnTaskStatistic from './VerificatorOwnTaskStatistic.vue'
import UserListStatistic from './UserListStatistic.vue'

export default {
  components: {
    BRow,
    BCol,
    StatisticCardHorizontal,
    AdminTaskStatistic,
    ClientTaskStatistic,
    TenantListStatistic,
    VerificatorTaskStatistic,
    VerificatorOwnTaskStatistic,
    UserListStatistic,
  },
  data() {
    return {
      userCount: 0,
      tenantCount: 0,
      user: null,
      adminShow: false,
      userShow: false,
      verificatorShow: false,
    }
  },
  computed: {
    userRole() {
      return this.user.group.id === 'superuser' || this.user.group.id === 'user'
    },
    adminRole() {
      return this.user.group.id === 'camunda-admin' || this.user.group.id === 'admin'
    },
    verificatorRole() {
      return this.user.group.id === 'verificator'
    },
  },
  created() {
    this.retrieveUser()
  },
  methods: {
    retrieveUser() {
      this.$http.get('engine-rest/user/profile')
        .then(res => {
          this.user = res.data
          if (this.userRole) {
            this.retrieveMemberCount()
            this.userShow = true
          }
          if (this.adminRole) {
            this.retrieveUserCount()
            this.retrieveTenantCount()
            this.adminShow = true
          }
          if (this.verificatorRole) {
            this.verificatorShow = true
          }
        })
    },
    retrieveMemberCount() {
      this.$http.get('engine-rest/user/members/count')
        .then(res => { this.userCount = res.data })
    },
    retrieveUserCount() {
      this.$http.get('engine-rest/user/user_count')
        .then(res => { this.userCount = res.data })
    },
    retrieveTenantCount() {
      this.$http.get('engine-rest/tenant/count')
        .then(res => { this.tenantCount = res.data.count })
    },
  },
}
</script>

<style>

</style>
