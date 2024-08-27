<template>
  <v-menu :value="opened" :position-x="x" :position-y="y" absolute offset-y @input="close">
    <v-list dense min-width="150" max-height="400" class="overflow-y-auto">
      <v-list-item>
        <v-text-field
          label="Select a Label"
          v-model="searchQuery"
          autofocus
        />
      </v-list-item>
      <v-list-item v-for="(label, i) in labels" :key="i" @click="onLabelSelected(label.id)">
        <v-list-item-action v-if="hasAnySuffixKey">
          <v-chip
            v-if="label.suffixKey"
            :color="label.backgroundColor"
            outlined
            small
            v-text="label.suffixKey"
          />
          <span v-else class="mr-8" />
        </v-list-item-action>
        <v-list-item-content>
          <v-chip
            :color="label.backgroundColor"
            :text-color="$contrastColor(label.backgroundColor)"
            small
            v-text="label.text"
          />
          <span v-text="label.description" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import { LabelDTO } from '~/services/application/label/labelData';
export default Vue.extend({
  props: {
    projectId: {
      type: String,
      default: '',
      required: true
    },
    opened: {
      type: Boolean,
      default: false,
      required: true
    },
    selectedLabel: {
      type: Object,
      default: null,
      required: false
    },
    x: {
      type: Number,
      default: 0,
      required: true
    },
    y: {
      type: Number,
      default: 0,
      required: true
    }
  },

  data() {
    return {
      searchQuery: '',
      startOffset: 0,
      endOffset: 0,
      entity: null as any,
      fromEntity: null as any,
      toEntity: null as any,
      labels: [] as LabelDTO[],
    }
  },

  computed: {
    hasAnySuffixKey(): boolean {
      return this.labels.some((label: any) => label.suffixKey !== null)
    },

    value: {
      get() {
        return this.selectedLabel
      },
      set(labelId: number) {
        this.onLabelSelected(labelId)
      }
    }
  },
  watch: {
    async searchQuery() {
      if (this.searchQuery.length > 0) {
        await this.doSearch(this.searchQuery)
      } else {
        this.labels = []
      }
    }
  },
  methods: {
    close() {
      // Todo: a bit hacky. I want to fix this problem.
      // https://github.com/vuetifyjs/vuetify/issues/10765
      this.$nextTick(() => {
        if (this.$refs.autocomplete) {
          ;(this.$refs.autocomplete as any).selectedItems = []
        }
        this.searchQuery = ''
      })
      this.$emit('close')
    },

    async doSearch(search: string) {
      const result = await this.$services.spanType.textSearch(this.projectId, search, 10)
      this.labels = result;
    },

    onLabelSelected(labelId: number) {
      this.$emit('click:label', labelId)
      this.close()
    }
  }
})
</script>
