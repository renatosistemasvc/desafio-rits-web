<template>
    <div>

        <el-form @submit.native.prevent="onSubmitProduct" style="min-height: 130px;" v-loading="editProduct && !dados.id" :model="dados" ref="dados" label-position="top">
            <div v-if="!editProduct || dados.id">

                <el-row :gutter="10">
                    <el-col :xs="24" :sm="16" :md="16">
                        <el-form-item label="Nome" prop="name" :rules="[$requiredBlur]" key="name">
                            <el-input v-model="dados.name" maxlength="191"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="8" :md="8" class="input-money">
                        <el-form-item  label="Preço" prop="price" :rules="[$requiredBlur]" key="price">
                            <money v-model="dados.price" v-bind="{ decimal: ',', thousands: '.', prefix: 'R$ ', precision: 2, masked: false }"></money>
                        </el-form-item>
                    </el-col>
                </el-row>                 
                <el-row :gutter="10">
                  <el-col :xs="24" :sm="24" :md="24">
                      <el-form-item label="Descrição" prop="description"  key="description">
                          <el-input :rows="5" type="textarea" v-model="dados.description"></el-input>
                      </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="24">
                        <el-form-item class="u-text-right u-mt-15">
                            <el-button type="primary" native-type="submit">SALVAR</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>

    </div>
</template>
<script>

export default {
    props: ['paramId'],
    data: () => ({
        editProduct: false,
        alert: false,
        dados: {
            id: '',
            nome: '',
            description: '',
            price: ''
            
        }

    }),
    mounted () {

    },
    methods:{
        getProductById(id){

            this.$axios.get(`${this.$store.state.baseUrlApi}/api/product/getById/` + id, this.$store.getters.getHeaderAuthAdmin).then(response => {

                this.dados = JSON.parse(JSON.stringify(response.data));
 
            }).catch((error) => { this.$store.commit('throwException', error); });

        },
        onSubmitProduct(){

            this.$refs.dados.validate((valid) =>{ if(valid){
 
                window.eventBus.$emit('loading', true);                

                if(this.editProduct){

                    this.$axios.post(`${this.$store.state.baseUrlApi}/api/product/update/` + this.dados.id, this.dados, this.$store.getters.getHeaderAuthAdmin).then(response => {

                        window.eventBus.$emit('loading', false);
                        window.eventBus.$emit('alert', {msg: 'Sucesso! - Operação realizada com Sucesso!', type: 'success'});
                        
                        this.$emit('onSubmitProduct');

                    }).catch((error) => { window.eventBus.$emit('loading', false); this.$store.commit('throwException', error); });

                }else{

                    this.$axios.post(`${this.$store.state.baseUrlApi}/api/product/store`, this.dados, this.$store.getters.getHeaderAuthAdmin).then(response => {
                    
                        window.eventBus.$emit('loading', false);
                        window.eventBus.$emit('alert', {msg: 'Sucesso! - Operação realizada com Sucesso!', type: 'success'});

                        this.$emit('onSubmitProduct');

                    }).catch((error) => { window.eventBus.$emit('loading', false); this.$store.commit('throwException', error); });

                }

            }else{
                window.eventBus.$emit('alert', {msg: 'Campos obrigatórios não foram preenchidos.', type: 'warning'});
            }});
        },
        resetFormProduct(){
          
            this.dados = { id: '', nome: '', descricao: '', ativa: '', emDestaque: null, imagem: '' };
            this.$refs.dados.clearValidate();
        },
        formatData(field, size = null){

            //TRATA OS INPUTS - LETRA MAIÚCULA 
                        
            if(!this.dados[field])
                return false;

            if(size && this.dados[field].length < size)
                this.dados[field] = '';            

            this.dados[field] = this.dados[field].toUpperCase();

            this.dados[field] = this.$removerAcentos(this.dados[field]);
        }
    },
    watch: {
        paramId: {
            immediate: true,
            handler (value) {

                if(value){

                    this.getProductById(value);
                    this.editProduct = true;
                } 
            }
        },
    }
}
</script>
