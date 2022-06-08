<template>
  <transition-group name="mu-notifier-group" tag="div" class="mu-notifier-group">
    <div
      v-for="el in messages"
      :key="el.id"
      :link="!!el.callback || ''"
      class="mu-notifier"
      @click="onClick(el)">
      <div class="mu-message_title" :type="el.type">
        <mu-icon reverse :icon="el.icon" />
        <span>{{ el.title }}</span>
      </div>
      <div class="mu-message_content mu-text-ellipsis">
        {{ el.message }}
      </div>
    </div>
  </transition-group>
</template>

<script>
  export default {
    name: 'MusselNotifier',
    props: {
      messages: Array
    },
    methods: {
      onClick (message) {
        message.callback?.(message.detail)
      }
    }
  }
</script>
