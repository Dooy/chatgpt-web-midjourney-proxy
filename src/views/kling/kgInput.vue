<script setup lang="ts">
import {NTabs, NTabPane} from 'naive-ui';
import kgInputVideo from './kgInputVideo.vue';
import kgInputImage from './kgInputImage.vue';
</script>
<template>
<div class="px-2">
    <n-tabs type="segment" animated size="small" default-value="video">
        <n-tab-pane name="video" :tab="$t('video.menu')">
            <kg-input-video/>
        </n-tab-pane>
        <n-tab-pane name="image" :tab="$t('mjchat.draw')">
            <kg-input-image/>
        </n-tab-pane>
    </n-tabs>
</div>
</template>