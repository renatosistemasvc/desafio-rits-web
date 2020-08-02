<template>
    <div>
        <div class="list-product">
            <ul>
                <li class="btn-open-novo-pedido">
                    <div class="u-text-right">
                        <el-button @click="openNovoPedido()" size="small" type="primary">
                            <i class="fas fa-plus"></i>
                            NOVO PEDIDO
                        </el-button>                                
                    </div>
                </li>
                <li v-for="(item, i) in sales" :key="i" class="item-sale">
                    <a href="javascript:void(0)">
                        <div class="image-product">
                            <img src="https://cdn.seu.menu/uploads/avatar/99415-2020-07-16-19-06.png">
                        </div>
                        <div class="description-product">
                            <h3>{{ $moment(item.date).format('DD/MM/YYYY HH:mm:ss') }}</h3> 
                            <b>Valor: R$ {{ item.price_sale }}</b>
                            <i>Status: {{ $CONSTANTS.STATUS_SALES[item.status] }}</i>                            
                        </div>
                        <div class="info-item">

                            <div v-if="item.status == 5" class="price-product sale-canceled">
                                <i class="fas fa-ban"></i>
                            </div>

                            <div v-if="item.status != 5" @click="cancelSale(item)" class="price-product">
                                <i class="far fa-trash-alt"></i>
                            </div>
                        </div>
                    </a>
                </li>
                <li v-if="paginate.qtdItens > 10">      
                    <div class="u-text-right u-mt-10">              
                        <el-pagination :total="paginate.qtdItens" @current-change="getPagePagination" :page-size="10" background layout="prev, pager, next" small></el-pagination>
                    </div>
                </li>               
            </ul>
        </div>     
    </div>
</template>
<script>

const Big = require('big.js');
import Vue from 'vue'

export default {
    data: () => ({
        loadingSales: false,
        dialogAddProduct: false,
        sales: [],
        paginate: {
            page: 1,
            qtdItens: null,
        }
    }),
    mounted(){

        this.getAllSales();
    },
    methods:{
        cancelSale(item){

            this.$msgbox.confirm('Tem certeza que deseja cancelar este pedido?', 'Atenção', { confirmButtonText: 'Sim', cancelButtonText: 'Não', type: 'warning' }).then(() => {

                this.$axios.get(`${this.$store.state.baseUrlApi}/api/sale/cancelSale/${item.id}`, this.$store.getters.getHeaderAuthClient).then(response => {

                    if(typeof response.data.erro !== 'undefined'){

                        this.$message({ message: response.data.erro, type: 'warning', duration: 5000 });
                                    
                    }else{

                        this.$message({ message: 'Pedido cancelado com sucesso!', type: 'success', duration: 5000 });
                        this.getAllSales();
                    }                   

                }).catch((error) => { this.$store.commit('throwException', error); });

            }).catch(()=>{});
            
        },
        openNovoPedido(){

            this.$router.push('/novo-pedido');  
        },
        getAllSales(){

            this.loadingSales = true;
            this.sales = [];

            this.$axios.post(`${this.$store.state.baseUrlApi}/api/sale/getAllPaginate?page=${this.paginate.page}`, {}, this.$store.getters.getHeaderAuthClient).then(response => {

                this.sales = response.data.data;
                this.paginate.qtdItens = response.data.total;
                this.loadingSales = false;

            }).catch((error) => { this.$store.commit('throwException', error); });        
        },
        getPagePagination(page){
          this.paginate.page = page;
          this.getAllSales();
        }      
    }
}
</script>