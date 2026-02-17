<template>
  <section>
    <h1>Index Page</h1>
    <client-only>
      {{ isSyncing }}
      <input v-if="currentData" type="text" v-model="currentData.test">
    </client-only>
  </section>
</template>

<script setup lang="ts">
const { currentData, isSyncing } = useSession<{ test: string }>()
</script>
