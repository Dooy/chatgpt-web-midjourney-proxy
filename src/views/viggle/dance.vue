 <script setup lang="ts">
 import DcInput from './dcInput.vue';
 import DcList from './dcList.vue';

 </script>
<template>

<div class="flex w-full h-full   ">
    <div class="w-[300px] h-full  overflow-y-auto ">
         <DcInput/>
    </div>
    <div class=" flex-1  h-full bg-[#fafbfc] pt-2 dark:bg-[#18181c] overflow-y-auto " >
        <DcList/>
    </div>
     
</div>
</template> 