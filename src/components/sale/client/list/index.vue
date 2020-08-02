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
                        <div class="image-product" @click="showInfo(item)">
                            <img src="/public/img/lanche.png">
                        </div>
                        <div class="description-product" @click="showInfo(item)">
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
        
        <el-dialog :close-on-click-modal="false" title="DETALHES DO PEDIDO" width="40%" :visible.sync="dialogInfoSale">
            <div v-if="dialogInfoSale">
                
                <div v-if="Object.keys(saleSelected).length !== 0">
                    <el-row :gutter="10" class="u-mt-20">
                        <el-col :xs="24" :sm="24" :md="24"> 
                            <dl>
                                <dt>CLIENTE:</dt>
                                <dd>{{ saleSelected.client.name }}</dd>
                            </dl>                            
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="24" :md="24"> 
                            <dl>
                                <dt>data:</dt>
                                <dd>{{ $moment(saleSelected.date).format('DD/MM/YYYY HH:mm:ss') }}</dd>
                            </dl>                            
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="24" :md="24"> 
                            <dl>
                                <dt>VALOR TOTAL:</dt>
                                <dd>R$ {{ formatPrice(saleSelected.price_sale) }}</dd>
                            </dl>                            
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="24" :md="24"> 
                            <dl>
                                <dt>STATUS:</dt>
                                <dd>{{ $CONSTANTS.STATUS_SALES[saleSelected.status] }}</dd>
                            </dl>                            
                        </el-col>
                    </el-row>

                    <h4>ITENS DO PEDIDO</h4>
                    
                    <ul>
                        <li v-for="(item, i) in saleSelected.itens_sale" :key="i" style="padding: 10px;">
                            <b style="display: block;">{{ item.product.name }}</b>
                            <i>SubTotal: {{ item.price_subtotal }} / {{ item.quanty }} un</i>
                        </li>
                    </ul>
                   
                    <el-row :gutter="10">
                        <el-col :xs="24" class="u-text-right">
                            <el-button size="small" type="danger" @click="dialogInfoSale = false">FECHAR</el-button>
                        </el-col>
                    </el-row>
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
        dialogInfoSale: false,
        loadingSales: false,
        dialogAddProduct: false,
        sales: [],
        paginate: {
            page: 1,
            qtdItens: null,
        },
        saleSelected: {},
    }),
    mounted(){

        this.getAllSales();
    },
    methods:{
        showInfo(item){

            console.log(item);

            this.saleSelected = item;
            this.dialogInfoSale = true;
        },
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
        formatPrice(value) {

            if(!value)
                return '-';
            
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        getPagePagination(page){
          this.paginate.page = page;
          this.getAllSales();
        }      
    }
}
</script>