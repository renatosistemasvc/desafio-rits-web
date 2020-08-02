<template>
    <div>

        <el-row :gutter="10" class="u-mt-10 u-mb-20">
            <el-col :xs="24" :sm="6" :md="6">
                <el-date-picker
                    placeholder="Data do Pedido"
                    size="small"
                    style="width: 100%"
                    @change="loadingSale()"
                    v-model="filtro.periodo"
                    type="daterange"
                    range-separator="a"
                    start-placeholder=""
                    end-placeholder=""
                    format="dd/MM/yyyy" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-col>
            <el-col :xs="24" :sm="10" :md="10">
                <el-input size="small" v-model="filtro.client_name" placeholder="Pesquisar por cliente..." @keyup.native.enter="loadingSale"></el-input>
            </el-col>
            <el-col :xs="24" :sm="8" :md="8">
                <el-select clearable size="small" placeholder="Status" v-model="filtro.status" @change="loadingSale">
                    <el-option v-for="(item, i) in $CONSTANTS.STATUS_SALES" :key="i" :label="item" :value="parseInt(i)"></el-option>
                </el-select>
            </el-col>
        </el-row>

        <div class="container-table">
            <table v-loading="!statusList" class="table table-striped">
                <thead>
                    <tr>
                        <th style="width: 70px;">Cod.</th>
                        <th>Cliente</th>
                        <th>Data</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th style="width: 150px;" class="u-text-center">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.client.name }}</td>
                        <td>{{ $moment(item.date).format('DD/MM/YYYY HH:mm:ss') }}</td>
                        <td>R$ {{ formatPrice(item.price_sale) }}</td>
                        <td>{{ $CONSTANTS.STATUS_SALES[item.status] }}</td>
                        <td class="u-text-center acao">

                            <el-button @click="showFormUpdateStatus(item)" title="Alterar Status do Pedido" type="primary" size="mini">
                                <i class="fas fa-exchange-alt"></i>
                            </el-button>

                            <el-button @click="showInfo(item)" title="Visualizar Detalhes" type="info" size="mini">
                                <i class="fas fa-search"></i>
                            </el-button>

                            <el-button @click="deleteSale(item.id)" title="Excluir" type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <el-row :gutter="10" v-if="statusList">
                <el-col :xs="24" :sm="12" :md="12">
                    <div class="u-text-left u-mt-10">
                        Mostrando {{ paginate.from }} até {{ paginate.to }} de {{ paginate.qtdItens }} registros encontrados.
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" v-if="paginate.qtdItens > 20">
                    <div class="u-text-right">
                            <el-pagination :current-page='paginate.page' class="u-mt-10" :total="paginate.qtdItens" @current-change="getPagePagination" :page-size="20" background layout="prev, pager, next" small></el-pagination>
                        </div>
                </el-col>
            </el-row>
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

        <el-dialog :close-on-click-modal="false" title="ALTERAR STATUS DO PEDIDO" width="30%" :visible.sync="dialogUpdateStatus" v-on:close="resetFormUpdateStatus()">
            <div v-if="dialogUpdateStatus">
                
                <el-form @submit.native.prevent="onSubmitUpdateStatus" :model="formUpdateStatus" ref="formUpdateStatus" label-position="top">
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="24" :md="24">
                            <el-form-item label="Status" prop="status" :rules="[$requiredChange]" key="status">
                                <el-select v-model="formUpdateStatus.status">
                                    <el-option v-for="(item, i) in $CONSTANTS.STATUS_SALES" :key="i" :label="item" :value="parseInt(i)"></el-option>
                                </el-select>
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
                </el-form>                

            </div>
        </el-dialog>

    </div>
</template>
<script>

export default {
    data: () => ({
        dialogInfoSale: false,
        dialogUpdateStatus: false,
        statusList: false,
        filtro: {
            client_name: '',
            status: '',
            periodo: []
        },
        paginate: {
            page: 1,
            qtdItens: null,
            from: '',
            to: ''
        },
        items: [ ],
        saleSelected: {},
        formUpdateStatus:{
            sale_id: '',
            status: ''
        }
    }),
    mounted () {
      this.loadingSale()
    },
    methods: {
        onSubmitUpdateStatus(){

            this.$refs.formUpdateStatus.validate((valid) =>{ if(valid){
 
                window.eventBus.$emit('loading', true);                
               
                this.$axios.post(`${this.$store.state.baseUrlApi}/api/sale/updateStatus`, this.formUpdateStatus, this.$store.getters.getHeaderAuthAdmin).then(response => {

                    window.eventBus.$emit('loading', false);
                    window.eventBus.$emit('alert', {msg: 'Sucesso! - Operação realizada com Sucesso!', type: 'success'});
                    
                    this.dialogUpdateStatus = false;
                    this.loadingSale();

                }).catch((error) => { this.$store.commit('throwException', error); });

            }else{ this.$message({ message: 'Campos obrigatórios não foram preenchidos.', type: 'warning', duration: 5000 }) }});
        
        },
        showFormUpdateStatus(item){

            this.formUpdateStatus.status = item.status;
            this.formUpdateStatus.sale_id = item.id;

            this.dialogUpdateStatus = true;
        },
        showInfo(item){

            this.saleSelected = item;
            this.dialogInfoSale = true;
        },
        loadingSale(){

            this.statusList = false;
            this.items = [];

            this.$axios.post(`${this.$store.state.baseUrlApi}/api/sale/getAllPaginate/20?page=` + this.paginate.page, this.filtro, this.$store.getters.getHeaderAuthAdmin).then(response => {

                this.items = response.data.data;
                this.paginate.qtdItens = response.data.total;
                this.paginate.from = response.data.from;
                this.paginate.to = response.data.to;
                this.statusList = true;

            }).catch((error) => { this.$store.commit('throwException', error); });

        },
        deleteSale(id){

            this.$msgbox.confirm('Tem certeza que deseja excluir este pedido?', 'Atenção', { confirmButtonText: 'Sim', cancelButtonText: 'Não', type: 'warning' }).then(() => {

                window.eventBus.$emit('loading', true);
                    
                this.$axios.delete(`${this.$store.state.baseUrlApi}/api/sale/delete/` + id, this.$store.getters.getHeaderAuthAdmin).then(response => {
                            
                    window.eventBus.$emit('loading', false);
                    window.eventBus.$emit('alert', {msg: 'Sucesso! - Operação realizada com Sucesso!', type: 'success'});
                    this.loadingSale();

                }).catch((error) => { this.$message({ message: 'Ocorreu um erro!.', type: 'warning', duration: 5000 }); });

            }).catch(()=>{});

        },
        getPagePagination(page){
          this.paginate.page = page;
          this.loadingSale();
        },
        formatPrice(value) {

            if(!value)
                return '-';
            
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        resetFormUpdateStatus(){

            this.formUpdateStatus = { sale_id: '', status: '' };
        }
    }
}
</script>