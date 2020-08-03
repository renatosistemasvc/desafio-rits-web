<template>
    <div>

        <div class="list-product list-client">
            <ul>
                <li class="title-item-sale">
                    <span>{{ dados.itens.length + (dados.itens.length == 1 ? ' ITEM' : ' ITENS') }}</span>
                    <div>
                        <el-button v-if="dados.itens.length > 0" @click="onSubmitSale()" title="Adicionar Produto" size="small" type="success">
                            <i class="fas fa-plus"></i>
                            CONLUIR COMPRA
                        </el-button>
                        <el-button @click="openDialogAddProduct()" title="Adicionar Produto" size="small" type="primary" class="u-ml-5">
                            <i class="fas fa-plus"></i>
                            PRODUTO
                        </el-button>                                
                    </div>
                </li>
                <li v-for="(item, i) in dados.itens" :key="i" class="item-sale">
                    <a href="javascript:void(0)">
                        <div class="image-product">
                            <img src="/public/img/lanche.png">
                        </div>
                        <div class="description-product">
                            <h3>{{ item.name }}</h3> 
                            <b>{{ item.description }}</b>
                            <i>R$ {{ item.price }} / un</i>
                        </div>
                        <div class="info-item">
                            <div class="quanty-product">
                                <i class="u-text-right">
                                    <ul class="comp-update-quanty">
                                        <li @click="updateIncrementQuanty(i)">
                                            <div class="btn-update-quanty">
                                                <i class="fas fa-plus"></i>
                                            </div>
                                        </li>
                                        <li>    
                                            <div class="value-update-quanty">                                            
                                                {{ item.quanty }}
                                            </div>
                                        </li>
                                        <li @click="updateDecrementQuanty(i)">
                                            <div class="btn-update-quanty">
                                                <i class="fas fa-minus"></i>
                                            </div>
                                        </li>
                                    </ul> 
                                </i>
                            </div>
                            <div class="price-product">
                                R$ {{ calcSubTotal(i) }}
                            </div>
                        </div>
                    </a>
                </li>
                <li v-if="dados.itens.length > 0" class="total-sale">
                    <div class="container-total-sale">
                        <div class="title-total-sale">
                            Total
                        </div>
                        <div class="price-total-sale">
                            R$ {{ dados.total_sale }}
                        </div>
                    </div>
                </li>
                <li v-if="dados.itens.length == 0" style="border-bottom: 1px solid #e6e6e6;">
                    <div class="u-text-center u-mt-20 u-mb-20">
                        <i class="fas fa-utensils u-mr-5"></i>
                        nenhum produto
                    </div>
                </li>
            </ul>
        </div>

        <el-dialog :close-on-click-modal="false" title="Selecione um produto" width="70%" :visible.sync="dialogAddProduct" v-on:close="resetFormAddProduct()">
            <div v-if="dialogAddProduct">
                <div>
                    <div class="list-product-search">
                        <ul v-if="!loadingProducts">
                            <li v-for="(item, i) in produtos" :key="i" @click="addProductSale(item, i)" class="item-sale">
                                <a href="javascript:void(0)">
                                    <div class="description-product">
                                        <h3>{{ item.name }}</h3> 
                                        <b>{{ item.description }}</b>
                                    </div>
                                    <div class="info-item">
                                        <div class="price-product">
                                            R$ {{ item.price }}
                                        </div>
                                    </div>
                                </a>
                            </li>
                        </ul>

                        <div v-if="loadingProducts" class="loadingProducts">
                            <img src="/public/img/loading-bar.gif"> 
                        </div>
                        
                    </div>
                </div>
            </div>
        </el-dialog>
      
    </div>
</template>
<script>

const Big = require('big.js');
import Vue from 'vue'

export default {
    data: () => ({
        loadingProducts: false,
        dialogAddProduct: false,
        dados: {
            itens: [],
            total_sale: 0
        },
        formLogin:{
            email: '',
            password: ''
        },
        formRegister:{
            name: '',
            phone: '',
            andress: '',
            email: '',
            password: ''
        },
        produtos: []
    }),
    mounted(){
        
        if(this.$store.state.tokenClient){

            this.$store.dispatch('getUser', 'client');
        }
    },
    methods:{
        onSubmitSale(){

            if(this.$store.state.tokenClient){

                this.$axios.post(`${this.$store.state.baseUrlApi}/api/sale/store`, this.dados, this.$store.getters.getHeaderAuthClient).then(response => {
                    
                    this.$message({ message: 'Operação realizada com sucesso!.', type: 'success', duration: 5000 });
                    this.$router.push('/');

                }).catch((error) => { this.$store.commit('throwException', error) });
                
            }else{

                this.$store.commit('openDialogAutentication', {status: true, form: 'login'});
            }         
        },
        openDialogAddProduct(){

            this.getAllProduct();
            this.dialogAddProduct = true;
        },
        getAllProduct(){

            this.loadingProducts = true;
            this.produtos = [];

            this.$axios.get(`${this.$store.state.baseUrlApi}/api/product/getAll`, this.$store.getters.getHeaderAuthClient).then(response => {

                this.produtos = response.data;
                this.loadingProducts = false;

            }).catch((error) => { this.$store.commit('throwException', error) });
        },
        addProductSale(item, i){

            //VERIFICA SE O PRODUTO JÁ ESTÁ NO PEDIDO
            let semaphore = false;
            for(let i in this.dados.itens){

                if(this.dados.itens[i].produto_id == item.id){
                                        
                    semaphore = true;
                }
            }

            //SE NÃO, ADD
            if(!semaphore){

                Vue.set(item, 'quanty', 1);
                Vue.set(item, 'sub_total', 0);
                Vue.set(item, 'produto_id', item.id);

                this.dados.itens.push(item);
            
            //SE SIM, INCREMENTA
            }else{

                this.updateIncrementQuanty(i);
            }
           
            this.dialogAddProduct = false;
            
        },
        calcSubTotal(i){

            let price = new Big(this.dados.itens[i].price ? this.dados.itens[i].price : 0);
            let quanty = new Big(this.dados.itens[i].quanty ? this.dados.itens[i].quanty : 0);

            let subtotal = price.mul(quanty);

            this.dados.itens[i].sub_total = subtotal.toFixed(2);

            this.calcTotal();

            return subtotal.toFixed(2);
        },
        calcTotal(){
            
            let total = new Big(0);

            for(let i in this.dados.itens){
               
                total = total.add(new Big(this.dados.itens[i].sub_total));
            }
           
            this.dados.total_sale = total.toFixed(2);
        },
        updateIncrementQuanty(i){

            this.dados.itens[i].quanty++;
            this.calcSubTotal(i);
        },
        updateDecrementQuanty(i){

            if(this.dados.itens[i].quanty > 1){

                this.dados.itens[i].quanty--;
                this.calcSubTotal(i);
            }            
        },
        resetFormAddProduct(){ }
    }
}
</script>
