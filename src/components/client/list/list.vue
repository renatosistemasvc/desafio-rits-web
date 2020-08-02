<template>
    <div>
        <el-row class="u-mt-10 u-mb-20">
            <el-col :xs="24" :sm="16" :md="16">
                <el-input size="small" v-model="filtro['name']" placeholder="Pesquisar cliente..." @keyup.native.enter="loadingClient"></el-input>
            </el-col>
        </el-row>
        <div class="container-table">
            <table v-loading="!statusList" class="table table-striped">
                <thead>
                    <tr>
                        <th style="width: 70px;">Cod.</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th style="width: 150px;" class="u-text-center">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in itens" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.email }}</td>
                        <td>{{ item.phone }}</td>
                        <td class="u-text-center acao"> 
                            <el-button @click="showInfo(item)" title="Visualizar Detalhes" type="info" size="mini">
                                <i class="fas fa-search"></i>
                            </el-button>
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

        <el-dialog :close-on-click-modal="false" title="DETALHES DO CLIENTE" width="60%" :visible.sync="dialogInfoClient">
            <div v-if="dialogInfoClient">
                
                <div v-if="Object.keys(clientSelected).length !== 0">
                    <el-row :gutter="10" class="u-mt-20">
                        <el-col :xs="24" :sm="24" :md="24"> 
                            <dl>
                                <dt>CLIENTE:</dt>
                                <dd>{{ clientSelected.name }}</dd>
                            </dl>                            
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="12" :md="12"> 
                            <dl>
                                <dt>EMAIL:</dt>
                                <dd>{{ clientSelected.email }}</dd>
                            </dl>                            
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12"> 
                            <dl>
                                <dt>TELEFONE:</dt>
                                <dd>{{ clientSelected.phone }}</dd>
                            </dl>                            
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="24" :md="24"> 
                            <dl>
                                <dt>ENDEREÇO:</dt>
                                <dd>{{ clientSelected.andress }}</dd>
                            </dl>                            
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :xs="24" class="u-text-right">
                            <el-button size="small" type="danger" @click="dialogInfoClient = false">FECHAR</el-button>
                        </el-col>
                    </el-row>
                </div>

            </div>
        </el-dialog>

    </div>
</template>
<script>

export default {
    data: () => ({
        dialogInfoClient: false,
        statusList: false,
        filtro: {
            name: ''
        },
        paginate: {
            page: 1,
            qtdItens: null,
            from: '',
            to: ''
        },
        itens: [ ],
        clientSelected: {}
    }),
    mounted () {
      this.loadingClient()
    },
    methods: {
        loadingClient(){

            this.statusList = false;
            this.itens = [];

            this.$axios.post(`${this.$store.state.baseUrlApi}/api/client/getAllPaginate?page=` + this.paginate.page, this.filtro, this.$store.getters.getHeaderAuthAdmin).then(response => {

                this.itens = response.data.data;
                this.paginate.qtdItens = response.data.total;
                this.paginate.from = response.data.from;
                this.paginate.to = response.data.to;
                this.statusList = true;

            }).catch((error) => { this.$store.commit('throwException', error); });

        },
        showInfo(item){

            this.clientSelected = item;
            this.dialogInfoClient = true;
        },
        getPagePagination(page){
          this.paginate.page = page;
          this.loadingClient();
        },
        formatPrice(value) {

            if(!value)
                return '-';
            
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
    }
}
</script>