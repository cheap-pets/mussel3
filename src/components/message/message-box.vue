<template>
  <mu-dialog
    v-model:visible="visible"
    class="mu-message-box"
    :render-to-body="false"
    :buttons="buttons"
    close-button
    @button-click="onButtonClick"
    @close-button-click="onButtonClick">
    <!-- <div class="mu-box" layout="flex" align-items="center" flex="1">
      <mu-icon v-if="icon" class="mu-message-box_icon" :icon="icon" />
      <div class="mu-message-box_message" v-html="message" />
    </div> -->
    <div class="mu-box" flex="1" padding-x="4x" padding-y="0">
      <div class="mu-message_title mu-box" :type="type" margin-bottom="1x">
        <mu-icon reverse :icon="icon" />
        <span>{{ title }}</span>
      </div>
      <div class="mu-message_content" v-html="msgHTML" />
    </div>
  </mu-dialog>
</template>

<script>
  import Dialog from '../modal/dialog.vue'

  import { removeEventAttr } from '../../utils/html'

  export default {
    components: {
      'mu-dialog': Dialog
    },
    props: {
      icon: null,
      type: String,
      title: String,
      message: String,
      buttons: Array,
      callback: null
    },
    data () {
      return {
        visible: false
      }
    },
    computed: {
      msgHTML () {
        return removeEventAttr(this.message)
      }
    },
    mounted () {
      this.visible = true
    },
    methods: {
      onButtonClick (btn) {
        this.visible = false
        this.callback?.(btn?.raw || btn)
      }
    }
  }
</script>
