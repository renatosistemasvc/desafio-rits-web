<template>
    
    <div class="main">
        <c-panel>
            <form-product :paramId="$route.params.id" v-on:onSubmitProduct="onSubmitProduct"></form-product>
        </c-panel>
    </div>
    
</template>
<script>

import formProduct from "./form"

export default {
    methods:{

        onSubmitProduct(){

            this.$router.push('/admin/produto');  
        }
    },
    components:{ formProduct }
}
</script>
