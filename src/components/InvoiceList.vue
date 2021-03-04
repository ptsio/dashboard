<template>

  <!-- Table Container Card -->
  <b-card
    no-body
  >

    <div class="m-2">

      <!-- Table Top -->
      <b-row>

        <!-- Per Page -->
        <b-col
          cols="12"
          md="6"
          class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
        >
          <label>Entries</label>
          <v-select
            v-model="data.perPage"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="data.perPageOptions"
            :clearable="false"
            class="per-page-selector d-inline-block ml-50 mr-1"
          />
          <b-button
            variant="primary"
            :to="{ name: 'apps-invoice-add'}"
          >
            Add Record
          </b-button>
        </b-col>

        <!-- Search -->
        <b-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input
              v-model="data.searchQuery"
              class="d-inline-block mr-1"
              placeholder="Search..."
            />
            <v-select
              v-model="data.statusFilter"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="data.statusOptions"
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
      ref="refInvoiceListTable"
      :items="data.rows"
      responsive
      :fields="data.fields"
      primary-key="id"
      :sort-by.sync="data.sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="data.isSortDirDesc"
      class="position-relative"
    >

      <template #head(invoiceStatus)>
        <feather-icon
          icon="TrendingUpIcon"
          class="mx-auto"
        />
      </template>

      <!-- Column: Id -->
      <template #cell(id)="data">
        <b-link
          :to="{ name: 'apps-invoice-preview', params: { id: data.item.id }}"
          class="font-weight-bold"
        >
          #{{ data.value }}
        </b-link>
      </template>

      <!-- Column: Invoice Status -->
      <template #cell(invoiceStatus)="data">
        <b-avatar
          :id="`invoice-row-${data.item.id}`"
          size="32"
          :variant="`light-${resolveInvoiceStatusVariantAndIcon(data.item.invoiceStatus).variant}`"
        >
          <feather-icon
            :icon="resolveInvoiceStatusVariantAndIcon(data.item.invoiceStatus).icon"
          />
        </b-avatar>
        <b-tooltip
          :target="`invoice-row-${data.item.id}`"
          placement="top"
        >
          <p class="mb-0">
            {{ data.item.invoiceStatus }}
          </p>
          <p class="mb-0">
            Balance: {{ data.item.balance }}
          </p>
          <p class="mb-0">
            Due Date: {{ data.item.dueDate }}
          </p>
        </b-tooltip>
      </template>

      <!-- Column: Client -->
      <template #cell(client)="data">
        <b-media vertical-align="center">
          <template #aside>
            <b-avatar
              size="32"
              :src="data.item.avatar"
              :text="avatarText(data.item.client.name)"
              :variant="`light-${resolveClientAvatarVariant(data.item.invoiceStatus)}`"
            />
          </template>
          <span class="font-weight-bold d-block text-nowrap">
            {{ data.item.client.name }}
          </span>
          <small class="text-muted">{{ data.item.client.companyEmail }}</small>
        </b-media>
      </template>

      <!-- Column: Issued Date -->
      <template #cell(issuedDate)="data">
        <span class="text-nowrap">
          {{ data.value }}
        </span>
      </template>

      <!-- Column: Balance -->
      <template #cell(balance)="data">
        <template v-if="data.value === 0">
          <b-badge
            pill
            variant="light-success"
          >
            Paid
          </b-badge>
        </template>
        <template v-else>
          {{ data.value }}
        </template>
      </template>

      <!-- Column: Actions -->
      <template #cell(actions)="data">

        <div class="text-nowrap">
          <feather-icon
            :id="`invoice-row-${data.item.id}-send-icon`"
            icon="SendIcon"
            class="cursor-pointer"
            size="16"
          />
          <b-tooltip
            title="Send Invoice"
            class="cursor-pointer"
            :target="`invoice-row-${data.item.id}-send-icon`"
          />

          <feather-icon
            :id="`invoice-row-${data.item.id}-preview-icon`"
            icon="EyeIcon"
            size="16"
            class="mx-1"
            @click="$router.push({ name: 'apps-invoice-preview', params: { id: data.item.id }})"
          />
          <b-tooltip
            title="Preview Invoice"
            :target="`invoice-row-${data.item.id}-preview-icon`"
          />

          <!-- Dropdown -->
          <b-dropdown
            variant="link"
            toggle-class="p-0"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >

            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <b-dropdown-item>
              <feather-icon icon="DownloadIcon" />
              <span class="align-middle ml-50">Download</span>
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'apps-invoice-edit', params: { id: data.item.id } }">
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>
            <b-dropdown-item>
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </b-dropdown-item>
            <b-dropdown-item>
              <feather-icon icon="CopyIcon" />
              <span class="align-middle ml-50">Duplicate</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </template>

    </b-table>
    <div class="mx-2 mb-2">
      <b-row>

        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <span class="text-muted">Showing {{ 1 }} to {{ 10 }} of {{ 30 }} entries</span>
        </b-col>
        <!-- Pagination -->
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-end"
        >

          <b-pagination
            v-model="data.currentPage"
            :total-rows="data.totalInvoices"
            :per-page="data.perPage"
            first-number
            last-number
            class="mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon
                icon="ChevronLeftIcon"
                size="18"
              />
            </template>
            <template #next-text>
              <feather-icon
                icon="ChevronRightIcon"
                size="18"
              />
            </template>
          </b-pagination>

        </b-col>

      </b-row>
    </div>
  </b-card>

</template>

<script>
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink,
  BBadge, BDropdown, BDropdownItem, BPagination, BTooltip,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { avatarText } from '@core/utils/filter'

export default {
  name: 'InvoiceList',
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BTooltip,

    vSelect,
  },
  setup() {
    const resolveInvoiceStatusVariantAndIcon = status => {
      if (status === 'Partial Payment') return { variant: 'warning', icon: 'PieChartIcon' }
      if (status === 'Paid') return { variant: 'success', icon: 'CheckCircleIcon' }
      if (status === 'Downloaded') return { variant: 'info', icon: 'ArrowDownCircleIcon' }
      if (status === 'Draft') return { variant: 'primary', icon: 'SaveIcon' }
      if (status === 'Sent') return { variant: 'secondary', icon: 'SendIcon' }
      if (status === 'Past Due') return { variant: 'danger', icon: 'InfoIcon' }
      return { variant: 'secondary', icon: 'XIcon' }
    }

    const resolveClientAvatarVariant = status => {
      if (status === 'Partial Payment') return 'primary'
      if (status === 'Paid') return 'danger'
      if (status === 'Downloaded') return 'secondary'
      if (status === 'Draft') return 'warning'
      if (status === 'Sent') return 'info'
      if (status === 'Past Due') return 'success'
      return 'primary'
    }

    return {
      resolveInvoiceStatusVariantAndIcon,
      resolveClientAvatarVariant,
    }
  },
  data: () => ({
    data: {
      fields: [
        { key: 'id', label: '#', sortable: true },
        { key: 'invoiceStatus', sortable: true },
        { key: 'client', sortable: true },
        { key: 'total', sortable: true, formatter: val => `$${val}` },
        { key: 'issuedDate', sortable: true },
        { key: 'balance', sortable: true },
        { key: 'actions' },
      ],
      perPage: 10,
      perPageOptions: [10, 25, 50, 100],
      searchQuery: '',
      sortBy: 'id',
      isSortDirDesc: true,
      statusFilter: null,
      statusOptions: [
        'Downloaded',
        'Draft',
        'Paid',
        'Partial Payment',
        'Past Due',
      ],
      rows: [
        {
          id: 4222,
          invoiceStatus: 'Paid',
          client: {
            name: 'Andrew',
            email: 'imandrew@mail.com',
          },
          total: 29.99,
          issueDate: '19 Apr 2019',
          balance: 'Paid',
          actions: {
            primary: {
              name: 'Send Invoice',
              route: 'beratera',
            },
            secondary: {
              name: 'View Invoice',
              route: 'inv-route',
            },
            more: {
              name: 'More',
              route: null,
            },
          },
        },
        {
          id: 4222,
          invoiceStatus: 'Paid',
          client: {
            name: 'Andrew',
            email: 'imandrew@mail.com',
          },
          total: 29.99,
          issueDate: '19 Apr 2019',
          balance: 'Paid',
          actions: {
            primary: {
              name: 'Send Invoice',
              route: 'beratera',
            },
            secondary: {
              name: 'View Invoice',
              route: 'inv-route',
            },
            more: {
              name: 'More',
              route: null,
            },
          },
        },
        {
          id: 4222,
          invoiceStatus: 'Paid',
          client: {
            name: 'Andrew',
            email: 'imandrew@mail.com',
          },
          total: 29.99,
          issueDate: '19 Apr 2019',
          balance: 'Paid',
          actions: {
            primary: {
              name: 'Send Invoice',
              route: 'beratera',
            },
            secondary: {
              name: 'View Invoice',
              route: 'inv-route',
            },
            more: {
              name: 'More',
              route: null,
            },
          },
        },
        {
          id: 4222,
          invoiceStatus: 'Paid',
          client: {
            name: 'Andrew',
            email: 'imandrew@mail.com',
          },
          total: 29.99,
          issueDate: '19 Apr 2019',
          balance: 'Paid',
          actions: {
            primary: {
              name: 'Send Invoice',
              route: 'beratera',
            },
            secondary: {
              name: 'View Invoice',
              route: 'inv-route',
            },
            more: {
              name: 'More',
              route: null,
            },
          },
        },
        {
          id: 4222,
          invoiceStatus: 'Paid',
          client: {
            name: 'Andrew',
            email: 'imandrew@mail.com',
          },
          total: 29.99,
          issueDate: '19 Apr 2019',
          balance: 'Paid',
          actions: {
            primary: {
              name: 'Send Invoice',
              route: 'beratera',
            },
            secondary: {
              name: 'View Invoice',
              route: 'inv-route',
            },
            more: {
              name: 'More',
              route: null,
            },
          },
        },
      ],
    },
  }),
  methods: {
    avatarText,
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.invoice-filter-select {
  min-width: 190px;

  ::v-deep .vs__selected-options {
    flex-wrap: nowrap;
  }

  ::v-deep .vs__selected {
    width: 100px;
  }
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
