<template>
  <b-card no-body>
    <div class="m-2">
      <b-row>
        <b-col
          cols="12"
          md="6"
          class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
        >
          <label>Entries</label>
          <v-select
            v-model="perPage"
            dir="ltr"
            :options="perPageOptions"
            :clearable="false"
            class="per-page-selector d-inline-block ml-50 mr-1"
          />
          <b-button
            variant="primary"
            :to="{ name: 'home' }"
          >
            Add Site
          </b-button>
        </b-col>
        <b-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input
              v-model="searchQuery"
              class="d-inline-block mr-1"
              placeholder="Search..."
            />
            <v-select
              v-model="statusFilter"
              dir="ltr"
              :options="statusOptions"
              class="invoice-filter-select"
              placeholder="Select Status"
            >
              <template #selected-option="{ label }">
                <span class="text-truncate overflow-hidden">
                  {{ label }}
                </span>
              </template>
            </v-select>
          </div>
        </b-col>
      </b-row>
    </div>
    <b-table
      ref="refSitesListTable"
      :items="fetchSites"
      responsive
      :fields="tableColumns"
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative"
    >
      <template #head(siteStatus)>
        <feather-icon
          icon="TrendingUpIcon"
          class="mx-auto"
        />
      </template>

      <template #cell(id)="data">
        <b-link
          :to="{ name: 'home' }"
          class="font-weight-bold"
        >
          #{{ data.value }}
        </b-link>
      </template>
    </b-table>
  </b-card>
</template>

<script>
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BLink,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import store from '@/store'
import { onUnmounted } from '@vue/composition-api'
import sitesStoreModule from '@/views/sites/sitesStoreModule'
import sitesList from './sitesList'

export default {
  name: 'Users',
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BLink,

    vSelect,
  },
  setup() {
    const SITES_LIST_STORE_MODULE_NAME = 'sites'

    // Register Module
    if (!store.hasModule(SITES_LIST_STORE_MODULE_NAME)) store.registerModule(SITES_LIST_STORE_MODULE_NAME, sitesStoreModule)

    // Un-Register Module
    onUnmounted(() => {
      if (store.hasModule(SITES_LIST_STORE_MODULE_NAME)) store.unregisterModule(SITES_LIST_STORE_MODULE_NAME)
    })

    const statusOptions = [
      'Active',
      'Disabled',
    ]

    const {
      fetchSites,
      tableColumns,
      perPage,
      currentPage,
      totalInvoices,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refSitesListTable,
      statusFilter,
      refetchData,
      resolveSitesStatusVariantAndIcon,
      resolveClientAvatarVariant,
    } = sitesList()

    return {
      fetchSites,
      tableColumns,
      perPage,
      currentPage,
      totalInvoices,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refSitesListTable,
      statusFilter,
      statusOptions,
      refetchData,
      resolveSitesStatusVariantAndIcon,
      resolveClientAvatarVariant,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
