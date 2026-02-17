<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>

<script setup lang="ts">
const { create } = useCreateSession({ name: 'sessionId', collectionName: 'sessions', data: { test: 'test' } })
await create()
</script>
